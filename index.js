const linebot = require('linebot');
const translate = require('@k3rn31p4nic/google-translate-api');
const bot = linebot({
    channelId: CHANNEL_ID,
    channelSecret: CHANNEL_SECRET,
    channelAccessToken: CHANNEL_ACCESS_TOKEN
});

let languages = [
    { language: '繁體中文', code: 'zh-tw' },
    { language: '英文', code: 'en' },
    { language: '日文', code: 'ja' },
    { language: '韓文', code: 'ko' },
];

var users = [];
var groups = [];
var rooms = [];
var checkTransModeList = [];
var defaultLanguage = 1;
var welcomeMessage = getWelcomeString();
var firstTranslate = true;

bot.on('message', function (event) {
    var replyMessage = '';
    var receiveText = event.message.text;
    let sourceType = event.source.type
    let sourceId = getSourceId(event, sourceType);
    let sourceList = getSourceList(sourceType);
    console.log('Current source:\n', event.source.type, sourceId);

    initTranslateModeList(sourceId);
    console.log('CheckTransModeList:\n', checkTransModeList);

    if (receiveText === '翻譯') {
        checkTransModeList[sourceId].translateMode = true;
    } else if (receiveText === '翻譯結束') {
        checkTransModeList[sourceId].translateMode = false;
        firstTranslate = true;
    }

    if (checkTransModeList[sourceId].translateMode) {
        if (event.message.type === 'text') {
            replyMessage = initialize(sourceType, sourceId, receiveText, firstTranslate);
            sendMessage(event, replyMessage);
        } else {
            bot.push(sourceId, '塞拎娘！我沒厲害到可以辨識文字以外的東西！');
        };
        firstTranslate = false;
    };
});

bot.listen('/linewebhook', 3000, function () {
    console.log('[BOT已準備就緒]');
});

//----------------------------------------------------------------------
function initialize(sourceType, sourceId, receiveText, firstTranslate) {
    var replyMessage = '';
    var sourceList = getSourceList(sourceType);

    if (sourceList[sourceId] === undefined) {
        sourceList[sourceId] = [];
        sourceList[sourceId].userId = sourceId;
        sourceList[sourceId].defaultLanguage = defaultLanguage;
        replyMessage = welcomeMessage + '目前設定的翻譯語言是：' + languages[sourceList[sourceId].defaultLanguage].language;
    } else if (receiveText === '?') {
        replyMessage = '目前設定的翻譯語言是：' + languages[sourceList[sourceId].defaultLanguage].language;
    } else if (receiveText === '#') {
        replyMessage = '可翻譯語言有：\n' + getLanguageList();
    } else if (!isNaN(receiveText)) {
        if (Number(receiveText) < languages.length) {
            sourceList[sourceId].defaultLanguage = Number(receiveText);
            bot.push(sourceId, '目前翻譯語言：' + languages[Number(receiveText)].language);
        } else {
            bot.push(sourceId, `蝦七八打什麼洨，數字就只到 ${languages.length - 1} 而已！`);
        }
    } else {
        if (firstTranslate) {
            replyMessage = welcomeMessage + '目前設定的翻譯語言是：' + languages[sourceList[sourceId].defaultLanguage].language;
        } else {
            translate(receiveText, { to: languages[sourceList[sourceId].defaultLanguage].code }).then(res => {
                bot.push(sourceId, '`' + res.text + '`');
            }).catch(err => {
                console.error(err);
            });
        };
    };
    return replyMessage;
}

function initTranslateModeList(sourceId) {
    if (checkTransModeList[sourceId] === undefined) {
        checkTransModeList[sourceId] = [];
        checkTransModeList[sourceId].sourceId = sourceId;
        checkTransModeList[sourceId].translateMode = false;
    };
}

function getSourceList(sourceType) {
    switch (sourceType) {
        case 'user':
            return users;
        case 'group':
            return groups;
        case 'room':
            return rooms;
    };
}

function getSourceId(event, sourceType) {
    switch (sourceType) {
        case 'user':
            return event.source.userId;
        case 'group':
            return event.source.groupId;
        case 'room':
            return event.source.roomId;
    };
}

function sendMessage(event, message) {
    event.reply(message).then(function (data) {
        return true;
    }).catch(function (error) {
        return false;
    });
}

function getWelcomeString() {
    var welcomeMessage = '塞拎娘勒～\n輸入下列代碼幫你翻譯翻譯，你想翻譯成何種語言？\n';
    welcomeMessage += getLanguageList()
    return welcomeMessage
}

function getLanguageList() {
    var languageList = ''
    languageList += '-------------------------\n'
    for (var i = 0; i < languages.length; i++) {
        languageList += (i + '：' + languages[i].language + '\n');
    }
    languageList += '?：顯示目前翻譯語言\n';
    languageList += '#：顯示可翻譯語言\n';
    languageList += '-------------------------\n'
    languageList += '貼心小提醒：\n若使用結束請記得輸入「翻譯結束」\n';
    languageList += '要不然會一直翻譯喔～^O^～\n';
    languageList += '-------------------------\n'
    return languageList
}