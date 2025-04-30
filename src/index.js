import { argv } from 'node:process';
import process from 'node:process';

const parseArgs = () => {
    argv.forEach((el, i) => {
        if (el.startsWith('--')) {
            console.log(argv[i + 1])
        }
    });
};

parseArgs();

const write = async () => {
    process.stdin.on('data', (data) => {
        process.stdout.write(data);
    });
};

await write();