

export default class ReturnerClass {


    testMethod() {
        return 1;
    }



    indirectReturn() {
        const a = 1;
        
        return a;
    }


    indirectNoninitializedReturn() {
        let a;
            
        a = 'str';

        return a;
    }


    paramReturn(a) {
        return a;
    }



    async asyncMethod() {
        return 1;
    }



    objectExpression() {
        return {a:1};
    }



    objectAssignment() {
        const x = {a:1};

        return x;
    }

    arrayExpression() {
        return [1, 2, 3];
    }
}