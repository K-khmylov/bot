
const TelegramBot = require('node-telegram-bot-api');
const token = '5262563135:AAHBUFbhiZiVyUiEToPnkG_PFhA1J8DZNu4';
// const bot = new TelegramApi(token, {polling: true});

const bot = new TelegramBot(token, {polling: true});


const { gameOptions, againOptions } = require('./options')
const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Cейчас я загадаю число от 0 до 9, а ты попробуй отгадать`);
    const randomNum = Math.floor(Math.random() * 10);
    chats[chatId] = randomNum;
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
}

function start() {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/info', description: 'Информация об аккаунте' },
        { command: '/game', description: 'Игра "Угадай число"' },
    ]);

    bot.on('message', async (msg) => {
            let userText = msg.text;
            const chatId = msg.chat.id;

            if (userText === '/start') {
                return bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/972/d03/972d03b1-80b4-43ac-8063-80e62b150d91/4.webp`);
            };

            if (userText === '/info') {
                return bot.sendMessage(chatId, `Тебя зовут: ${msg.from.username} ${msg.from.first_name}\nТвой ID: ${msg.chat.id}`);
            };

            if (userText === '/game') {
                return startGame(chatId);
            };

            return bot.sendMessage(chatId, `Не понял`);
        });

    bot.on('callback_query', async msg => {
            const data = msg.data;
            const chatId = msg.message.chat.id;
            if(data === '/again'){
                return startGame(chatId)
            }
            if(data === chats[chatId]) {
                return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
            } else {
                return bot.sendMessage(chatId, `Не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
            }

        })
}

start();


