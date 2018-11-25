import section from '../es-modules/distributed-systems/section-tests/1.0.0+/index.mjs';
import BaseAnalyzer from '../src/BaseAnalyzer.mjs';
import assert from 'assert';
import path from 'path';
import log from 'ee-log';


section('BaseAnalyzer', (section) => {
    section.test('Instantiate Class', async () => {
        new BaseAnalyzer();
    });


    section.test('filter exludes (string)', async () => {
        const analyzer = new BaseAnalyzer();
        const files = analyzer.filterExcludes([
            '/ds/.a.b.c./d', 
            '/sdf/sdf/abc.d/',
        ], [
            'abc.d'
        ]);

        assert(files);
        assert.equal(files.length, 1);
        assert.equal(files[0], '/ds/.a.b.c./d');
    });



    section.test('filter exludes (regexp)', async () => {
        const analyzer = new BaseAnalyzer();
        const files = analyzer.filterExcludes([
            '/ds/.a.b.c./d', 
            '/sdf/sdf/abc.d/',
        ], [
            /df\/s/gi
        ]);

        assert(files);
        assert.equal(files.length, 1);
        assert.equal(files[0], '/ds/.a.b.c./d');
    });



    section.test('get source type: module', async () => {
        const analyzer = new BaseAnalyzer();
        const sourceType = await analyzer.getSourceType('x.mjs', `import x from 'y'; export default class test {};`);

        assert(sourceType);
        assert.equal(sourceType, 'module');
    });



    section.test('get source type: script', async () => {
        const analyzer = new BaseAnalyzer();
        const sourceType = await analyzer.getSourceType('x.js', `const x = require('x'); module.exports = class {};`);

        assert(sourceType);
        assert.equal(sourceType, 'script');
    });



    section.test('load source', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/Module.mjs'));

        assert(source);
    });



    section.test('parse source', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/Module.mjs'));
        const ast = await analyzer.parseSource(source, true);
        
        assert(ast);
    });



    section.test('find all nodes', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/Module.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const nodes = analyzer.findAllNodes(ast, 'ImportSpecifier');
        
        assert(nodes);
        assert.equal(nodes.length, 1);
    });
});