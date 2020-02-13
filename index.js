const Telegraf = require('telegraf');
const config = require('./config.json');
const request = require('request');

function checkVK(nickname, socNet) {
    return new Promise((resolve) => {
        request.get(`http://vk.com/${nickname}`).on('response', function(response) {
            if (response && response.statusCode === 200) {
                socNet.VK = `VK: http://vk.com/${nickname}`; // 200
            }
            console.log(`VK checked... ${nickname} ${response && response.statusCode}`);
            resolve();
        });
    });

}

function checkIG(nickname, socNet) {
    return new Promise((resolve) => {
        request.get(`http://instagram.com/${nickname}`, function (error, response, body) {
            if (response && response.statusCode === 200) {
                socNet.IG = `IG: http://instagram.com/${nickname}`; // 200
                let first = body.indexOf('external_url');
                let last = body.lastIndexOf('external_url');
                let slice = body.slice(first, last);
                console.log(first, last);
                console.log(slice);
                if (slice != 'external_url":null,"') {
                    slice = slice.slice(15, -3);
                    socNet.links.push(slice);
                }
            }
            console.log(`IG checked... ${nickname} ${response && response.statusCode}`);
            resolve();
        })
    });
}

function checkTW(nickname, socNet) {
    return new Promise((resolve) => {
        request.get(`http://twitter.com/${nickname}`).on('response', function(response) {
            if (response && response.statusCode === 200) {
                socNet.TW = `TW: http://twitter.com/${nickname}`; // 200
            }
            console.log(`TW checked... ${nickname} ${response && response.statusCode}`);
            resolve();
        });
    });
}

function answer(ctx, socNet) {
    let ans = `${socNet.VK}\n${socNet.IG}\n${socNet.TW}`;
    if (socNet.links.length != 0) {
        ans += `\n\nFollowing external links were found:\n`
        for (let i = 0; i < socNet.links.length; i++) {
            ans += `${socNet.links[i]}\n`
        }
    }
    console.log(socNet.links);
    ctx.reply(ans);
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
        VK: 'VK: Not found',
        IG: 'IG: Not found',
        TW: 'TW: Not found',
        links: []
    };
    let regex = /^[a-zA-Z0-9_\-:?%!.,/\\@"#&№$;\^*()]+$/;
    if (regex.test(ctx.message.text)) {
        checkAll(ctx.message.text, socialNetworks, ctx);
    }
    else {
        ctx.reply('Your message seems to have non-latin symbols.');
    }
});


bot.launch();
