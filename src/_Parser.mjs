import { parse } from './lib/acorn/dist/acorn.mjs';
import doctrine from './lib/doctrine';



/**
* parses a file into an ast
*/
export default class Parser {





    /**
    * parses the passed string and returns an ast
    *
    * @param {string} sourceCode the sourceode to parse
    *
    * @returns {object} AST the praser AST
    */
    parse(sourceCode, isModule) {
        let comments = [];


        // parse file
        const ast = parse(sourceCode, {
            locations: true,
            onComment: comments,
            ecmaVersion: 10,
            sourceType: isModule ? 'module' : 'script',
        });


        // parse all block comments
        comments.filter(comment => comment.type === 'Block').forEach((comment) => {

            // let doctrine do the work
            comment.data = doctrine.parse(comment.value, {
                unwrap: true,
            });
        });



        // sort by start
        comments.sort((a, b) => a.start - b.start);


        // walk the tree an set the comments on the ast
        this.walkAST(ast, comments);


        return ast;
    }






    /**
     * walks the ast to place comment blocks on it
     *
     * @private
     *
     * @param      {*}      ast       part of the ast that currenlty is being
     *                                processed
     * @param      {array}  comments  array containing the comments to apply to
     *                                the ast
     */
    walkAST(ast, comments) {
        if (comments.length) {
            if (Array.isArray(ast)) {


                // scan each branch
                ast.forEach((branch) => {
                    this.walkAST(branch, comments);
                });
            } else if (typeof ast === 'object' && ast !== null) {


                // only process nodes that have a start, all
                // other nodes are not relevant
                if (Number.isInteger(ast.start)) {


                    // check if the topmost comment has a start 
                    // smaller that the current nodes start
                    while (comments.length && ast.start > comments[0].end) {


                        // respect assignement expressions
                        if (ast.expression && ast.expression.right) {

                            // place the comment on the rigth hand side
                            if (!ast.expression.right.comments) ast.expression.right.comments = [];
                            ast.expression.right.comments.push(comments.shift());
                        } else {

                            // nice, place comment
                            if (!ast.comments) ast.comments = [];
                            ast.comments.push(comments.shift());
                        }
                    }


                    // iterate over all properties, process children
                    Object.keys(ast).forEach((key) => {
                        const item = ast[key];

                        // process objects only
                        if (typeof item === 'object') this.walkAST(item, comments);
                    });
                }
            }
        }
    }
}