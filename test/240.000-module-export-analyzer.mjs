import section from '../es-modules/distributed-systems/section-tests/1.0.0+/index.mjs';
import ModuleAnalyzer from '../src/analyzer/ModuleAnalyzer.mjs';
import BaseAnalyzer from '../src/analyzer/BaseAnalyzer.mjs';
import assert from 'assert';
import path from 'path';
import log from 'ee-log';


section('Module', (section) => {
    section.test('Exports', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/240.000-export-declarations.mjs'));
        const ast = await analyzer.parseSource(source, true);
        const moduleAnalyzer = new ModuleAnalyzer({});

        const exports = await moduleAnalyzer.getExportDeclarations(ast, path.join(currentDir, 'data/240.000-export-declarations.mjs'));
        let ex;
        
        assert.equal(exports.length, 12);

        ex = exports[0];
        assert.equal(ex.name, 'directExportFunction');
        assert.equal(ex.type, 'function');

        ex = exports[1];
        assert.equal(ex.name, 'directClassExport');
        assert.equal(ex.type, 'class');

        ex = exports[2];
        assert.equal(ex.name, 'changeableValue');
        assert.equal(ex.type, 'variable');

        ex = exports[3];
        assert.equal(ex.name, 'constValue');
        assert.equal(ex.type, 'variable');

        ex = exports[4];
        assert.equal(ex.name, 'DirectDefaultImport');
        assert.equal(ex.source, './240.000-export-dummy.mjs');  
        assert.equal(ex.isDefault, true);

        ex = exports[5];
        assert.equal(ex.name, 'AClass');
        assert.equal(ex.type, 'class');

        ex = exports[6];
        assert.equal(ex.name, 'functionN');
        assert.equal(ex.type, 'function');

        ex = exports[7];
        assert.equal(ex.name, 'constX');
        assert.equal(ex.type, 'variable');

        ex = exports[8];
        assert.equal(ex.name, 'DefaultImport');
        assert.equal(ex.source, './240.000-export-dummy.mjs');
        assert.equal(ex.isDefault, true);

        ex = exports[9];
        assert.equal(ex.name, 'OtherCls');
        assert.equal(ex.source, './240.000-export-dummy.mjs');
        assert.equal(ex.isDefault, false);

        ex = exports[10];
        assert.equal(ex.name, 'obj');
        assert.equal(ex.type, 'variable');

        ex = exports[11];
        assert.equal(ex.name, 'LaterAssignedValue');
        assert.equal(ex.type, 'variable');
    });
});