const Telegraf = require('telegraf');
const config = require('./config.json');
const request = require('request');

function checkVK(nickname, socNet) {
    return new Promise((resolve) => {
        request.get(`http://vk.com/${nickname}`).on('response', function(response) {
            if (response && response.statusCode === 200) {
                socNet.VK = `http://vk.com/${nickname}`; // 200
            }
            console.log('VK checked... ' + nickname);
            resolve();
        });
    });

}

function checkIG(nickname, socNet) {
    return new Promise((resolve) => {
        request.get(`http://instagram.com/${nickname}`).on('response', function(response) {
            if (response && response.statusCode === 200) {
                socNet.IG = `http://instagram.com/${nickname}`; // 200
            }
            console.log('IG checked... ' + nickname);
            resolve();
        });
    });

}

function checkTW(nickname, socNet) {
    return new Promise((resolve) => {
        request.get(`http://twitter.com/${nickname}`).on('response', function(response) {
            if (response && response.statusCode === 200) {
                socNet.TW = `http://twitter.com/${nickname}`; // 200
            }
            console.log('TW checked... ' + nickname);
            resolve();
        });
    });

}

function answer(ctx, socNet) {
    ctx.reply(`${socNet.VK}\n${socNet.IG}\n${socNet.TW}`);
}

async function checkAll(nickname, socNet, ctx) {
    Promise.all([
        checkVK(nickname, socNet),
        checkIG(nickname, socNet),
        checkTW(nickname, socNet)])
        .then(() => {
            answer(ctx, socNet);
        });
}

const bot = new Telegraf(config.token);
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Help phrase'));
bot.on('message', function(ctx) {
    let socialNetworks = {
        VK: 'Not found',
        IG: 'Not found',
        TW: 'Not found'
    };
    checkAll(ctx.message.text, socialNetworks, ctx);
});


bot.launch(function () {
    console.log('Bot is working...');
});
