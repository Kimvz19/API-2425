
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

// 💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗

// als de route klopt wordt de url geprint
// server
const app = new App();


// ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️
// Variables for api fetching
// ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ 
// variables for .env files

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const baseUrl = process.env.BASE_URL;


// 💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗💗


// because i use a client server, i need to define the route 
app
  .use(logger())
  .use('/', sirv(process.env.NODE_ENV === 'development' ? 'client' : 'dist'))
  .listen(3000, () => console.log('Server available on http://localhost:3000'));



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

    // chancing answer to json
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

    // // render je Liquid template
    // return res.send(renderTemplate('server/views/index.liquid', {
    //   title: 'Home',
    //   animals: petfinderData.animals
    // }));

  // error notification
  } catch (error) {
    console.error('Problem with fetching data:', error);
    res.status(500).send('Something went wrong');
  }
});



// const petfinder = await fetch('https://api.petfinder.com/v2/'+apiKey);
//   const petfinder = await fetch(apiKey);
//   const petfinderData = await petfinder.json();
//   console.log(petfinderData);

//   return res.send(renderTemplate('server/views/index.liquid', { title: 'Home', animals: petfinderData }));
// });



app.get('/pokemon/:name/', async (req, res) => {
  // kan je iets opvragen
  const name = req.params.name;
  // voegt de data toe aan de url key
  const petfinder = await fetch(apiKey + name);

  return res.send(renderTemplate('server/views/detail.liquid', { title: `Detail page for ${id}`, item }));
});


const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  };

  return engine.renderFileSync(template, templateData);
};


// const apiUrl = 'https://dogapi.dog/api/v2/breeds';
// app.get('/api/dogs', async (req, res) => {
//   try {
//     const response = await fetch(apiUrl);
//     const json = await response.json();
//     res.json(json);
//   } catch (error) {
//     res.status(500).json({ error: 'Fout bij ophalen van API-data' });
//   }
// });

// const fetchData = async () => {
//   try {
//     const response = await fetch(apiUrl);
//     const json = await response.json();
//     console.log('API Response:', json);
//   } catch (error) {
//     console.error('Fout bij ophalen van data:', error);
//   }
// };

// fetchData();


// const apiUrl = 'https://dogapi.dog/api/v2/breeds';
// app.get('/api/dogs', async (req, res) => {
//   try {
//     const response = await fetch(apiUrl);
//     const json = await response.json();
//     res.json(json);
//   } catch (error) {
//     res.status(500).json({ error: 'Fout bij ophalen van API-data' });
//   }
// });

// const fetchData = async () => {
//   try {
//     const response = await fetch(apiUrl);
//     const json = await response.json();
//     console.log('API Response:', json);
//   } catch (error) {
//     console.error('Fout bij ophalen van data:', error);
//   }
// };

// fetchData();
