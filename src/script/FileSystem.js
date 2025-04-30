import { readdir, opendir, access, constants, writeFile, mkdir } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';

export default class FileSystem {
  constructor(home) {
    this.home = path.normalize(home);
    this.curent = path.normalize(home);
  }

  levelUp = () => {
    this.curent = path.resolve(this.curent, '..');
  }

  isDir = async (folder) => {
    try {
      const dir = await opendir(folder);
      if (dir) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }

  changeDir = async (name) => {
    const folder = path.resolve(this.curent, name);
    try {
      const dir = await this.isDir(folder);
      if (dir) {
        this.curent = folder;
      }
    } catch (err) {
      console.error(`Operation failed`);
    }
  }

  listFolder = async () => {
    try {
      const files = await readdir(path.resolve(this.curent), { withFileTypes: true });
      const list = files.sort((a, b) => b.isDirectory() - a.isDirectory()).map((el) => {
        return {
          Name: el.name,
          Type: el.isDirectory() ? 'directory' : 'file',
        }
      });
      console.table(list);
    } catch (err) {
      console.log(`FS operation failed`);
    }
  }

  readFile = async (name) => {
    try {
      await access(path.join(this.curent, name), constants.R_OK);
      const readStream = await createReadStream(path.join(this.curent, name), 'utf-8');
      readStream.on('data', (chunk) => {
        process.stdout.write(chunk);
      });
      readStream.on('end', () => {
        console.log('\n');
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  createFile = async (name) => {
    try {
      await writeFile(path.join(this.curent, name), '', { flag: 'wx' });
    } catch (e) {
      console.error(`FS operation failed`);
      console.log(e.message);
    }
  }

  createDir = async (name) => {
    try {
      const createDir = await mkdir(path.join(this.curent, name), { recursive: true });
      if (!createDir) {
        throw new Error('FS operation failed');
      }
    } catch (err) {
      console.error(err.message);
    }
  }
}

