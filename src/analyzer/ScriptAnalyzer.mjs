import ScriptDocumentation from '../documentation/ScriptDocumentation.mjs';
import FileAnalyzer from './FileAnalyzer.mjs';
import log from 'ee-log';
import path from 'path';

export default class ScriptAnalyzer extends FileAnalyzer {



    constructor({
        projectDocumentation,
    }) {
        super();

        this.projectDocumentation = projectDocumentation;
    }




    async analyze(file, source) {
        const ast = await this.parseSource(source, false);
        const imports = await this.getImportDeclarations(ast, file);
        const docs = this.getDocumentation();
        const classes = await this.analyzeClasses(ast);

        docs.file = file;
        docs.classes = classes;
        docs.imports = imports;
        //docs.exports = exportsDeclarations;

        return docs;
    }



    async getImportDeclarations(ast, parentFile) {
        const imports = [];
        const callExpressions = this.findAllNodes(ast, 'CallExpression').filter((expression) => {
            return expression.callee && expression.callee.name === 'require';
        });


        for (const expression of callExpressions) {
            if (expression.arguments && 
                expression.arguments.length &&
                expression.arguments[0].type === 'Literal') {
                const dependency = {
                    source: expression.arguments[0].value,
                    path: path.join(path.dirname(parentFile), expression.arguments[0].value),
                };

                if (expression.getParent().type === 'VariableDeclarator') {
                    const parentIdNode = expression.getParent().id;

                    if (parentIdNode.type === 'Identifier') {
                        dependency.isDefault = true;
                        dependency.name = parentIdNode.name;
                        imports.push(dependency);
                    } else if (parentIdNode.type === 'ObjectPattern') {

                        for (const property of parentIdNode.properties) {
                            if (property.key.type === 'Identifier') {
                                const clone = Object.assign({}, dependency);
                                clone.name = property.key.name;
                                imports.push(clone);
                            }
                        }
                    }
                } else {
                    dependency.isDefault = true;
                    imports.push(dependency);
                }
            }
        }


        return imports;
    }
}
