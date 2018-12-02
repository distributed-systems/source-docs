


export default class FunctionDocumentation {
    

    constructor() {
        this.parameters = [];

        this.isPrivate = false;
        this.hasComment = false;
        this.isStatic = false;
        this.isAsync = false;
        this.superIsCalled = false;
        this.isMethod = false;
    }
}