import FunctionAnalyzer from './FunctionAnalyzer.mjs';
import BaseAnalyzer from '../BaseAnalyzer.mjs'
import ClassDocumentation from '../documentation/ClassDocumentation.mjs';
import log from 'ee-log';



export default class ClassAnalyzer extends BaseAnalyzer {



    constructor(options) {
        super(options);

        this.documentation = new ClassDocumentation();
    }





    getDocumentation() {
        return this.documentation;
    }





    async analyze(ast) {
        this.documentation.line = ast.loc.start.line;
        this.documentation.column = ast.loc.start.column;

        // the name of the class is availbe on the current node for
        // declarations, but on the parent for expressions
        if (ast.id) this.documentation.name = ast.id.name;
        else if (ast.getParent().id) this.documentation.name = ast.getParent().id.name;

        
        if (ast.superClass && ast.superClass.name) this.documentation.superClass = ast.superClass.name;


        if (ast.comments && ast.comments.length) {
            ast.comments.forEach((comment) => {
                this.documentation.hasComment = true;
                if (comment.data.description) this.documentation.description = comment.data.description;
                if (comment.data.tags && comment.data.tags.some(t => t.title === 'private')) this.documentation.isPrivate = true;
            });
        }

        const methodAsts = this.findAllNodes(ast, 'MethodDefinition');

        await Promise.all(methodAsts.map(async (methodAst) => {
            const analyzer = new FunctionAnalyzer();
            const methodDocumentation = await analyzer.analyze(methodAst);
            this.getDocumentation().methods.push(methodDocumentation); 
        }));
    }
}
