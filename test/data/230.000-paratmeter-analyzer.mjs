
const varName = 33;

export default class ParameterAnalyzerTest {


    constructor() {
        this.x = 9;
        this.y = {a: 4};
    }

    /**
     * xxx
     *
     * @param      {string}  param   string parameter
     */
    normalParameter(param) {

    }


    /**
     * xxx
     *
     * @param      {number} param   number parameter
     */
    defaultParameter(param = 1) {

    }


    /**
     * xxx
     *
     * @param      {Object}  arg1    ob param
     */
    defaultObjectParameter({} = {}) {

    }


    /**
     * xx
     *
     * @param      {Array}  restParameter  The rest parameter
     */
    restParameter(...restParameter) {

    }



    /**
     * xxx
     *
     * @param      {Object}  arg1    options object
     * @param      {string}   arg1.a  string option
     * @param      {number}  arg1.b  number option
     */
    fancyObjectParameter({
        a,
        b = 1
    } = {}) {

    }



    /**
     * xxx
     *
     * @param      {Object}  arg1    options object
     * @param      {*}       arg1.a  random param
     * @param      {number}  arg1.b  number param
     */
    fancierObjectParameter({
        a,
        b = 1
    } = {
        c: 1,
        d: {a: 1}
    }) {

    }



    /**
     * strange stuff
     *
     * @param      {Object}  arg1    options object
     * @param      {*}       arg1.x  whatever
     */
    strangeObjectParameter({
        x = this.x
    } = {
        y: this.y,
        z: varName,
    }) {

    }



    /**
     * comments
     *
     * @param      {Object[]}  r                    array containing objects
     * @param      {Object[]}  r.employees          employee sub-array
     * @param      {number}    r.employees.id       employee id
     * @param      {Object}    r.company            company object
     * @param      {number}    r.company.id         company id
     */
    comments(r) {

    }
}
