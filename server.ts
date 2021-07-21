import express = require('express');
import path = require('path');
import { manageRoutes } from './ultraXSrc/api/routesManager';
const app = express();
const PORT = 3000;

manageRoutes(app, path.join(__dirname, './routes'));

app.listen(PORT, () => {
    console.log(`Server listening at localhost:${PORT}`);
})