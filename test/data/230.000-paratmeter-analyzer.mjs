
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
     * @param      {sting}   arg1.a  string option
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
     * @param      {Object}  arg1    options objec
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
     * @param      {Object}  arg1    options objeczt
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
     * @param      {number}    a                    number comment
     * @param      {string}    b                    string comment
     * @param      {boolean}   c                    boolean comment
     * @param      {date}      d                    date comment
     * @param      {object}    e                    object comment
     * @param      {Object[]}  g                    array containing objects
     * @param      {number}    g.id                 item id
     * @param      {Object}    options              options object
     * @param      {number}    options.x            x option
     * @param      {boolean}   options.y            y object option
     * @param      {array}     t                    t array
     * @param      {Object[]}  r                    array containing objects
     * @param      {Object[]}  r.employees          employee sub-array
     * @param      {number}    r.employees.id       employee id
     * @param      {Object}    r.company            company object
     * @param      {number}    r.company.id         company id
     * @param      {array}     rest                 array containing other things
     */
    comments(a, b, c, d, e, g = [], {
        x = 1,
        y = true
    } = {}, t = [], r, ...rest) {

    }
}
