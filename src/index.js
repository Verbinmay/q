const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { log } = require('console');
const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();

const port = process.env.PORT || 3005;
const app = express();

const bot = new TelegramBot(process.env.TOKEN, {
  polling: true,
});

const dontSleep = async (chatId) => {
  const res = await fetch('https://te-bot.onrender.com/');
  if (res.status === 200) {
    await bot.sendMessage(chatId, 'App on render work', { disable_notification: true });
    return 'App on render work';
  } else {
    await bot.sendMessage(chatId, 'ERROR', { disable_notification: true });
    return "App on render don't work";
  }
};

bot.on('message', (msg) => {
  const chatId = msg.from.id;
  log(chatId);

  // cron.schedule('*/30 * * * *', async () => {
  cron.schedule('* * * * * ', async () => {
    log(await dontSleep(chatId));
  });
});
app.use(cors());
app.use(express.json());

app.get('', (req, res) => {
  return res.send('all ok');
});

app.listen(port, () => {
  log(`App started at ${port} port`);
});
