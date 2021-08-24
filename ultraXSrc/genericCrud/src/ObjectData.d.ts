import ObjectModel from "./ObjectModel";
import ValuableField from "./ValuableField";
declare class ObjectData extends ObjectModel {
    constructor(fields: ValuableField[]);
    static from(model: ObjectModel, data: any): ObjectData;
    as<T>(constructor?: (new () => T)): T;
}
export default ObjectData;
