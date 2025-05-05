import os from 'node:os';

export default class OperatingSystem {
  constructor(user, home) {
    this.username = user;
    this.home = home;
    this.map = new Map([
      ['EOL', () => { return JSON.stringify((os.EOL)) }],
      ['cpus', this.getCpus],
      ['homedir', () => this.home],
      ['username', () => this.username],
      ['architecture', () => {return os.arch()}],
    ]);
  }

  choose = (comand) => {
    if (comand.startsWith('--')) {
      const operation = this.map.get(comand.replace('--', ''));
      if (operation) {
        console.log(operation());
      } else {
        throw new Error(`Invalid input.`);
      }
    } else {
      throw new Error(`Invalid input.`);
    }
  }

  getCpus = () => {
    return os.cpus().map(({ model, speed }) => {return { model, speed: speed / 1000 + 'GHz' }})
  }

}