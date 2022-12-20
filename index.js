const express = require('express');
const app = express();
const mymodel = require('./models').User;
const findRouter = require('./routers/findall');

app.get('/', (req,res) => res.send('Hello World'));

const teleapi = require('node-telegram-bot-api');
const token = '5594759191:AAGSsySNMcogk3l1ZXr8H0NSLmYFzE7TYRw';
const bot = new teleapi (token, {polling: true});

require('dotenv').config();
const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

let status = false

const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'Bot starting'},
        {command: '/email', description: 'Registration in db'}
    ]);

    bot.on('message', message => {
        console.log(message);
        const userMessage = message.text;
        const userId = message.chat.id;

        if(userMessage == '/start'){
            return bot.sendMessage(userId, 'Welcome to nodeGmailBot, you can send me yours Gmail and I will register you in the database and send you your password by email to register use the command /email 💚');
        }
        if(userMessage == '/email'){
            status = true;
            return bot.sendMessage(userId, 'Please send me your Gmail ✉️');
        }
        if(status){
            status = false;
            let userPassword = Math.floor(Math.random()*(999999-100000)+100000);
            const mailOptions = {
                from: 'davit.manukyan.d@tumo.org',
                to: userMessage,
                subject: 'nodeGmailBot',
                text: `Hi ${userMessage}, your password - ${userPassword} :)`
            }
            transporter.sendMail(mailOptions, err => {
                if(err === null){
                    mymodel.create({
                        telegramid: userId,
                        email: `${userMessage}`,
                        password: userPassword
                    });
                    bot.sendMessage(userId, 'Successfully ✅');
                }else {
                    bot.sendMessage(userId, `"${userMessage}" is Wrong Gmail ❌`);
                }
            });
            return bot.sendMessage(userId, 'The process is underway ... ⏳');
        }
        return bot.sendMessage(userId, '⛔️ Invalid command ⛔️');
    })
};

start();

app.get('/find', findRouter);

app.listen('5000', console.log('port - 5000'));