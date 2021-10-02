import path = require('path');
import UltraX from 'ultrax';

const PORT = 3000;

const server = new UltraX(PORT, path.join(__dirname, './routes'));
server
    .useBodyParser()
    .useCors()
    .useFileUpload()
    .listen(() => console.log(`Server listening at http://localhost:${PORT}`))