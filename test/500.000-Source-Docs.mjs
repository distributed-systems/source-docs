import section from '../es-modules/distributed-systems/section-tests/1.0.0+/index.mjs';
import path from 'path';
import SourceAnalyzer from '../';
import log from 'ee-log';

const __dirname = path.dirname(new URL(import.meta.url).pathname); 


section('Source Docs', (section) => {
    section.test('Instantiate Class', async () => {
        new SourceAnalyzer();
    });


    section.test('Analyze Sources', async () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        const analyzer = new SourceAnalyzer();
        
        const documentation = await analyzer.analyze(currentDir, 'data/*.mjs');

        log(documentation);
    });
});
