import path = require('path');
import NAEBServer from 'naeb';

const PORT = 3000;

const server = new NAEBServer(PORT, path.join(__dirname, './routes'));
server
    .useBodyParser()
    .useCors()
    .useFileUpload()
    .listen(() => console.log(`Server listening at http://localhost:${PORT}`))