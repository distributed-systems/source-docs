import SuperClass220 from './220.000-method-analyzer-super.mjs';


export default class Class220 extends SuperClass220 {



    /**
     * normal method
     */
    testMethod() {
        super.testMethod();
    }





    /**
     * async method description
     * 
     * @private
     *
     * @return     {Promise}  something
     */
    async asyncMethod() {
        await super.asyncMethod();
    }



    static staticMethod() {

    }
}