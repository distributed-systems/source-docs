/**
* @private
*
* provides functionality supporting easy soruce 
* and documentation parsing.
*/
export default class Analyzer {





    /**
    * finds a specific node in the ast, returrns it
    *
    * @public
    *
    * @param {*} ast the ast to search in
    * @param {string} nodeName the name of the node to find
    *
    * @returns {object|array} partialAst the matched part of the ast 
    * and its children
    */
    findNode(ast, nodeName) {
        if (Array.isArray(ast)) {
            let nodes = [];

            for (const node of ast) { //console.log(node.type);
                if (node.type === nodeName) nodes.push(node);
                else nodes.push(this.findNode(node, nodeName));
            }

            nodes = nodes.filter(n => !!n);

            // return non empty nodes
            return nodes.length ? (nodes.length === 1 && Array.isArray(nodes[0]) ? nodes[0] : nodes) : null;
        } else if (typeof ast === 'object' && ast !== null && Number.isInteger(ast.start)) { //console.log(ast.type);
            if (ast.type === nodeName) return ast;
            else {
                let nodes = [];

                // search on children
                Object.keys(ast).forEach((key) => {
                    const item = ast[key];

                    if (typeof item === 'object') nodes.push(this.findNode(item, nodeName));
                });

                nodes = nodes.filter(n => !!n);


                return nodes.length ? (nodes.length === 1 && Array.isArray(nodes[0]) ? nodes[0] : nodes) : null;
            }
        }
    }
};