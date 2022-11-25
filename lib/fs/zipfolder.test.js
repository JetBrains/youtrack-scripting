const zipFolder = require('./zipfolder');
const unzip = require('./unzip');
const {promisify} = require('util');
const os = require('os');
const fs = require('fs');
const path = require('path');

describe('zipfolder', function() {
  it('should zip/unzip package', async function() {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zipfolder-test'));
    const fooDir = path.resolve(outDir, 'foo');
    const unzipDir = path.resolve(outDir, 'bar');
    const zipFilePath = path.resolve(outDir, 'foo.zip');
    const pkg = path.resolve(fooDir, 'package.json');
    fs.mkdirSync(fooDir, {recursive: true});
    fs.writeFileSync(pkg, '{}');

    await promisify(zipFolder)(fooDir, zipFilePath);
    await promisify(unzip)(zipFilePath, unzipDir);
    const files = fs.readdirSync(unzipDir);
    expect(files).toEqual(['package.json']);
  });

  it('should contain manifest.json in package', async function() {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zipfolder-test'));
    const fooDir = path.resolve(outDir, 'foo');
    const unzipDir = path.resolve(outDir, 'bar');
    const zipFilePath = path.resolve(outDir, 'foo.zip');
    const manifest = path.resolve(fooDir, 'manifest.json');
    const pkg = path.resolve(fooDir, 'package.json');
    fs.mkdirSync(fooDir, {recursive: true});
    fs.writeFileSync(pkg, '{}');
    fs.writeFileSync(manifest, '{}');

    await promisify(zipFolder)(fooDir, zipFilePath);
    await promisify(unzip)(zipFilePath, unzipDir);
    const files = fs.readdirSync(unzipDir);
    expect(files).toEqual(['manifest.json', 'package.json']);
  });
});
