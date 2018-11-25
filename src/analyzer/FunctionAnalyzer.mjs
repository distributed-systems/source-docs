import ParameterAnalyzer from './ParameterAnalyzer.mjs';
import BaseAnalyzer from '../BaseAnalyzer.mjs'
import FunctionDocumentation from '../documentation/FunctionDocumentation.mjs';
import log from 'ee-log';




export default class FunctionAnalyzer extends BaseAnalyzer {



    constructor(options) {
        super(options);

        this.documentation = new FunctionDocumentation();
    }





    getDocumentation() {
        return this.documentation;
    }




    async analyze(ast) {
        this.documentation.name = 'anonymous';
        this.documentation.line = ast.loc.start.line;
        this.documentation.column = ast.loc.start.column;

        if (ast.key) this.documentation.name = ast.key.name;


        // get parameters
        if (ast.value && ast.value.params) {
            ast.value.params.forEach((paramAst) => {
                
            });
        }


        return this.getDocumentation();
    }
}
