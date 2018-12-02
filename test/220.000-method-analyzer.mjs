import section from '../es-modules/distributed-systems/section-tests/1.0.0+/index.mjs';
import FileAnalyzer from '../src/analyzer/FileAnalyzer.mjs';
import BaseAnalyzer from '../src/BaseAnalyzer.mjs';
import assert from 'assert';
import path from 'path';
import log from 'ee-log';


section('Method Analyzer', (section) => {
    section.test('Parse Method: method declaration', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/220.000-method-analyzer.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const fileAnalyzer = new FileAnalyzer();

        const classes = await fileAnalyzer.analyzeClasses(ast);
        assert(classes);
        assert.equal(classes.length, 1);

        const cls = classes[0];

        assert(cls.line > 0);
        assert(cls.column >= 0);

        assert.equal(cls.name, 'Class220');
        assert.equal(cls.hasComment , false);
        assert.equal(cls.methods.length, 3);

        const m0 = cls.methods[0];
        assert.equal(m0.isPrivate, false);
        assert.equal(m0.hasComment, true);
        assert.equal(m0.isStatic, false);
        assert.equal(m0.isAsync, false);
        assert.equal(m0.superIsCalled, true);
        assert.equal(m0.isMethod, true);
        assert.equal(m0.name, 'testMethod');
        assert.equal(m0.superName, 'testMethod');
        assert.equal(m0.description, 'normal method');


        const m1 = cls.methods[1];
        assert.equal(m1.isPrivate, true);
        assert.equal(m1.hasComment, true);
        assert.equal(m1.isStatic, false);
        assert.equal(m1.isAsync, true);
        assert.equal(m1.superIsCalled, true);
        assert.equal(m1.isMethod, true);
        assert.equal(m1.name, 'asyncMethod');
        assert.equal(m1.superName, 'asyncMethod');
        assert.equal(m1.description, 'async method description');


        const m2 = cls.methods[2];
        assert.equal(m2.isPrivate, false);
        assert.equal(m2.hasComment, false);
        assert.equal(m2.isStatic, true);
        assert.equal(m2.isAsync, false);
        assert.equal(m2.superIsCalled, false);
        assert.equal(m2.isMethod, true);
        assert.equal(m2.name, 'staticMethod');
    });
});