import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';
const { createHash } = await import('node:crypto');
import { pipeline } from 'node:stream/promises';
import { createGzip, createUnzip } from 'node:zlib';

export default class FileSystem {
  constructor(home) {
    this.home = path.normalize(home);
    this.curent = path.normalize(home);
  }

  levelUp = () => {
    this.curent = path.resolve(this.curent, '..');
  }

  changeDir = async (name) => {
    const folder = path.resolve(this.curent, name);
    try {
      const dir = await fs.opendir(folder);
      if (dir) {
        this.curent = folder;
      }
    } catch (e) {
      throw new Error(`Operation failed. ${e.message ? 'Cause: ' + e.message : ''}`);
    }
  }


  listFolder = async () => {
    try {
      const files = await fs.readdir(path.resolve(this.curent), { withFileTypes: true });
      const list = files.sort((a, b) => b.isDirectory() - a.isDirectory()).map((el) => {
        return {
          Name: el.name,
          Type: el.isDirectory() ? 'directory' : 'file',
        }
      });
      console.table(list);
    } catch (e) {
      throw new Error(`Operation failed. ${e.message ? 'Cause: ' + e.message : ''}`);
    }
  }

  readFile = async (name) => {
    try {
      await fs.access(path.join(this.curent, name), fs.constants.R_OK);
      const readStream = createReadStream(path.join(this.curent, name), 'utf-8');
      readStream.on('data', (chunk) => {
        process.stdout.write(chunk);
      });
      readStream.on('end', () => {
        console.log('\n');
      });
    } catch (e) {
      throw new Error(`FS operation failed. ${e.message ? 'Cause: ' + e.message : ''}`);
    }
  }

  createFile = async (name) => {
    try {
      await fs.writeFile(path.join(this.curent, name), '', { flag: 'wx' });
    } catch (e) {
      throw new Error(`Operation failed. ${e.message ? 'Cause: ' + e.message : ''}`);
    }
  }

  createDir = async (name) => {
    try {
      const createDir = await fs.mkdir(path.join(this.curent, name), { recursive: true });
      if (!createDir) {
        throw new Error('FS operation failed.');
      }
    } catch (e) {
      throw new Error(`FS operation failed. ${e.message ? 'Cause: ' + e.message : ''}`);
    }
  }

  renameFile = async (oldName, newName) => {
    try {
      const isNewExist = await fs.access(path.join(this.curent, newName), fs.constants.F_OK);
      console.log(`FS operation failed.`);
      //todo if
    } catch (err) {
      try {
        await fs.rename(path.join(this.curent, oldName), path.join(this.curent, newName));
      } catch (error) {
        throw new Error(`FS operation failed. ${error.message ? 'Cause: ' + error.message : ''}`);
      }
    }
  }
  
  copy = async (file, directory) => {
    try {
      const dir = await fs.opendir(path.join(this.curent, directory));
      if (dir) {
        await fs.copyFile(path.join(this.curent, file), path.resolve(this.curent, directory, file), fs.constants.COPYFILE_EXCL);
      }
    } catch (e) {
      throw new Error(`FS operation failed. ${e.message ? 'Cause: ' + e.message : ''}`);
    }
  }

  removeFile = async (file) => {
    try {
      await fs.rm(path.join(this.curent, file));
    } catch (e) {
      throw new Error(`FS operation failed. ${e.message ? 'Cause: ' + e.message : ''}`);
    }
  }

  moveFile = async (file, directory) => {
    try {
      await this.copy(file, directory);
      await this.removeFile(file);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  hashFile = async (file) => {
    try {
      await fs.access(path.join(this.curent, file), fs.constants.R_OK);
      const hash = createHash('sha256');
      const input = await createReadStream(path.join(this.curent, file));
      await input.pipe(hash).setEncoding('hex').pipe(process.stdout);
      input.on('end', () => {
        process.stdout.end('\n');
      });
      return;
    } catch (e) {
      throw new Error(`FS operation failed. ${e.message ? 'Cause: ' + e.message : ''}`);
    }
  }

  compressFile = async (file, dir = '.') => {
    try {
      await fs.access(path.join(this.curent, file));
      const directory = await fs.opendir(path.join(this.curent, dir));
      if (directory) {
        await pipeline(
          createReadStream(path.join(this.curent, file)),
          createGzip(),
          createWriteStream(path.join(this.curent, dir, `${file}.gz`), { flags: 'wx'}),
        );
      }
    } catch (e) {
      throw new Error(`FS operation failed. ${e.message ? 'Cause: ' + e.message : ''}`);
    }
  };

  decompressFile = async (file, dir = '.') => {
    try {
      await fs.access(path.join(this.curent, file));
      const directory = await fs.opendir(path.join(this.curent, dir));
      if (directory) {
        await pipeline(
          createReadStream(path.join(this.curent, file)),
          createUnzip(),
          createWriteStream(path.join(this.curent, dir, file.replace('.gz', '')), { flags: 'wx'}),
        );
      }
    } catch (e) {
      throw new Error(`FS operation failed. ${e.message ? 'Cause: ' + e.message : ''}`);
    }
  };
}

