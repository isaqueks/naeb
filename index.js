const { default: NAEBServer, CrudModel, database, ObjectModel, Field } = require("ultrax");
const path = require("path");

const PORT = 3000;

const server = new NAEBServer(PORT, path.join(__dirname, './routes'));
server
    .listen(() => console.log(`Server listening at http://localhost:${PORT}`))
