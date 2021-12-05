import { HTTPFunctionHandler } from '../api/httpFunctionHandler';
export declare type BodyValidator = (body?: any) => boolean;
export declare type AsyncBody = (validate?: BodyValidator) => Promise<any>;
export declare function setBodyParser(contentType: string, parser: (payload: any) => any): void;
export default function asyncBodyParser(maxSize: number): HTTPFunctionHandler;
