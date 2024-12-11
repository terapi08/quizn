import { Client } from './src/Client'; 

async function main() {
    const client = new Client({ pin: '0386191', len: 250 });

    const res = await client.getSeq();
    if (res.stats === 'Success') {
        await client.joinUser('terapi');
    }
}

main();
