import section from '../es-modules/distributed-systems/section-tests/1.0.0+/index.mjs';
import ScriptAnalyzer from '../src/analyzer/ScriptAnalyzer.mjs';
import BaseAnalyzer from '../src/analyzer/BaseAnalyzer.mjs';
import assert from 'assert';
import path from 'path';
import log from 'ee-log';


section('Script', (section) => {
    section.test('Imports', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new BaseAnalyzer();
        const source = await analyzer.loadSource(path.join(currentDir, 'data/250.000-script-import-export.js'));
        const ast = await analyzer.parseSource(source, true);
        const scriptAnalyzer = new ScriptAnalyzer({});

        const imports = await scriptAnalyzer.getImportDeclarations(ast, path.join(currentDir, 'data/250.000-script-import-export.js'));
        let im;
        

        assert.equal(imports.length, 4);

        im = imports[0];
        assert.equal(im.source, './250.000-script-import-export-dependency.js');
        assert.equal(im.isDefault, true);

        im = imports[1];
        assert.equal(im.name, 'x');
        assert.equal(im.source, './250.000-script-import-export-dependency.js');
        assert.equal(im.isDefault, true);

        im = imports[2];
        assert.equal(im.name, 'a');
        assert.equal(im.source, './250.000-script-import-export-dependency.js');

        im = imports[3];
        assert.equal(im.name, 'b');
        assert.equal(im.source, './250.000-script-import-export-dependency.js');
    });
});