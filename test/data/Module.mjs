import Dependency, { NamedExportClass } from './Dependency.mjs';


/**
 * module class
 *
 * @private
 */
export default class ModuleClass extends Dependency {
    


    constructor(test) {
        super();
    }



    myMethod(param0, {
        optionNumber = 1,
        optionBool = true,
    }) {
        return 10;
    }
}