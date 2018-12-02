import BaseAnalyzer from './BaseAnalyzer.mjs';
import glob from '../es-modules/distributed-systems/glob/1.0.0+/src/glob.mjs'
import ProjectAnalyzer from './analyzer/ProjectAnalyzer.mjs';




export default class SourceAnalyzer extends BaseAnalyzer {


    /**
     * set up the analyzer     *
     *
     * @param      {Object}  options                   options object
     * @param      {array}   options.exclude           array containing exclusion
     *                                                 patterns
     */
    constructor({
        exclude = ['es-modules/', 'node_modules/'],
    } = {}) {
        super();

        this.exclude = exclude;
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
    async analyze(baseDirectory, ...patterns) {
        let files = await glob(baseDirectory, ...patterns);

        // filter out files that need to be excluded
        files = this.filterExcludes(files, this.exclude);

        // pass the excludes to 
        const analyzer = new ProjectAnalyzer({
            exclude: this.exclude,
        });

        //return analyzer.analyze(files);
    }
}