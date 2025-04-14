
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
// Voor index.liquid
app.get('/', async (req, res) => {
  try {
    const page = req.query.page || 1; // default is 1

    const tokenResponse = await fetch('https://api.petfinder.com/v2/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: apiKey,
        client_secret: apiSecret
      })
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const petfinder = await fetch(`${baseUrl}animals?page=${page}&limit=35`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const petfinderData = await petfinder.json();

    return res.send(renderTemplate('server/views/index.liquid', {
      title: 'Newhome',
      petfinderData,
      currentPage: Number(page),
    }));

  } catch (error) {
    console.error('Problem with fetching data:', error);
    res.status(500).send('Something went wrong');
  }
});


// Voor detail.liquid
app.get('/detail/:id', async (req, res) => {
  try {
    // Haal access token op
    const tokenResponse = await fetch('https://api.petfinder.com/v2/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: apiKey,
        client_secret: apiSecret
      })
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Haal detail van één dier op
    const response = await fetch(`${baseUrl}animals/${req.params.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const data = await response.json();
    const animal = data.animal;

    // Render detail.liquid met data van dit dier
    res.send(renderTemplate('server/views/detail.liquid', {
      title: animal.name,
      animal
    }));

  } catch (error) {
    console.error('Error fetching animal detail:', error);
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

