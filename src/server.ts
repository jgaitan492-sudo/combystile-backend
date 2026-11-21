import 'dotenv/config';

import { app } from './app.js';

const PORT =
  Number(process.env.PORT) || 3000;

app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log('');
    console.log('======================================');
    console.log(' Combystile Backend iniciado');
    console.log('======================================');
    console.log(`Puerto: ${PORT}`);
    console.log(
      `Health: http://localhost:${PORT}/api/v1/health`
    );
    console.log('======================================');
    console.log('');
  }
);