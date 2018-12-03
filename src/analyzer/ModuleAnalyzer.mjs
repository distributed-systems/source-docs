import ModuletDocumentation from '../documentation/ModuleDocumentation.mjs';
import FileAnalyzer from './FileAnalyzer.mjs';
import path from 'path';
import log from 'ee-log';




export default class ScriptAnalyzer extends FileAnalyzer {


    constructor({
        projectAnalyzer,
    }) {
        super();
        this.documentation = new ModuletDocumentation();
        this.projectAnalyzer = projectAnalyzer;
    }






    async analyze(file, source) {
        const ast = await this.parseSource(source, true);
        const dependencies = await this.getImportDeclarations(ast, file);


        // analyze all dependencies
        await this.projectAnalyzer.analyze(dependencies.map(dependency => dependency.path));

        // extract classes
        const classes = await this.analyzeClasses(ast);
        const exportsDeclarations = await this.getExportDeclarations(ast);

        const docs = this.getDocumentation();

        docs.file = file;
        docs.classes = classes;
        docs.dependencies = dependencies;
        dosc.exports = exportsDeclarations;

        return this.getDocumentation();
    }






    /**
     * extract all import statements, normalize them
     *
     * @param      {Object}        ast     The ast
     * @return     {Promise<Array>}  array of imports
     */
    async getImportDeclarations(ast, parentFile) {
        const dependencies = [];
        const importDeclarations = this.findAllNodes(ast, 'ImportDeclaration');

        for (const declaration of importDeclarations) {
            for (const specifier of declaration.specifiers) {
                dependencies.push({
                    name: specifier.local.name,
                    file: declaration.source.value,
                    path: path.join(path.dirname(parentFile), declaration.source.value),
                    isDefault: specifier.type === 'ImportDefaultSpecifier',
                });
            }
        }

        return dependencies;
    }






    /**
     * extract all export statements, normalize them
     *
     * @param      {Object}        ast     The ast
     */
    async getExportDeclarations(ast) {log(ast);
        const dependencies = [];
        const exportDeclarations = this.findAllNodes(ast, 'ExportDefaultDeclaration');

        log(exportDeclarations);

        for (const declaration of exportDeclarations) {
            for (const specifier of declaration.specifiers) {
                dependencies.push({
                    name: specifier.local.name,
                    file: declaration.source.value,
                    path: path.join(path.dirname(parentFile), declaration.source.value),
                    isDefault: specifier.type === 'ImportDefaultSpecifier',
                });
            }
        }

        return dependencies;
    }
}
