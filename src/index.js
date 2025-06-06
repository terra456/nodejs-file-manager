import { argv } from 'node:process';
import process from 'node:process';
import os from 'node:os';
import FileSystem from './script/FileSystem.js';

let folder = os.homedir();
const fileSystem = new FileSystem(folder);

const userInput = new Map([
  ['up', fileSystem.levelUp],
  ['cd', fileSystem.changeDir],
  ['ls', fileSystem.listFolder],
  ['cat', fileSystem.readFile],
  ['add', fileSystem.createFile],
  ['mkdir', fileSystem.createDir],
  ['rn', fileSystem.renameFile],
  ['cp', fileSystem.copy],
  ['mv', fileSystem.moveFile],
  ['rm', fileSystem.removeFile],
  ['os', (name) => {return ('list')}],
  ['hash', fileSystem.hashFile],
  ['compress', fileSystem.compressFile],
  ['decompress', fileSystem.decompressFile],
]);

let username;
argv.forEach((el, i) => {
  if (el.startsWith('--') && el.includes('=')) {
    username = el.split('=')[1];
    process.stdout.write(`Welcome to the File Manager, ${username}! \n`);
    process.stdout.write(`You are currently in ${folder}\n`);
  }
});


process.stdin.on('data', async (data) => {
  const [comand, ...arg] = data.toString().trim().split(' ');
  const operation = userInput.get(comand);
  if (!operation) {
    process.stdout.write(`Invalid input\n`);
  }
  try {
    await operation(...arg);
  } catch (e) {
    process.stdout.write(`${e.message}\n`);
  } finally {
    process.stdout.write(`You are currently in ${fileSystem.curent}\n`);
  }
});
