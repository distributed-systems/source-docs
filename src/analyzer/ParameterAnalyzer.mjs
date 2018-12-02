import BaseAnalyzer from '../BaseAnalyzer.mjs'
import ParameterDocumentation from '../documentation/ParameterDocumentation.mjs';
import log from 'ee-log';




export default class ParameterAnalyzer extends BaseAnalyzer {


    constructor(options) {
        super(options);

        this.documentation = new ParameterDocumentation();
    }





    getDocumentation() {
        return this.documentation;
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
                this.parseObjectPattern(docs, ast);
            } else {
                docs.name = ast.left.name;
                docs.type = 'parameter';
                docs.defaultValue = this.parseValue(ast.right);
            }
        } else if (ast.type === 'ObjectPattern') {
            this.parseObjectPattern(docs, ast);
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






    parseObjectExpression(properties) {
        const obj = {};

        properties.forEach((property) => {
            const identifier = property.key && property.key.name;
            const value = this.parseValue(property.value);
            obj[identifier] = value;
        });

        return obj;
    }



    parseValue(ast) {
        let value;

        if (ast.type === 'Literal') {
            value = ast.value;
        } else if (ast.type === 'Identifier') {
            value = `<Variable ${ast.name}>`;
        } else if (ast.type === 'ObjectExpression') {
            value = this.parseObjectExpression(ast.properties);
        } else if (ast.type === 'MemberExpression') {
            if (ast.object.type === 'ThisExpression') {
                value = `<Property this.${ast.property.name}>`;
            }    
        }

        return value;
    }

}
