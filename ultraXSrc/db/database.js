"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteDatabase = exports.DatabaseManager = void 0;
const databaseManager_1 = __importDefault(require("./databaseManager"));
exports.DatabaseManager = databaseManager_1.default;
const SQLiteDatabase = databaseManager_1.default('./db.sqlite3');
exports.SQLiteDatabase = SQLiteDatabase;
