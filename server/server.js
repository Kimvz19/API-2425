
// SERVER

// packages worden ge-importeerd
import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';


const data = {
  'beemdkroon': {
    id: 'beemdkroon',
    name: 'Beemdkroon',
    image: {
      src: 'https://i.pinimg.com/736x/09/0a/9c/090a9c238e1c290bb580a4ebe265134d.jpg',
      alt: 'Beemdkroon',
      width: 695,
      height: 1080,
    }
  },
  'wilde-peen': {
    id: 'wilde-peen',
    name: 'Wilde Peen',
    image: {
      src: 'https://mens-en-gezondheid.infonu.nl/artikel-fotos/tom008/4251914036.jpg',
      alt: 'Wilde Peen',
      width: 418,
      height: 600,
    }
  }
}




const engine = new Liquid({
  extname: '.liquid',
});

// als de route klopt wordt de url geprint
const app = new App();

app
  .use(logger())
  .use('/', sirv('dist'))
  .listen(3000, () => console.log('Server available on http://localhost:3000'));

app.get('/', async (req, res) => {
  return res.send(renderTemplate('server/views/index.liquid', { title: 'Home', items: Object.values(data) }));
});

app.get('/plant/:id/', async (req, res) => {
  const id = req.params.id;
  const item = data[id];
  if (!item) {
    return res.status(404).send('Not found');
  }
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
