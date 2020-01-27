const Telegraf = require('telegraf');
const config = require('./config.json');
const request = require('request');

const bot = new Telegraf(config.token);

function checkVK(nickname) {
    let status, res;
    request(`https://vk.com/${nickname}`, function (error, response, body) {
        status = response && response.statusCode;
        console.log(status);
        if (status == 200) { res = `vk.com/${nickname}`;}
        else {res = 'Not found.';}
    });
    console.log(res);
    return res;
}


bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Help phrase'));
bot.on('message', function(ctx) {
    let res = checkVK(ctx.message.text);
    ctx.reply( res );
});


bot.launch();
console.log('Bot is working...');