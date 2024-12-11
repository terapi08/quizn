import axios from 'axios';
import * as cheerio from 'cheerio';

const MAIN_URL = 'https://quizn.show/quz';
const PIN_URL = `${MAIN_URL}/pin/gamePinCheck.do`;
const JOIN_URL = `${MAIN_URL}/realtime/v2/joinPlayRoom.do`;

export class Client {
    pin: string;
    playSeq: string | undefined;
    len: number;

    constructor(options: { pin: string, len: number }) {
        this.pin = options.pin;
        this.len = options.len;
    }

    async getSeq() {
        const data = new URLSearchParams({ pinNo: this.pin }).toString();
        const headers = { 'Cookie': 'JSESSIONID=F948D84E839E1C14ABDC4CEC4984B322.tomcat1' };

        let response = await axios.post(PIN_URL, data, { headers: headers });
        const $ = cheerio.load(response.data);
        const playSeq: string | undefined = $('input[name="playSeq"]').val() as string | undefined;

        if (!playSeq) {
            return { stats: 'Fail' };
        } else {
            this.playSeq = playSeq;
            return { stats: 'Success', playSeq };
        }
    }

    async joinUser(nickName: string) {
        try {
            for (let i = 0; i < this.len; i++) {
                let nickNames = `${nickName}_${Number(i + 1)}`
                const data = new URLSearchParams({
                    playSeq: this.playSeq || '',
                    userId: '',
                    teamSeq: '',
                    nickName: nickNames,
                }).toString();

                await axios.post(JOIN_URL, data).then(() => {
                    const now = new Date();
                    const hours = now.getHours();
                    const minutes = now.getMinutes();
                    const seconds = now.getSeconds();
    
                    const formattedHours = hours < 10 ? '0' + hours : hours;
                    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    
                    console.log(`[${formattedHours}:${formattedMinutes}:${formattedSeconds}] Success ( ${nickNames} )`);
                });
            }

        } catch (err) {
            return { stats: 'Fail' };
        }
    }
}
