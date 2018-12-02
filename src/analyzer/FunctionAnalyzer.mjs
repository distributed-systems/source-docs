import ParameterAnalyzer from './ParameterAnalyzer.mjs';
import BaseAnalyzer from '../BaseAnalyzer.mjs'
import FunctionDocumentation from '../documentation/FunctionDocumentation.mjs';
import log from 'ee-log';




export default class FunctionAnalyzer extends BaseAnalyzer {



    constructor(options) {
        super(options);

        this.documentation = new FunctionDocumentation();
    }





    getDocumentation() {
        return this.documentation;
    }




    async analyze(ast) {
        this.documentation.name = 'anonymous';
        this.documentation.line = ast.loc.start.line;
        this.documentation.column = ast.loc.start.column;

        if (ast.key) this.documentation.name = ast.key.name;
        if (ast.static) this.documentation.isStatic = true;

        if (ast.type === 'MethodDefinition') {
            this.documentation.isMethod = true;

            const functionExpression = this.findFirstNodeOfType(ast, 'FunctionExpression');
            if (functionExpression && functionExpression.async) {
                this.documentation.isAsync = true;
            }
        }


        // extract block comment information about the parameters
        const comments = this.getParamtersDocumentation(ast);

        // get parameters
        if (ast.value && ast.value.params) {
            const parameters = ast.value.params;

            await Promise.all(parameters.map(async(paramAst, index) => {
                const analyzer = new ParameterAnalyzer();
                const documentation = await analyzer.analyze(paramAst);

                // if there are the same amount of comments & params
                // match the in the order of both array, else try to
                // identify them by name. this may make sense since
                // parameters can be anonymous
                let comment;
                if (comments.length === parameters.length) {
                    comment = comments[index];
                } else {
                    comment = comments.find(comment => comment.name === documentation.name);
                }

                if (comment) {
                    documentation.comment = comment;
                    documentation.hasComment = true;
                }

                this.getDocumentation().parameters.push(documentation);
            }));
        }


        // check if super is called
        const superAst = this.findFirstNodeOfType(ast, 'Super');
        if (superAst) {
            this.documentation.superIsCalled = true;
            
            const superParent = superAst.getParent();
            if (superParent) {
                if (superParent.property) {
                    this.documentation.superName = superParent.property.name;
                }
            }
        }


        // extract comment info
        if (ast.comments && ast.comments.length) {
            ast.comments.forEach((comment) => {
                this.documentation.hasComment = true;
                if (comment.data.description) this.documentation.description = comment.data.description;
                if (comment.data.tags && comment.data.tags.some(t => t.title === 'private')) this.documentation.isPrivate = true;
            });
        }


        return this.getDocumentation();
    }



    /**
     * the comments are part of one of the parents ast, get it there
     */
    getParamtersDocumentation(ast) {
        const getCommentsFromParent = (subAst, levelsLeft = 2) => {
            if (subAst && subAst.comments) return subAst.comments[0];
            else if (levelsLeft > 0 && subAst.getParent) {
                return getCommentsFromParent(subAst.getParent(), levelsLeft - 1);
            }
        };

        const comments = getCommentsFromParent(ast);

        if (comments && comments.data && comments.data.tags) {// debugger;
            const tags = comments.data.tags.filter(tag => tag.title === 'param');
            return this.parseCommentParameterTags(tags.slice(0));
        }

        return [];
    }





    /**
     * makes sense of parsed block comments for functions. builds a tree that 
     * may be matchable with the actual parameters of the function
     *
     * @param      {arrray}  tags        ast tag array
     * @param      {string}  parentName  name of the parent ast
     * @return     {Array}   array containing parameter descriptions
     */
    parseCommentParameterTags(tags, parentName = '') {
        const params = [];

        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];
            let type;

            // arrays are nested, the others not
            if (tag.type.type === 'TypeApplication') {
                type = tag.type.expression;
            } else {
                type = tag.type;
            }


            let currentParam = {
                name: tag.name,
                description: tag.description,
                type: type.name,
            };


            // add a nice name if there are multi level parameters
            if (parentName) {
                if (tag.name.startsWith(`${parentName}.`)) {
                    currentParam.localName = tag.name.slice(parentName.length + 1);
                }
            } else {
                tag.localName = tag.name;
            }

            params.push(currentParam);


            // array containing other types
            if (type.name === 'Array' && tag.type.applications && tag.type.applications.length) { 
                currentParam.contents = {
                    name: '<anonymous>',
                    description: `${tag.type.applications[0].name} items contained in the ${tag.name} array`,
                    type: tag.type.applications[0].name,
                };

                currentParam = currentParam.contents;
            }


            // arrays an object can contain other items and are always the start
            // for a child node
            const subTags = [];

            // get all following tags that start with the name of the current
            // tag. skip those tag in this iteration of the parent for loop
            for (let k = (i + 1); k < tags.length; k++) {
                const subTag = tags[k];

                if (subTag.name.startsWith(`${tag.name}.`)) {
                    subTags.push(subTag);
                } else {
                    // we're done here, return to the parent loop
                    break;
                }
            }


            // make the loop skip the sub tags
            if (subTags.length) {
                i += subTags.length;
            }

            // parse sub tags
            currentParam.properties = this.parseCommentParameterTags(subTags, tag.name);
        }

        return params;
    }

}
