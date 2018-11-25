# javascript source docs

extracts documentation from ecma script files for complete projects

- reads jsdoc comments
- reads method signatures
- analyzes dependecies


```
const docs = new TestableDocs({
    projectRoot: path.join(__dirname, '../')
});

docs.addFiles(path.join(__dirname, '../', require('../package.json').main));
docs.analyze();
docs.runSection(section);
```