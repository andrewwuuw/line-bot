# line-bot
Hi, I'm a node.js newcomer, I tried to practice and code a application.
This product is a translate line-bot can be used to translate in user, group or room.

#### environment:
- node.js
- npm 5.6.0
- ngrok

#### precondition:
1. Go to Line Developer register a account with `Message API`.
2. Enable `Use webhooks`.
3. If you want to let it get into the group, enable `Allow bot to join group chats`.
4. Setting `Webhook URL`, its format should be like `https://xxxxxxx.ngrok.io/linewebhook`, if you use the ngrok.
5. Start your ngrok server and node, you can use this line-bot.

#### using npm:
- linebot(https://www.npmjs.com/package/linebot)
- @k3rn31p4nic/google-translate-api(https://www.npmjs.com/package/@k3rn31p4nic/google-translate-api)

#### Actual Pictures
- type [翻譯] to start the line bot
![image](https://github.com/chiaqingwu/line-bot/blob/master/pictures/01_start.png)
- You have 3 languages can use.
![image](https://github.com/chiaqingwu/line-bot/blob/master/pictures/02_lang.png)
- Using [#] and [?]
![image](https://github.com/chiaqingwu/line-bot/blob/master/pictures/03_optional.png)
- Error Handling
![image](https://github.com/chiaqingwu/line-bot/blob/master/pictures/04_error_habling.png)
