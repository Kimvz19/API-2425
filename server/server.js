
// SERVER

// packages worden ge-importeerd
//de dependies die in package.json staan
import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
// gebruikt liquid voor views
import sirv from 'sirv';

// 💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗


// geeft hier aan dat je liquid wil gebruiken
// gebruikt om templates te maken, template language
// vergelijkbaar met ejs

const engine = new Liquid({
  extname: '.liquid',
});




// als de route klopt wordt de url geprint
// server
const app = new App();


// Variables for api fetching
// variables for .env files

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const baseUrl = process.env.BASE_URL;




// request en response return 
app.get('/', async (req, res) => {
  try {
    // post request for access to token petfinder
    // petfinder uses OAuth2, prove i have access to the api
    const tokenResponse = await fetch('https://api.petfinder.com/v2/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: apiKey,
        client_secret: apiSecret
      })
    });

    // changing answer to json
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetching url with token
    const petfinder = await fetch(`${baseUrl}animals`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const petfinderData = await petfinder.json();
    console.log(petfinderData);

    // render je Liquid template
    return res.send(renderTemplate('server/views/detail.liquid', { title: 'Newhome', petfinderData }));


    // error notification
  } catch (error) {
    console.error('Problem with fetching data:', error);
    res.status(500).send('Something went wrong');
  }
});


const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  };

  return engine.renderFileSync(template, templateData);
};

// because i use a client server, i need to define the route 
app
  .use(logger())
  .use('/', sirv(process.env.NODE_ENV === 'development' ? 'client' : 'dist'))
  .use('/assets', sirv('assets'))
  .listen(3000, () => console.log('Server available on http://localhost:3000'));

