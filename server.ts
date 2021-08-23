import UltraX from './ultraXSrc/ultrax';
import path = require('path');

const PORT = 3000;

const server = new UltraX(PORT, path.join(__dirname, './routes'));
server
    .listen(() => console.log(`Server listening at http://localhost:${PORT}`))
    .bodyParser()
    .cors()
    .fileUpload()
