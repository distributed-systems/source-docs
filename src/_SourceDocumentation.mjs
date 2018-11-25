import type from '../es-modules/distributed-systems/types/1.0.0+/types.mjs';
import path from 'path';
import InvalidArgumentException from './errors/InvalidArgumentException.mjs';
import SourceDiscovery from './SourceDiscovery.mjs';
import ClassAnalyzer from './ClassAnalyzer.mjs';
import Parser from './Parser.mjs'; 



/**
* creates documentation for all classes of a project
*/
export default class SourceDocumentation {


    /**
    * class constructor
    *
    * @param {string} projectRoot the to be analyzed projects 
    *                             root path
    *
    * @throws {InvalidArgumentException} thrown when not all 
    *                                    required parameters 
    *                                    are set
    *
    * @returns  {object} class instance
    */
    constructor({
        projectRoot,
    } = {}) {
        if (!projectRoot) throw new InvalidArgumentException('missing parameter projectRoot containing the path to the main file of the application!');
        if (!type.string(projectRoot)) throw new InvalidArgumentException(`the option projectRoot must be a string, got '${type(projectRoot)}'!`);

        this.projectRoot = projectRoot.endsWith('/') ? projectRoot.slice(0, projectRoot.lenngth - 1) : projectRoot;

        // all files that need to be analyzed for the project.
        // files may be manually added or are added using
        // the project discovery
        this.files = new Map();
    }





    /**
    * Add custom files that need to be analyzed. If the paths start
    * with the project root path passed to the constructor the project
    * root path will be removed from the files path
    *
    * @param {...string} files paths for files that need to be parsed
    *
    * @throws {InvalidArgumentException} thrown when not all required 
    *                                    parameters are set
    */
    async addFiles(...files) {
        for (let fileName of files) {
            if (!fileName.startsWith('/')) fileName = path.join(this.projectRoot, fileName);

            const discovery = new SourceDiscovery();
            const resolvedFiles = await discovery.discover(fileName, false);

            for (let [file, source] of resolvedFiles.entries()) {
                if (file.startsWith(this.projectRoot)) file = file.slice(this.projectRoot.length + 1);
                this.files.set(file, source);
            }
        }
    }






    /**
    * discover all files for the project
    *
    * @param {string} fileName the path to the main file
    *                      from whoch all other files
    *                      are discovered
    *
    * @throws {InvalidArgumentException} thrown when not all 
    *                                    required parameters 
    *                                    are set
    */
    async discoverSourceFiles(fileName) {
        if (!fileName) throw new InvalidArgumentException('missing parameter fileName!');
        if (!type.string(fileName)) throw new InvalidArgumentException(`the parameter fileName must be a string, got '${type(fileName)}'!`);
        
        const discovery = new SourceDiscovery();
        const files = await discovery.discover(path.join(this.projectRoot, fileName));
        
        for (let [file, source] of files.entries()) {
            if (file.startsWith(this.projectRoot)) file = file.slice(this.projectRoot.length + 1);
            this.files.set(file, source);
        }
    }








    /**
    * analyze the source files of the project
    *
    * @returns {object} object containing the projects generated
    *                   documentation
    */
    async analyze() {
        const parser = new Parser();
        const classAnalyzer = new ClassAnalyzer();
        const parsedClasses = [];


        for (const [fileName, source] of this.files.entries()) {
            const ast = parser.parse(source, fileName.endsWith('.mjs'));
            const classes = classAnalyzer.analyze(ast, this.projectRoot, fileName);

            parsedClasses.push({
                fileName,
                source,
                ast,
                classes,
            });
        }
        

        return parsedClasses;
    }
}
