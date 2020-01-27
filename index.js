const Telegraf = require('telegraf');
const config = require('./config.json');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const bot = new Telegraf(config.token);


function checkVK(nickname) {
    let xhr = new XMLHttpRequest();
    let url = `https://vk.com/${nickname}`;
    xhr.open('GET', url, false);
    xhr.send();
    if (xhr.status != 404) {
        return `VK: vk.com/${nickname}`;
    } else {
        return false;
    }
}

function checkINST(nickname) {
    let xhr = new XMLHttpRequest();
    let url = `https://www.instagram.com/${nickname}`;
    xhr.open('GET', url, false);
    xhr.send();
    console.log(xhr.status);
    if (xhr.status != 404) {
        return `INST: instagram.com/${nickname}`;
    } else {
        return false;
    }
}

function checkALL(nickname) {
    let answer = '';
    let VK = checkVK(nickname);
    let INST = checkINST(nickname);
    if (VK) {
        answer = VK + '\n';
    }
    if (INST) {
        answer = answer + INST;
    }
    if (!VK && !INST) {
        answer= 'Not found.';
    }
    return answer;
}

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Help phrase'));
bot.on('message', function(ctx) {
    ctx.reply(checkALL(ctx.message.text));
});


bot.launch();
console.log('Bot started...');