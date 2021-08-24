"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectModel_1 = __importDefault(require("./ObjectModel"));
const ValuableField_1 = __importDefault(require("./ValuableField"));
class ObjectData extends ObjectModel_1.default {
    constructor(fields) {
        super(fields);
    }
    static from(model, data) {
        let vFields = [];
        for (let field of model.fields) {
            const value = data[field.name];
            vFields.push(new ValuableField_1.default(field.name, field.sqlType, field.sqlAttributes, value));
        }
        return new ObjectData(vFields);
    }
    as(constructor = undefined) {
        let jsObject = {};
        if (constructor) {
            jsObject = new constructor();
        }
        for (let field of this.fields) {
            const vField = field;
            jsObject[vField.name] = vField.get();
        }
        return jsObject;
    }
}
exports.default = ObjectData;
