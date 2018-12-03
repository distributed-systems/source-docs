import BaseAnalyzer from './BaseAnalyzer.mjs'
import ParameterDocumentation from '../documentation/ParameterDocumentation.mjs';
import log from 'ee-log';




export default class ParameterAnalyzer extends BaseAnalyzer {


    constructor(options) {
        super(options);

        this.documentation = new ParameterDocumentation();
    }






    async analyze(ast, comment) {
        const docs = this.getDocumentation();

        if (comment) docs.comment = comment;

        if (ast.type === 'RestElement') {
            docs.name = ast.argument.name;
            docs.type = 'restParameter';
        } else if (ast.type === 'AssignmentPattern') {
            docs.hasDefaultValue = true;
            if (ast.left.type === 'ObjectPattern') {
                if (ast.left) {
                    this.parseObjectPattern(docs, ast);
                } else if (ast.properties) {
                    docs.name = '<Object>';
                    docs.type = 'parameter';
                    docs.properties = this.parseObjectExpression(ast.properties);
                }
                
            } else {
                docs.name = ast.left.name;
                docs.type = 'parameter';
                docs.defaultValue = this.parseValue(ast.right);
            }
        } else if (ast.type === 'ObjectPattern') {
            if (ast.left) {
                this.parseObjectPattern(docs, ast);
            } else if (ast.properties) {
                docs.name = '<Object>';
                docs.type = 'parameter';
                docs.properties = this.parseObjectExpression(ast.properties);
            }
        } else {
            docs.name = ast.name;
            docs.type = 'parameter';
        }


        return this.getDocumentation();
    }







    /**
     * parse objects patterns inside the ast, used to analyze object parameters
     * and their default values,
     *
     * @param      {<type>}  docs    The documents
     * @param      {<type>}  ast     The ast
     */
    parseObjectPattern(docs, ast) {
        docs.name = '<Object>';
        docs.type = 'parameter';

        docs.properties = ast.left.properties.map((propertyAst) => {
            const val = {
                name: propertyAst.key.name,
            };

            if (propertyAst.value && propertyAst.value.right ) {
                val.defaultValue = this.parseValue(propertyAst.value.right);
            }

            return val;
        });


        if (ast.right && ast.right.type === 'ObjectExpression') {
            docs.defaultValue = this.parseObjectExpression(ast.right.properties);
        }
    }
}
