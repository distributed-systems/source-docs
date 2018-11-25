import ScriptDocumentation from '../documentation/ScriptDocumentation.mjs';
import FileAnalyzer from './FileAnalyzer.mjs';


export default class ScriptAnalyzer extends FileAnalyzer {



    constructor({
        projectDocumentation,
    }) {
        super();

        this.projectDocumentation = projectDocumentation;
    }




    async analyze(file, source) {
        const ast = await this.parseSource(source, false);
    }
}
