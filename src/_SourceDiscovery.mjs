import type from '../es-modules/distributed-systems/types/1.0.0+/types.mjs';
import fs from 'fs';
import { join, extname, dirname } from 'path';
import InvalidArgumentException from './errors/InvalidArgumentException.mjs';

const { promises: { readFile, stat } } = fs;




/**
* discover source trees starting at some file 
* and following the dependencies
*/
export default class SourceDiscovery {



    /**
    * class constructor
    *
    * @returns  {object} class instance
    */
    constructor() {
        this.files = new Map();
    }




    /**
    * discover a source tree based on one source files
    *
    * @param {string} file the source file to start the scan from
    * @param {bool} discoverDependencies discover also the dependencies
    *                                    of the current file
    *
    * @throws {InvalidArgumentException} thrown when not all 
    *                                    required parameters 
    *                                    are set
    *
    * @returns {set} a set containg all files found
    */
    async discover(file, discoverDependencies = true) {
        if (!file) throw new InvalidArgumentException(`missing parameter 'file' containing the path to the file to be parsed!`);
        if (!type.string(file)) throw new InvalidArgumentException(`the parameter 'file' must be a string, got '${type(file)}'!`);

        // make sure we're not going in circles!
        if (!this.files.has(file)) {
            let source = await readFile(file);
            source = source.toString();

            // add the file here, it exists so  it can be added
            this.files.set(file, source);

            // check for dependencies
            if (discoverDependencies) await this.parseDependencies(source, file);
        }

        return this.files;
    }







    /**
    * finds all local dependencies
    *
    * @private
    *
    * @param {string} source the source to find dependencies in
    * @param {string} fileName the path to the file
    *
    * @returns {set} a set of dependencies, resolved against the
    *                projects root
    */
    async parseDependencies(source, fileName)  {

        // we need the directory of the file we're currently parsing
        const fileDir = dirname(fileName);

        const moduleRegexp = /require\s*\(?<script>\s*['`"]([^'`"]+)['`"]\s*\)|import (?<module>.+) from ['"](?<fileName>[^'"]+)['"]/gi;
        let match;

        while(match = moduleRegexp.exec(source)) {
            let dependencyPath;
            let stats;

            if (match.groups.script) dependencyPath = join(fileDir, match[1]);
            else {
                const matchedFile =  match.groups.fileName;
                dependencyPath = matchedFile.startsWith('/') ? matchedFile : join(fileDir, matchedFile);
            }

            try {
                stats = await stat(dependencyPath);
            } catch (err) {
                try {
                    dependencyPath = dependencyPath + (match.groups.script ? '.js' : '.mjs');
                    stats = await stat(dependencyPath);
                } catch (err) {}
            }


            if (stats && stats.isFile()) {
                await this.discover(dependencyPath);
            }
        }
    }
}