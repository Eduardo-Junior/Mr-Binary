const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const p = require ('./classes/ProfileLevel.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const firebase = require ("firebase");
const Profile = require('./classes/ProfileLevel.js');

var firebaseConfig = {
  apiKey: "AIzaSyAKZTeJhPB6Pr-d73fnfJgQjwwiDMzipZQ",
  authDomain: "botlevel-1a20a.firebaseapp.com",
  databaseURL: "https://botlevel-1a20a.firebaseio.com",
  projectId: "botlevel-1a20a",
  storageBucket: "botlevel-1a20a.appspot.com",
  messagingSenderId: "54687765071",
  appId: "1:54687765071:web:8b9112382918183be1d03a"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Bot online!');
});

client.on('message', function(message) {

    if(message.content.toLowerCase() == 'galvão?' ){

        message.channel.send('Diga lá, tino!');

    }

    if (message.content === `${prefix}level` || message.content === `${prefix}rank` || message.content === `${prefix}canvas` || message.content === `${prefix}teste`
        || message.content === `${prefix}reload teste`) return;


        if (message.channel.type == "dm") return;
        if(message.author.bot) return;

        database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
        .once('value').then(async function(db){

            if(db.val() == null){

                p(message.author.username, 0, 1, message.author.id, message.author.avatarURL({format: 'jpg'}), 0);

                p.CreateNewProfile(message.guild.id);

            }else{

                p.UpdateProfile(message.guild.id);

            }

        });
});


//         database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
//         .once('value').then(async function(db) {

//         if(db.val() == null){
//             database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
//             .set({

//             xp: 0,
//             level: 1,
//             XPAcumulado: 0,
//             UserName: message.author.username,
//             ID: message.author.id,
//             Avatar: message.author.avatarURL({format: 'jpg'})

//             })

//         }else{
        
//         let gerarXP = Math.floor(Math.random() * db.val().level) + 1; 
//         let guardaResto = 0;
//         if(db.val().level * 100 <= db.val().xp){

//             if(db.val().xp + gerarXP > db.val().level * 100){

//             guardaResto = db.val().xp - (db.val().level * 100)
//             database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
//             .update({

//                 xp: guardaResto,
//                 level: db.val().level + 1,
//                 XPAcumulado: db.val().XPAcumulado + gerarXP,
//                 UserName: message.author.username,
//                 Avatar: message.author.avatarURL({format: 'jpg'})

//             });

//             }else{
//             database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
//             .update({

//                 xp: 1,
//                 level: db.val().level + 1,
//                 XPAcumulado: db.val().XPAcumulado + gerarXP,
//                 UserName: message.author.username,
//                 Avatar: message.author.avatarURL({format: 'jpg'})

//             });
//             }

        

//         message.channel.send(`Parabéns, ${message.author}! Você acaba de subir para o nível ${db.val().level+1}!`)

//         }else{


//         database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
//         .update({

//             xp: db.val().xp + gerarXP,
//             XPAcumulado: db.val().XPAcumulado + gerarXP,
//             UserName: message.author.username,
//             Avatar: message.author.avatarURL({format: 'jpg'})

//         })

//         }

//     }

//     });

// });

client.on('message', message => {
    console.log(message.content);

    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if(command.args && !args.length){

        return message.channel.send(`Você não passou nenhum parâmetro, ${message.author}`);

    }

    try{
        command.execute(message, args);
    }catch (error){

        console.error(error);
        message.reply('Occoreu um erro tentando executar este comando.');

    }

});


client.login(token);