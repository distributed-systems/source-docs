class AClass {}
const constX = 2;
const functionN = () => {};
import DefaultImport from './240.000-export-dummy.mjs';
import { OtherCls } from './240.000-export-dummy.mjs';

let LaterAssignedValue;

LaterAssignedValue = class {};


const obj = {
    a: 1,
    fn: () => {},
};

export {
    AClass as default,
    functionN,
    constX,
    DefaultImport,
    OtherCls,
    obj,
    LaterAssignedValue,
};


export function directExportFunction() {};
export class directClassExport {};
export let changeableValue = true;
export const constValue = true;
export { DirectDefaultImport } from './240.000-export-dummy.mjs'; 