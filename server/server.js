// SERVER

// 📦 packages worden geïmporteerd
import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';
import bodyParser from 'body-parser';
import { LocalStorage } from 'node-localstorage';

// 📄 Liquid engine setup
const engine = new Liquid({
  extname: '.liquid',
});

// 🌍 App + local storage
const app = new App();
const localStorage = new LocalStorage('./scratch');

// 📥 Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// 🔑 .env variabelen
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const baseUrl = process.env.BASE_URL;

// 🔧 Render template functie met dynamisch geladen favorieten
const renderTemplate = (template, data) => {
  const favoritesFromStorage = JSON.parse(localStorage.getItem('favorites') || '[]')
    .map(id => String(id)); // 🔁 converteer IDs naar string voor Liquid

  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data,
    favorites: favoritesFromStorage
  };

  return engine.renderFileSync(template, templateData);
};

// 📍 Index route
app.get('/', async (req, res) => {
  try {
    const page = req.query.page || 1;

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

// 🐶 Detailpagina route
app.get('/detail/:id', async (req, res) => {
  try {
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

    const response = await fetch(`${baseUrl}animals/${req.params.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const data = await response.json();
    const animalID = data.animal;

    if (!animalID) {
      return res.status(404).send('Dier niet gevonden');
    }

    return res.send(renderTemplate('server/views/detail.liquid', {
      title: animalID.name || 'Dier detail',
      animalID
    }));

  } catch (error) {
    console.error('Error fetching animal detail:', error);
    res.status(500).send('Er ging iets mis bij het ophalen van het dier');
  }
});

// ❤️ Favoriet toevoegen/verwijderen (toggle)
app.post('/favorite', (req, res) => {
  const animalId = req.body.animalId;
  if (!animalId) return res.status(400).send('Geen dier ID ontvangen');

  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

  if (favorites.includes(animalId)) {
    favorites = favorites.filter(id => id !== animalId);
    console.log('Verwijderd uit favorieten:', animalId);
  } else {
    favorites.push(animalId);
    console.log('Toegevoegd aan favorieten:', animalId);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
  res.redirect(req.headers.referer || '/');
});

// ⭐ Favorieten overzichtspagina
app.get('/favorites', async (req, res) => {
  const favoritesFromStorage = JSON.parse(localStorage.getItem('favorites') || '[]');

  if (favoritesFromStorage.length === 0) {
    return res.send(renderTemplate('server/views/favorites.liquid', {
      title: 'Favorieten',
      animals: []
    }));
  }

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

  const requests = favoritesFromStorage.map(id =>
    fetch(`${baseUrl}animals/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(res => res.json())
  );

  const results = await Promise.all(requests);
  const animals = results.map(r => r.animal).filter(Boolean);

  return res.send(renderTemplate('server/views/favorites.liquid', {
    title: 'Mijn Favorieten',
    animals
  }));
});

// 📡 Static bestanden & server starten
app
  .use(logger())
  .use('/', sirv(process.env.NODE_ENV === 'development' ? 'client' : 'dist'))
  .use('/assets', sirv('assets'))
  .listen(3000, () => console.log('Server available on http://localhost:3000'));
