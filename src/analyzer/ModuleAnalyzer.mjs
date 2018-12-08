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
        const imports = await this.getImportDeclarations(ast, file);


        // analyze all dependencies
        await this.projectAnalyzer.analyze(imports.map(dependency => dependency.path));

        // extract classes
        const classes = await this.analyzeClasses(ast);
        const exportsDeclarations = await this.getExportDeclarations(ast, file);

        const docs = this.getDocumentation();

        docs.file = file;
        docs.classes = classes;
        docs.imports = imports;
        docs.exports = exportsDeclarations;

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
                    source: declaration.source.value,
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
     * @param      {Object}   ast         The ast
     * @param      {string}   parentFile  The parent file
     * @return     {Promise}  The export declarations.
     */
    async getExportDeclarations(ast, parentFile) {
        const exportedNames = [];
        const exportDefinitions = [];

        const exportDeclarations = this.findAllNodes(ast, 'ExportNamedDeclaration');

        for (const declaration of exportDeclarations) {
            if (declaration.specifiers) {
                for (const specifier of declaration.specifiers) {
                    if (specifier.local) {
                        if (specifier.local.type === 'Identifier') {
                            if (declaration.source && declaration.source.type === 'Literal') {
                                exportDefinitions.push({
                                    name: specifier.local.name,
                                    source: declaration.source && declaration.source.type === 'Literal' ? declaration.source.value : null,
                                    isDefault: true,
                                });
                            } else {
                                exportedNames.push(specifier.local.name);
                            }
                        }
                    }
                }
            }

            if (declaration.declaration) {
                let item;

                if (declaration.declaration.type === 'FunctionDeclaration') {
                    item = {
                        name: declaration.declaration.id.name,
                        type: 'function',
                    };
                } else if (declaration.declaration.type === 'ClassDeclaration') {
                    item = {
                        name: declaration.declaration.id.name,
                        type: 'class',
                    };
                } else if (declaration.declaration.type === 'VariableDeclaration') {
                    item = {
                        name: declaration.declaration.declarations && declaration.declaration.declarations.length && declaration.declaration.declarations[0].id ? declaration.declaration.declarations[0].id.name : null,
                        type: 'variable',
                    };
                }


                if (item) {
                    if (declaration.source && declaration.source.type === 'Literal') {
                        item.source = declaration.source.value;
                    }

                    exportDefinitions.push(item);
                }
            }
        }


        for (const name of exportedNames) {
            const result = this.findExportTypeByName(ast, name); 

            if (result) {
                exportDefinitions.push(result);
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
