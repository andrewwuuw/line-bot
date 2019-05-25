const linebot = require('linebot');
const translate = require('@k3rn31p4nic/google-translate-api');
const bot = linebot({
    channelId: '1577605735',
    channelSecret: '62974195cfc83efca8dd6fcc4f0b59aa',
    channelAccessToken: '7bpwTEYLp0/EC7WEr08+M4Lih0GNIurFoQuSTANVv2hU3v+J+6VI/X+tXtiNkOkozTQa2FajyCB8jm/p6jV9IAypJ4oSaLt8LVj+/Y4Jj2WSMiCygQDIAl1w0W+aYzGDswtZb11jZtaeKD89tlpSEwdB04t89/1O/w1cDnyilFU='
});

var users = [];
var defaultLanguage = 1;
var languages = [
    { language: '繁體中文', code: 'zh-tw' },
    { language: '英文', code: 'en' },
    { language: '日文', code: 'ja' },
    { language: '韓文', code: 'ko' },
];
var welcomeMessage = getWelcomeString();
var translateMode = false;

bot.on('message', function (event) {
    var replyMessage = '';
    var receiveText = event.message.text;
    var myId = event.source.userId;
    var groupId = '';

    if (event.source.type === 'group') {
        var groupId = event.source.groupId;
        console.log(`groupID:\n ${groupId}`);
    }

    if (receiveText === '翻譯') {
        translateMode = true;
    } else if (receiveText === '翻譯結束') {
        translateMode = false;
    }

    if (translateMode) {
        if (event.message.type === 'text') {
            if (users[myId] === undefined) {
                users[myId] = [];
                users[myId].userId = myId;
                users[myId].defaultLanguage = defaultLanguage;
                replyMessage = welcomeMessage + '目前設定的翻譯語言是：' + languages[users[myId].defaultLanguage].language;
            } else if (receiveText === '?') {
                replyMessage = '目前設定的翻譯語言是：' + languages[users[myId].defaultLanguage].language;
            } else if (receiveText === '#') {
                replyMessage = '可翻譯語言有：\n' + getLanguageList();
            } else if (!isNaN(receiveText)) {
                if (Number(receiveText) < languages.length) {
                    setLanguage(myId, Number(receiveText));
                    if (groupId !== '') {
                        bot.push(groupId, '目前翻譯語言：' + languages[Number(receiveText)].language);
                    } else {
                        bot.push(myId, '目前翻譯語言：' + languages[Number(receiveText)].language);
                    };
                };
            } else {
                translate(receiveText, { to: languages[users[myId].defaultLanguage].code }).then(res => {
                    console.log(res.text);
                    if (groupId !== '') {
                        bot.push(groupId, '`' + res.text + '`');
                    } else {
                        bot.push(myId, '`' + res.text + '`');
                    };
                }).catch(err => {
                    console.error(err);
                });
            };
            sendMessage(event, replyMessage);
        };
    };
});

bot.listen('/linewebhook', 3000, function () {
    console.log('[BOT已準備就緒]');
});

//----------------------------------------------------------------------
function sendMessage(event, message) {
    event.reply(message).then(function (data) {
        return true;
    }).catch(function (error) {
        return false;
    });
}

function setLanguage(userId, languageIndex) {
    users[userId].defaultLanguage = languageIndex;
}

function getWelcomeString() {
    var welcomeMessage = '塞拎娘勒～\n我可以幫你翻譯翻譯，你想翻譯成何種語言？（輸入數字就好）\n';
    welcomeMessage += getLanguageList()
    return welcomeMessage
}

function getLanguageList() {
    var languageList = ''
    for (var i = 0; i < languages.length; i++) {
        languageList += (i + '：' + languages[i].language + '\n');
    }
    languageList += '?：顯示目前翻譯語言\n';
    languageList += '#：顯示可翻譯語言\n';
    return languageList
}