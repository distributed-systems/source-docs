import fs from 'fs';
import { parse } from '../lib/acorn/dist/acorn.mjs';
import doctrine from '../lib/doctrine';


const { promises: { readFile, stat } } = fs;




export default class BaseAnalyzer {



    /**
     * returns the documentation part
     *
     * @return     {Object}  The documentation.
     */
    getDocumentation() {
        return this.documentation;
    }


    


    /**
     * find al nodes of a certain type
     *
     * @param      {object}   ast              The ast
     * @param      {string}   nodeTypes        the type of node to find
     * @param      {boolean}  includeSubNodes  search inside matching nodes
     * @return     {Array}    array
     */
    findAllNodes(ast, nodeType, includeSubNodes = true) {
        const nodes = [];

        if (Array.isArray(ast)) {
            for (const node of ast) {                
                nodes.push(...this.findAllNodes(node, nodeType));
            }
        } else if (typeof ast === 'object' && ast !== null) {
            if (ast.type === nodeType) {
                nodes.push(ast);
            } 

            if (ast.type !== nodeType || includeSubNodes) {
                Object.keys(ast).forEach((key) => {
                    const subAst = ast[key];

                    if (Array.isArray(subAst) || typeof subAst === 'object' && subAst !== null && subAst.type) {
                        nodes.push(...this.findAllNodes(subAst, nodeType));
                    }
                });
            }
        }

        return nodes;
    }





    /**
     * get the first child node of a certain type
     *
     * @param      {Object}        ast     The ast
     * @param      {Array}         types   The types
     * @return     {(null|bject)}  null or the matching ast
     */
    findFirstNodeOfType(ast, ...types) {
        if (Array.isArray(ast)) {
            for (const node of ast) {
                const result = this.findFirstNodeOfType(node, ...types);
                if (result) return result;
            }
        } else if (typeof ast === 'object' && ast !== null) {
            if (types.includes(ast.type)) {
                return ast;
            } else {

                const keys = Object.keys(ast);
                for (const key of keys) {
                    const subAst = ast[key];

                    if (Array.isArray(subAst) || typeof subAst === 'object' && subAst !== null && subAst.type) {
                        const result = this.findFirstNodeOfType(subAst, ...types);
                        if (result) return result;
                    }
                }
            }
        }

        return null;
    }




    /**
     * finds the node that is just after the offset. used for placing comments
     * on the correct node
     *
     * @param      {Object}         ast           The ast
     * @param      {number}         offset        The offset
     * @return     {(null|Object)}  the node or null if no suitable node was found
     */
    findNodeByStartOffset(ast, offset) {
        if (Array.isArray(ast)) {
            for (const node of ast) {
                const result = this.findNodeByStartOffset(node, offset);
                if (result) return result;
            }
        } else if (typeof ast === 'object' && ast !== null) {
            if (ast.start > offset) {
                return ast;
            } else {

                const keys = Object.keys(ast);
                for (const key of keys) {
                    const subAst = ast[key];

                    if (Array.isArray(subAst) || typeof subAst === 'object' && subAst !== null && subAst.type) {
                        const result = this.findNodeByStartOffset(subAst, offset);
                        if (result) return result;
                    }
                }
            }
        }

        return null;
    }





    /**
     * Adds a parent accessor to ast.
     *
     * @param      {Object}  ast     The ast
     */
    addParentAccssorToAST(ast) {
        if (Array.isArray(ast)) {
            for (const node of ast) {
                node.getParent = () => ast;
                this.addParentAccssorToAST(node);
            }
        } else if (typeof ast === 'object' && ast !== null) {
            const keys = Object.keys(ast);
            for (const key of keys) {
                const subAst = ast[key];

                if (Array.isArray(subAst) || typeof subAst === 'object' && subAst !== null && subAst.type) {
                    subAst.getParent = () => ast;
                    this.addParentAccssorToAST(subAst);
                }
            }
        }
    }





    /**
     * parses source code & class comments
     *
     * @param      {string}   sourceCode  The source code
     * @param      {boolean}  isModule    Indicates if a module or a script
     *                                    shall be parsed
     * @return     {Object}   the AST
     */
    parseSource(sourceCode, isModule = false) {
        let comments = [];


        // parse file
        const ast = parse(sourceCode, {
            locations: true,
            onComment: comments,
            ecmaVersion: 10,
            sourceType: isModule ? 'module' : 'script',
        });


        // make sure children can get their parent
        this.addParentAccssorToAST(ast);

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
        this.applyCommentsToAST(ast, comments);

        return ast;
    }






    /**
     * since the comments are parsed separately they need to applied to the
     * parsed ast. this method does this based on the offsets in the code
     *
     * @param      {(object|array)}  ast       the ast
     * @param      {Array}           comments  comments
     */
    applyCommentsToAST(ast, comments) {
        while(comments.length) {
            const currentComment = comments.shift();
            let node = this.findNodeByStartOffset(ast, currentComment.end);

            // we're doing block comments, so lets attach them to 
            // blocks we assume the comments were made for
            const matchingNode = this.findFirstNodeOfType(node, 'ClassExpression', 'ClassDeclaration');
            if (matchingNode) node = matchingNode;

            if (node) {
                if (!node.comments) node.comments = [];
                node.comments.push(currentComment);
            }
        }
    }






    /**
     * remove files in the files array that match the items in the excludes
     * array. the excludes array may contain regular expressions or strings
     *
     * @private
     *
     * @param      {array}  files     files to filter
     * @param      {array}  excludes  array containing exclude filters which may
     *                                be regular expressions or strings
     */
    filterExcludes(files, excludes) {
        return files = files.filter((file) => {
            return !excludes.some((exclude) => {
                if (typeof exclude === 'string') {
                    return file.includes(exclude);
                } else {
                    exclude.lastIndex = 0;
                    return exclude.test(file);
                }
            });
        });
    }





    /**
     * returns the type of the file, which currently may be script (require) or
     * module (import/export)
     *
     * @private
     *
     * @param      {string}   file    file path
     * @param      {string}   source  source of the file
     * @return     {Promise<String>}  The source type.
     */
    async getSourceType(file, source) {
        // keeping ti simple for the moment. extended source analysis can be
        // implemented when it's needed
        return file.endsWith('.mjs') ? 'module' : 'script';
    }





    /** 
     * load source file from the files ystem
     *
     * @param      {string}   file    file path
     * @return     {Promise<String>}  the files source or null if the file could not be loaded
     */
    async loadSource(file) {
        const stats = await stat(file);

        if (stats.isFile()) {
            const source = await readFile(file).catch((err) => {
                err.message = `Failed to load source file ${file}: ${err.message}`;
                throw err;
            });

            return source.toString();
        } else {
            throw new Error(`Failed to load source file ${file}: file is not a regular file!`);
        }
    }







    parseObjectExpression(properties) {
        const obj = {};

        properties.forEach((property) => {
            const identifier = property.key && property.key.name;
            const value = this.parseValue(property.value);
            obj[identifier] = value;
        });

        return obj;
    }



    parseValue(ast) {
        let value;

        if (ast.type === 'Literal') {
            value = ast.value;
        } else if (ast.type === 'Identifier') {
            value = `<Variable ${ast.name}>`;
        } else if (ast.type === 'ObjectExpression') {
            value = this.parseObjectExpression(ast.properties);
        } else if (ast.type === 'MemberExpression') {
            if (ast.object.type === 'ThisExpression') {
                value = `<Property this.${ast.property.name}>`;
            }    
        } else if (ast.type === 'AssignmentPattern') {
            return this.parseValue(ast.right);
        }

        return value;
    }
}
