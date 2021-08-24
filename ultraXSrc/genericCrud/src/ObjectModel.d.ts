import Field from "./Field";
declare class ObjectModel {
    fields: Field[];
    constructor(fields: Field[]);
    getField(name: string): Field | null;
}
export default ObjectModel;
