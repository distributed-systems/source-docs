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
}
