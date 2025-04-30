import { argv } from 'node:process';
import process from 'node:process';
import os from 'node:os';
import FileSystem from './script/FileSystem.js';

let folder = os.homedir();
const fileSystem = new FileSystem(folder);

const myMap = new Map([
  ['up', fileSystem.levelUp],
  ['cd', fileSystem.changeDir],
  ['ls', fileSystem.listFolder],
  ['cat', fileSystem.readFile],
  ['add', fileSystem.createFile],
  ['mkdir', fileSystem.createDir],
  ['rn', (oldName, newName) => {return (`dir ${oldName + newName}`)}],
  ['cp', (file, dir) => {return ('list')}],
  ['mv', (file, dir) => {return ('list')}],
  ['rm', (file) => {return ('list')}],
  ['os', (name) => {return ('list')}],
  ['hash', (file) => {return ('list')}],
  ['compress', (file, dir) => {return ('list')}],
  ['decompress', (file, dir) => {return ('list')}],
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
  const operation = myMap.get(comand);
  if (operation) {
    await operation(...arg);

  } else {
    process.stdout.write(`Invalid input\n`);
  }
  process.stdout.write(`You are currently in ${fileSystem.curent}\n`);
});
