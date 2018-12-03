import BaseAnalyzer from './BaseAnalyzer.mjs';
import ProjectDocumentation from '../documentation/ProjectDocumentation.mjs';
import ScriptAnalyzer from './ScriptAnalyzer.mjs';
import ModuleAnalyzer from './ModuleAnalyzer.mjs';


/**
 * Main analyzer class. Goes through all files passed to it, analyzes the
 * sources files, returns the documentation for the source files
 *
 * @private
 */

export default class ProjectAnalyzer extends BaseAnalyzer {



    constructor({
        exclude,
    } = {}) {
        super();

        // keep the paths of all files to be analyzed. required to make sure no
        // files is analyzed twice
        this.files = new Set();

        this.exclude = exclude;
        this.documentation = new ProjectDocumentation();
    }





    /**
     * analyze the source files in the directory specified by the glob patterns
     * passed as arguments
     *
     * @param      {Array}                          patterns  glob patterns used
     *                                                        to find source
     *                                                        files to analyze
     * @return     {Promise<ProjectDocumentation>}  in instance of the
     *                                              ProjectDocumentation class
     *                                              containing all information
     *                                              extracted from the source
     *                                              files
     */
    async analyze(files) {

        // don't analyze files twice
        files = files.filter((file) => {
            if (this.files.has(file)) return false;
            else {
                this.files.add(file);
                return true;
            }
        });


        // analyze all files
        await Promise.all(files.map(async (file) => {
            const source = await this.loadSource(file);
            const sourceType = await this.getSourceType(file, source);
            const options = {
                projectAnalyzer: this, 
            };

            let analyzer;

            if (sourceType === 'module') {
                analyzer = new ModuleAnalyzer(options);
            } else if (sourceType === 'script') {
                analyzer = new ScriptAnalyzer(options);
            } else {
                throw new Error(`Cannot analyze source file ${file}: unkwnown source type ${sourceType}!`);
            }

            const docs = await analyzer.analyze(file, source);
            this.documentation.addFile(docs);
        }));


        return this.getDocumentation();
    }
}
