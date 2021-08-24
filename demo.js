"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ultrax_1 = __importDefault(require("./ultraXSrc/ultrax"));
const path = require("path");
const PORT = 3000;
const server = new ultrax_1.default(PORT, path.join(__dirname, './routes'));
server
    .useBodyParser()
    .useCors()
    .useFileUpload()
    .listen(() => console.log(`Server listening at http://localhost:${PORT}`));
