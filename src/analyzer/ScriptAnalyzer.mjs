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



    /**
     * get the exports, theirs names, if they're default
     *
     * @param      {<type>}   ast         The ast
     * @param      {<type>}   parentFile  The parent file
     * @return     {Promise}  The export declarations.
     */
    async getExportDeclarations(ast, parentFile) {
        const exportDefinitions = [];

        const memberExpressions = this.findAllNodes(ast, 'MemberExpression').filter((expression) => {
            return expression.object && 
                expression.object.name === 'module' &&
                expression.property &&
                expression.property.name === 'exports';
        });



        for (const expression of memberExpressions) {
            const right = expression.getParent().right || expression.getParent().getParent().right;
            let name;

            // named non default exports
            if (expression.getParent().property) {
                name = expression.getParent().property.name;
            }


            if (right.type === 'Literal' || right.type === 'ObjectExpression') {
                const definition = {
                    isDefault: !name,
                    type: 'variable',
                };

                if (name) definition.name = name;
                exportDefinitions.push(definition);
            } else if (right.type === 'Identifier') {
                const result = this.findExportTypeByName(ast, name || right.name, right.start);

                if (result) {
                    result.isDefault = !name;
                    exportDefinitions.push(result);
                }
            } else if (right.type === 'ClassExpression') {
                const definition = {
                    isDefault: !name,
                    type: 'class',
                };

                if (name) {
                    definition.name = name;
                } else if (right.id) {
                    definition.name = right.id.name;
                }

                exportDefinitions.push(definition);
            } else if (right.type === 'ObjectExpression') {
                const definition = {
                    isDefault: !name,
                    type: 'variable',
                };

                if (name) {
                    definition.name = name;
                } else if (right.id) {
                    definition.name = right.id.name;
                }

                exportDefinitions.push(definition);
            } else if (right.type === 'CallExpression' && right.callee && right.callee.name === 'require') {
                const definition = {
                    isDefault: !name,
                };

                if (name) {
                    definition.name = name;
                }

                if (right.arguments && right.arguments.length && right.arguments[0].type === 'Literal') {
                    definition.source = right.arguments[0].value;
                }

                exportDefinitions.push(definition);
            }
        }



        for (const exportDefinition of exportDefinitions) {
            if (exportDefinition.source) {
                exportDefinition.path = path.join(path.dirname(parentFile), exportDefinition.source);
            }
        }


        return exportDefinitions;
    }
}
