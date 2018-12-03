import section from '../es-modules/distributed-systems/section-tests/1.0.0+/index.mjs';
import FileAnalyzer from '../src/analyzer/FileAnalyzer.mjs';
import BaseAnalyzer from '../src/analyzer/BaseAnalyzer.mjs';
import assert from 'assert';
import path from 'path';
import log from 'ee-log';


section('Class Analyzer', (section) => {
    section.test('Parse classes: class declaration', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/ClassDeclaration.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const fileAnalyzer = new FileAnalyzer();

        const classes = await fileAnalyzer.analyzeClasses(ast);
        assert(classes);
        assert.equal(classes.length, 1);

        const cls = classes[0];

        assert(cls.line > 0);
        assert(cls.column >= 0);

        assert.equal(cls.name, 'Test');
        assert.equal(cls.hasComment , true);
        assert.equal(cls.description, 'test class');
        assert.equal(cls.isPrivate, true);
    });



    section.test('Parse classes: class expression', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/ClassExpression.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const fileAnalyzer = new FileAnalyzer();

        const classes = await fileAnalyzer.analyzeClasses(ast);
        assert(classes);
        assert.equal(classes.length, 1);

        const cls = classes[0];

        assert(cls.line > 0);
        assert(cls.column >= 0);

        assert.equal(cls.name, 'Test');
        assert.equal(cls.hasComment , true);
        assert.equal(cls.description, 'test class');
        assert.equal(cls.isPrivate, true);
    });
});