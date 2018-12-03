


export default class ClassDocumentation {
    

    constructor() {
        this.methods = [];

        this.isPrivate = false;
        this.hasComment = false;
    }


    sortMethods() {
        this.methods.sort((a, b) => {
            if (a.line > b.line) return 1;
            else if (a.line < b.line) return -1;
            else if (a.column > b.column) return 1;
            else if (a.column < b.column) return -1;
            else return 0;
        });
    }
}
