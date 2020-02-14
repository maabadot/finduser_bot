const Telegraf = require('telegraf');
const config = require('./config.json');
const request = require('request');

function checkVK(nickname, socNet) {
    return new Promise((resolve) => {
        request.get(`https://api.vk.com/method/users.get?user_ids=${nickname}&fields=connections,site&access_token=${config.token_VKAPI}&v=5.52`, function (error, response, body) {
            console.log(`VK checked... ${nickname} ${response && response.statusCode}`);
            let object = JSON.parse(body);
            console.log(object);
            if (object.error == undefined) {
                socNet.VK = `VK: http://vk.com/${nickname}`;
                object.response[0].twitter != undefined ? socNet.linksVK.push(`TW: http://twitter.com/${object.response[0].twitter}`) : false;
                object.response[0].instagram != undefined ? socNet.linksVK.push(`IG: http://instagram.com/${object.response[0].instagram}`) : false;
                object.response[0].skype != undefined ? socNet.linksVK.push(`Skype: ${object.response[0].skype}`) : false;
                object.response[0].facebook != undefined ? socNet.linksVK.push(`FB: http://facebook.com/${object.response[0].facebook}`) : false;
                object.response[0].livejournal != undefined ? socNet.linksVK.push(`LiveJournal: ${object.response[0].livejournal}.livejournal.com`) : false;
                object.response[0].site != undefined ? object.response[0].site != '' ? socNet.linksVK.push(`Site: ${object.response[0].site}`) : false : false;
            }
            resolve();
        })
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
                    socNet.linksIG.push(slice);
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
    if (socNet.linksIG.length != 0) {
        ans += `\n\nFollowing external links were found in IG:\n`
        for (let i = 0; i < socNet.linksIG.length; i++) {
            ans += `${socNet.linksIG[i]}\n`
        }
    }
    if (socNet.linksVK.length != 0) {
        ans += `\n\nFollowing external links were found in VK:\n`
        for (let i = 0; i < socNet.linksVK.length; i++) {
            ans += `${socNet.linksVK[i]}\n`
        }
    }
    console.log(socNet.linksIG);
    console.log(socNet.linksVK);
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
        linksIG: [],
        linksVK: []
    };
    let regex = /^[a-zA-Z0-9_\-:?%!.,/\\\\@|"#&№$;\^*()]+$/;
    if (regex.test(ctx.message.text)) {
        checkAll(ctx.message.text, socialNetworks, ctx);
    }
    else {
        ctx.reply('Your message seems to have non-latin symbols.');
    }
});


bot.launch();
