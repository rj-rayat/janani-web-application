import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function createProjectZip() {
  const zip = new JSZip();
  const rootDir = process.cwd();
  const outputFile = path.join(rootDir, 'public', 'janani-lims-complete.zip');

  const ignoreDirs = new Set(['node_modules', 'dist', '.git', '.cache', '.temp']);
  const ignoreFiles = new Set(['janani-lims-complete.zip', '.DS_Store', 'Thumbs.db']);

  function addDirectoryToZip(currentDir, zipFolder) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const relativePath = path.relative(rootDir, fullPath);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!ignoreDirs.has(item)) {
          const nextZipFolder = zipFolder.folder(item);
          addDirectoryToZip(fullPath, nextZipFolder);
        }
      } else if (stat.isFile()) {
        if (!ignoreFiles.has(item) && !item.endsWith('.zip')) {
          const content = fs.readFileSync(fullPath);
          zipFolder.file(item, content);
        }
      }
    }
  }

  console.log('Archiving project files into zip...');
  addDirectoryToZip(rootDir, zip);

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  fs.writeFileSync(outputFile, zipBuffer);
  console.log(`ZIP successfully generated at ${outputFile} (${(zipBuffer.length / 1024).toFixed(2)} KB)`);
}

createProjectZip().catch((err) => {
  console.error('Error creating ZIP:', err);
  process.exit(1);
});
