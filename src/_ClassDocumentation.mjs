/**
* holds th einfromation for a class extracted from the
* sourcecode
*
* @private
*/
export default class ClassDefinition {





    /**
    * class constructor
    */
    constructor() {

        // methods storage
        this.methods = [];
    }






    /**
    * return a json of the class
    *
    * returns {promise} jsonDocument when resolved
    */
    toSJON() {
        return Promise.resolve({
              name: this.name
            , descrption: this.descrption
            , file: this.getRelativePath()
            , line: this.line
            , column: this.column
            , private: this.private
            , methods: this.methods
        });
    }






    /**
    * sets the path this file should treated 
    * relatively to
    *
    * @param {string} rootPath path
    */
    setRootPath(rootPath) {
        this.rootPath = rootPath;
    }






    /**
    * set the file path for the class
    *
    * @param {sting} path the path of the file containing the file
    */
    setFile(path) {
        this.filePath = path;
    }





    /**
    * retuns the relative path of the file in relation
    * to a path passed to this function
    *
    * @param {string} rootPath the path that should be removed from the files path
    *
    * @returns {string} filePath the relative path to the file
    */
    getRelativePath(rootPath) {
        if (this.filePath) return this.filePath.substr(rootPath ? rootPath.length+1 : (this.rootPath ? this.rootPath.length+1 : 0));
        else return '';
    }
};