import Field from "./Field";
import ObjectModel from "./ObjectModel";
import ValuableField from "./ValuableField";


class ObjectData extends ObjectModel {

    constructor(fields: ValuableField[]) {
        super(fields);
    }

    static from(model: ObjectModel, data: any): ObjectData {

        let vFields: ValuableField[] = [];
        for (let field of model.fields) {
            const value = data[field.name];
            vFields.push(
                new ValuableField(field.name, field.sqlType, field.sqlAttributes, value)
            );
        }

        return new ObjectData(vFields);
    }

    as<T>(constructor: (new () => T) = undefined) {

        let jsObject: any = {};
        if (constructor) {
            jsObject = new constructor();
        }
        for (let field of this.fields) {
            const vField = field as ValuableField;
            jsObject[vField.name] = vField.get();
        }
        return jsObject as T;
    }

}

export default ObjectData;