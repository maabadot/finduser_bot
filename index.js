const Telegraf = require('telegraf');
const config = require('./config.json');
const request = require('request');

function checkVK(nickname, socNet) {
    request.get(`http://vk.com/${nickname}`).on('response', function(response) {
        if (response && response.statusCode === 200) {
            socNet.VK = `http://vk.com/${nickname}`; // 200
        }
        console.log('VK checked... ' + nickname)
    });
}

function checkIG(nickname, socNet) {
    request.get(`http://instagram.com/${nickname}`).on('response', function(response) {
        if (response && response.statusCode === 200) {
            socNet.IG = `http://instagram.com/${nickname}`; // 200
        }
        console.log('IG checked... ' + nickname)
    });
}

function checkTW(nickname, socNet) {
    request.get(`http://twitter.com/${nickname}`).on('response', function(response) {
        if (response && response.statusCode === 200) {
            socNet.TW = `http://twitter.com/${nickname}`; // 200
        }
        console.log('TW checked... ' + nickname)
    });
}

function checkAll(nickname, socNet) {
    checkVK(nickname, socNet);
    checkIG(nickname, socNet);
    checkTW(nickname, socNet);
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
    checkAll(ctx.message.text, socialNetworks);
    ctx.reply(`${socialNetworks.VK}\n${socialNetworks.IG}\n${socialNetworks.TW}`);
    // setTimeout(() => {
    //     ctx.reply(`${socialNetworks.VK}\n${socialNetworks.IG}\n${socialNetworks.TW}`);
    // },3000);
});


bot.launch(function () {
    console.log('Bot is working...');
});
