import section from '../es-modules/distributed-systems/section-tests/1.0.0+/index.mjs';
import ModuleAnalyzer from '../src/analyzer/ModuleAnalyzer.mjs';
import BaseAnalyzer from '../src/analyzer/BaseAnalyzer.mjs';
import assert from 'assert';
import path from 'path';
import log from 'ee-log';


section('Parameter Analyzer', (section) => {
    section.test('Normal parameter', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/240.000-export-declarations.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const moduleAnalyzer = new ModuleAnalyzer({});

        const exports = await moduleAnalyzer.getExportDeclarations(ast);
        
        
    });
});