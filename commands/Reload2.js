const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
    name: "reload2",
    description: "Recarrega os comandos",
    guildOnly: true,
    args: true,

    execute(message, args) {

        console.log(message.member);

      if(!message.member.permissions.has("Admin")) return;

      if (!args.length){
        return message.channel.send({
          embed: {
            color: "#FF0000",
            description: "Informe o comando que você deseja recarregar."
          }
        });
    }

      const commandName = args[0].toLowerCase();
      const command =  message.client.commands.get(commandName) ||  message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

      if (!command)

        return message.channel.send({
          embed: {

            color: "#FF0000",
            description: `Não há comando com nome ou apelido \`${commandName}\`.`
          }

        });

      delete require.cache[require.resolve(`./${command.name}.js`)];

      try {

        const newCommand = require(`./${command.name}.js`);

        message.client.commands.set(newCommand.name, newCommand);

        message.channel.send({
          embed: {
            color: "#00BFFF",
            description: `O comando \`${command.name}\` foi recarregado!`
          }
        });

      } catch (error) {

        console.log(error);

        message.channel.send({
          embed: {
            color: "#FF0000",
            description: `Ocorreu um erro ao recarregar um comando \`${command.name}\`:\n\`${error.message}\``

          }
        });
      }
    }
  };
  