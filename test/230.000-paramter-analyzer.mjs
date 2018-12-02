import section from '../es-modules/distributed-systems/section-tests/1.0.0+/index.mjs';
import FileAnalyzer from '../src/analyzer/FileAnalyzer.mjs';
import BaseAnalyzer from '../src/BaseAnalyzer.mjs';
import assert from 'assert';
import path from 'path';
import log from 'ee-log';


section('Parameter Analyzer', (section) => {
    section.test('Parse Parameters', async () => {
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

        
        let params;

        params = cls.methods[1].parameters[0];

        log(cls.methods);
    });
});