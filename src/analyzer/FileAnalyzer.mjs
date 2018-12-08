import BaseAnalyzer from './BaseAnalyzer.mjs';
import ClassAnalyzer from './ClassAnalyzer.mjs';
import log from 'ee-log';
import path from 'path';




export default class FileAnalyzer extends BaseAnalyzer {


    /**
     * find all classes within the ast, analyze them
     *
     * @param      {Object}          ast     ast
     * @return     {Promise<Array>}  array containing class documentations
     */
    async analyzeClasses(ast) {
        const asts = [];
        const classes = [];

        // find declarations and expressions
        asts.push(...this.findAllNodes(ast, 'ClassDeclaration'));
        asts.push(...this.findAllNodes(ast, 'ClassExpression'));

        await Promise.all(asts.map(async (classDeclaration) => {
            const classAnalyzer = new ClassAnalyzer();
            await classAnalyzer.analyze(classDeclaration);
            classes.push(classAnalyzer.getDocumentation());
        }));
        
        return classes;
    }




    /**
     * finds definitions for exports by name. used for exports the reference a
     * variable for its export
     *
     * @param      {object}  ast           The ast
     * @param      {string}  name          the name to look for
     * @param      {int}     invalidStart  start offset that shall be ignored
     *                                     for this analysis
     * @return     {Object}  the definition for the export
     */
    findExportTypeByName(ast, name, invalidStart = -1) {
        const identifiers = this.findAllNodes(ast, 'Identifier')
            .filter(node => node.name === name)
            .filter(node => node.start !== invalidStart)
            .reverse();


        for (const identifier of identifiers) {
            if (identifier.getParent) {
                const parent = identifier.getParent();

                if (parent.type === 'VariableDeclarator') {
                    if (parent.init) {
                        if (parent.init.type === 'ClassExpression') {
                            return this.getClassDefinition(parent.init, name);
                        } else if (parent.init.type === 'FunctionDeclaration') {
                            return {
                                type: 'function',
                                name,
                            };
                        } else if (parent.init.type === 'ArrowFunctionExpression') {
                            return {
                                type: 'function',
                                name,
                            };
                        } else if (parent.init.type === 'CallExpression' && 
                            parent.init.callee && 
                            parent.init.callee.name === 'require') {
                            
                            if (parent.init.arguments && parent.init.arguments.length && parent.init.arguments[0].type === 'Literal') {
                                return {
                                    source: parent.init.arguments[0].value,
                                    name,
                                };
                            }
                        } else {
                            return {
                                type: 'variable',
                                name,
                            };
                        }
                    } else {
                        return {
                            type: 'variable',
                            name,
                        };
                    }
                } else if (parent.type === 'ClassDeclaration') {
                    return this.getClassDefinition(parent, name);
                } else if (parent.type === 'FunctionDeclaration') {
                    return {
                        type: 'function',
                        name,
                    };
                } else if (parent.type === 'ImportDefaultSpecifier' || parent.type === 'ImportSpecifier') {
                    return {
                        source: parent.getParent().getParent().source.value,
                        name,
                        isDefault: parent.type === 'ImportDefaultSpecifier',
                    };
                }
            }
        }
    }




    /**
     * extract class information for exports
     *
     * @param      {object}  classAst  The class ast
     * @param      {string}  name      the default name to use for the class
     * @return     {object}  The class definition.
     */
    getClassDefinition(classAst, name) {
        const definition = {
            type: 'class',
            name,
        };

        if (classAst.id) {
            definition.name = classAst.id.name;
        }

        return definition;
    }
}
