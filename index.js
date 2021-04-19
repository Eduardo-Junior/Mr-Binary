const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId } = require('./config.json');
const ProfileLevel = require('./classes/ProfileLevel.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const firebase = require ("firebase");

var firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
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

    if (message.content === `${prefix}level` || message.content === `${prefix}rank` || message.content === `${prefix}canvas` || message.content === `${prefix}teste`
        || message.content === `${prefix}reload teste`) return;

        if (message.channel.type == "dm") return;
        if(message.author.bot) return;

        let user = new ProfileLevel(message.author.username, 0, 1, message.author.id, message.author.avatarURL({format: 'jpg'}), 0);
        
        //Define se o usuário vai receber XP, upar de nível com o XP resetado ou upar de nível com o XP de sobra do nível anterior.

        database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`)
        .once('value').then(async function(db){

            let XpPlus = Math.floor(Math.random() * db.val().level) + 1;

            if(db.val() == null){

                user.CreateNewProfile(message.guild.id);

            }else if(db.val().level * 100 <= db.val().xp + XpPlus){

                if(db.val().xp + XpPlus > db.val().level * 100){

                    message.channel.send(`Parabéns, ${message.author}! Você acaba de subir para o nível ${db.val().level+1}!`)
                    user.UpdateLevelHoldXp(message.guild.id, XpPlus);

                }else{

                    message.channel.send(`Parabéns, ${message.author}! Você acaba de subir para o nível ${db.val().level+1}!`)
                    user.UpdateLevel(message.guild.id, XpPlus);

                }
            }else{

                user.UpdateProfile(message.guild.id, XpPlus);

            }
        });
});


client.on('message', message => {

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