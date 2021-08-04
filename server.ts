import express = require('express');
import fileupload = require('express-fileupload');
import bodyParser = require('body-parser');
import cors = require('cors');
import path = require('path');

import { manageRoutes } from './ultraXSrc/api/routesManager';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(fileupload());
app.use(bodyParser.json());

manageRoutes(app, path.join(__dirname, './routes'));

app.listen(PORT, () => {
    console.log(`Server listening at localhost:${PORT}`);
})