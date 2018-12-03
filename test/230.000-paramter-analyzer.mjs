import section from '../es-modules/distributed-systems/section-tests/1.0.0+/index.mjs';
import FileAnalyzer from '../src/analyzer/FileAnalyzer.mjs';
import BaseAnalyzer from '../src/analyzer/BaseAnalyzer.mjs';
import assert from 'assert';
import path from 'path';
import log from 'ee-log';


section('Parameter Analyzer', (section) => {
    section.test('Normal parameter', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/230.000-paratmeter-analyzer.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const fileAnalyzer = new FileAnalyzer();

        const classes = await fileAnalyzer.analyzeClasses(ast);
        assert(classes);
        assert.equal(classes.length, 1);

        const cls = classes[0];

        assert(cls.line > 0);
        assert(cls.column >= 0);

        assert.equal(cls.name, 'ParameterAnalyzerTest');
        assert.equal(cls.hasComment , false);

        
        let param, comment;
        const params = cls.methods[1].parameters;
        assert.equal(params.length, 1);

        param = params[0];
        assert.equal(param.hasComment, true);
        assert.equal(param.name, 'param');
        assert.equal(param.type, 'parameter');

        comment = param.comment;
        assert.equal(comment.name, 'param');
        assert.equal(comment.description, 'string parameter');
        assert.equal(comment.type, 'string');
    });


    section.test('Parameter with default value', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/230.000-paratmeter-analyzer.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const fileAnalyzer = new FileAnalyzer();

        const classes = await fileAnalyzer.analyzeClasses(ast);
        assert(classes);
        assert.equal(classes.length, 1);

        const cls = classes[0];

        assert(cls.line > 0);
        assert(cls.column >= 0);

        assert.equal(cls.name, 'ParameterAnalyzerTest');
        assert.equal(cls.hasComment , false);

        
        let param, comment;
        const params = cls.methods[2].parameters;
        assert.equal(params.length, 1);

        param = params[0];
        assert.equal(param.hasComment, true);
        assert.equal(param.name, 'param');
        assert.equal(param.type, 'parameter');
        assert.equal(param.hasDefaultValue, true);
        assert.equal(param.defaultValue, 1);

        comment = param.comment;
        assert.equal(comment.name, 'param');
        assert.equal(comment.description, 'number parameter');
        assert.equal(comment.type, 'number');
    });


    section.test('Parameter with default value which is an empty object', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/230.000-paratmeter-analyzer.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const fileAnalyzer = new FileAnalyzer();

        const classes = await fileAnalyzer.analyzeClasses(ast);
        assert(classes);
        assert.equal(classes.length, 1);

        const cls = classes[0];

        assert(cls.line > 0);
        assert(cls.column >= 0);

        assert.equal(cls.name, 'ParameterAnalyzerTest');
        assert.equal(cls.hasComment , false);

        
        let param, comment;
        const params = cls.methods[3].parameters;
        assert.equal(params.length, 1);

        param = params[0];
        assert.equal(param.hasComment, true);
        assert.equal(param.name, '<Object>');
        assert.equal(param.type, 'parameter');
        assert.equal(param.hasDefaultValue, true);
        assert.deepStrictEqual(param.defaultValue, {});

        comment = param.comment;
        assert.equal(comment.name, 'arg1');
        assert.equal(comment.description, 'ob param');
        assert.equal(comment.type, 'Object');
    });





    section.test('Rest parameter', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/230.000-paratmeter-analyzer.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const fileAnalyzer = new FileAnalyzer();

        const classes = await fileAnalyzer.analyzeClasses(ast);
        assert(classes);
        assert.equal(classes.length, 1);

        const cls = classes[0];

        assert(cls.line > 0);
        assert(cls.column >= 0);

        assert.equal(cls.name, 'ParameterAnalyzerTest');
        assert.equal(cls.hasComment , false);

        
        let param, comment;
        const params = cls.methods[4].parameters;
        assert.equal(params.length, 1);

        param = params[0];
        assert.equal(param.hasComment, true);
        assert.equal(param.name, 'restParameter');
        assert.equal(param.type, 'restParameter');

        comment = param.comment;
        assert.equal(comment.name, 'restParameter');
        assert.equal(comment.description, 'The rest parameter');
        assert.equal(comment.type, 'Array');
    });





    section.test('Options object with default value empty object as default value', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/230.000-paratmeter-analyzer.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const fileAnalyzer = new FileAnalyzer();

        const classes = await fileAnalyzer.analyzeClasses(ast);
        assert(classes);
        assert.equal(classes.length, 1);

        const cls = classes[0];

        assert(cls.line > 0);
        assert(cls.column >= 0);

        assert.equal(cls.name, 'ParameterAnalyzerTest');
        assert.equal(cls.hasComment , false);

        
        let param, comment;
        const params = cls.methods[5].parameters;
        assert.equal(params.length, 1);

        param = params[0];
        assert.equal(param.hasComment, true);
        assert.equal(param.name, '<Object>');
        assert.equal(param.type, 'parameter');
        assert.equal(param.hasDefaultValue, true);
        assert.deepStrictEqual(param.properties, [{
            name: 'a',
        }, {
            name: 'b', 
            defaultValue: 1
        }]);

        comment = param.comment;
        assert.equal(comment.name, 'arg1');
        assert.equal(comment.description, 'options object');
        assert.equal(comment.type, 'Object');
        assert.deepStrictEqual(comment.properties, [{
            name: 'arg1.a',
            description: 'string option',
            type: 'string',
            localName: 'a',
        }, {
            name: 'arg1.b',
            description: 'number option',
            type: 'number',
            localName: 'b',
        }]);
    });





    section.test('Options object with a default value and non empty default value', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/230.000-paratmeter-analyzer.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const fileAnalyzer = new FileAnalyzer();

        const classes = await fileAnalyzer.analyzeClasses(ast);
        assert(classes);
        assert.equal(classes.length, 1);

        const cls = classes[0];

        assert(cls.line > 0);
        assert(cls.column >= 0);

        assert.equal(cls.name, 'ParameterAnalyzerTest');
        assert.equal(cls.hasComment , false);

        
        let param, comment;
        const params = cls.methods[6].parameters;
        assert.equal(params.length, 1);

        param = params[0];
        assert.equal(param.hasComment, true);
        assert.equal(param.name, '<Object>');
        assert.equal(param.type, 'parameter');
        assert.equal(param.hasDefaultValue, true);
        assert.deepStrictEqual(param.properties, [{
            name: 'a',
        }, {
            name: 'b', 
            defaultValue: 1
        }]);

        comment = param.comment;
        assert.equal(comment.name, 'arg1');
        assert.equal(comment.description, 'options object');
        assert.equal(comment.type, 'Object');
        assert.deepStrictEqual(comment.properties, [{
            name: 'arg1.a',
            description: 'random param',
            type: '*',
            localName: 'a',
        }, {
            name: 'arg1.b',
            description: 'number param',
            type: 'number',
            localName: 'b',
        }]);
    });





    section.test('Options object with a default value that is a reference and non empty default value with references', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/230.000-paratmeter-analyzer.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const fileAnalyzer = new FileAnalyzer();

        const classes = await fileAnalyzer.analyzeClasses(ast);
        assert(classes);
        assert.equal(classes.length, 1);

        const cls = classes[0];

        assert(cls.line > 0);
        assert(cls.column >= 0);

        assert.equal(cls.name, 'ParameterAnalyzerTest');
        assert.equal(cls.hasComment , false);

        
        let param, comment;
        const params = cls.methods[7].parameters;
        assert.equal(params.length, 1);

        param = params[0];
        assert.equal(param.hasComment, true);
        assert.equal(param.name, '<Object>');
        assert.equal(param.type, 'parameter');
        assert.equal(param.hasDefaultValue, true);
        assert.deepStrictEqual(param.properties, [{
            name: 'x', 
            defaultValue: '<Property this.x>' 
        }]);
        assert.deepStrictEqual(param.defaultValue, {
            y: '<Property this.y>', 
            z: '<Variable varName>' ,
        });

        comment = param.comment;
        assert.equal(comment.name, 'arg1');
        assert.equal(comment.description, 'options object');
        assert.equal(comment.type, 'Object');
        assert.deepStrictEqual(comment.properties, [{
            name: 'arg1.x',
            description: 'whatever',
            type: '*',
            localName: 'x',
        }]);
    });





    section.test('Extensive paramter comments', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/230.000-paratmeter-analyzer.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const fileAnalyzer = new FileAnalyzer();

        const classes = await fileAnalyzer.analyzeClasses(ast);
        assert(classes);
        assert.equal(classes.length, 1);

        const cls = classes[0];

        assert(cls.line > 0);
        assert(cls.column >= 0);

        assert.equal(cls.name, 'ParameterAnalyzerTest');
        assert.equal(cls.hasComment , false);

        
        let param, comment;
        const params = cls.methods[8].parameters;
        assert.equal(params.length, 1);

        param = params[0];
        assert.equal(param.hasComment, true);
        assert.equal(param.name, 'r');
        assert.equal(param.type, 'parameter');

        comment = param.comment;
        assert.equal(comment.name, 'r');
        assert.equal(comment.description, 'array containing objects');
        assert.equal(comment.type, 'Array');
        assert.deepStrictEqual(comment.contents, {
            name: '<anonymous>',
            description: 'Object items contained in the r array',
            type: 'Object',
            properties: [{
                name: 'r.employees',
                description: 'employee sub-array',
                type: 'Array',
                localName: 'employees',
                contents: {
                    name: '<anonymous>',
                    description: 'Object items contained in the r.employees array',
                    type: 'Object',
                    properties: [{
                        name: 'r.employees.id',
                        description: 'employee id',
                        type: 'number',
                        localName: 'id',
                    }],
                }
            }, {
                name: 'r.company',
                description: 'company object',
                type: 'Object',
                localName: 'company',
                properties: [{
                    name: 'r.company.id',
                    description: 'company id',
                    type: 'number',
                    localName: 'id',
                }]
            }],
        });
    });



    section.test('Object with default values', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/Module.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const fileAnalyzer = new FileAnalyzer();

        const classes = await fileAnalyzer.analyzeClasses(ast);
        assert(classes);
        assert.equal(classes.length, 1);

        const cls = classes[0];
        assert.equal(cls.name, 'ModuleClass');

        const params = cls.methods[1].parameters;
    });
});