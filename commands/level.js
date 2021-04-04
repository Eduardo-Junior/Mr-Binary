const Discord = require("discord.js");
const { Canvas, resolveImage } = require("canvas-constructor"); // You can't make images without this. // This is to get a font file.
const fetch = require("node-fetch"); // This is to fetch the user avatar and convert it to a buffer.
const firebase = require ("firebase");
const { UserRefreshClient } = require("google-auth-library");
const fs = require('fs');
const moment = require("moment");
const { measureMemory } = require("vm");





module.exports = {
  name: "level",
  description: "cartão do perfil",
  guildOnly: true,
  async execute(message, args) {

    moment.locale()

    

    const database = firebase.database();

    let userMen = message.mentions.users.first() || message.author;
    let userPos = 0;
    userTag = "";
    var eixoTag = 0;
    

    String.prototype.trimEllip = function (length) {
        return this.length > length ? this.substring(0, length) + '...' : this;
    }



    const member = message.guild.member(userMen);

    if(userMen.username.length>5 && userMen.username.length<8){

      eixoTag = 618;
      userTag = userMen.tag;

    }else if(userMen.username.length<=5){

      eixoTag = 620;
      userTag = userMen.tag;

    }else if(userMen.username.length == 8){

      eixoTag = 620;
      userTag = userMen.tag;

    }else if(userMen.username.length>8){

      eixoTag = 620;
      userTag = userMen.username;

      userTag = userTag.trimEllip(8) + `#${userMen.discriminator}`;

    }

      let game;
      let autor;
      let nomeMusica;
      let tipoAtividade = "";
      let color = "";
      let alphaMusica = 0;

      if (userMen.presence.activities.length >= 1){

          switch(userMen.presence.activities[0].type){

            case 'LISTENING':
              tipoAtividade = "Ouvindo";
              break;

            case 'WATCHING':
              tipoAtividade = "Assistindo";
              break;
            
            case 'PLAYING':
              tipoAtividade = "Jogando"
              break;
            
            case 'CUSTOM_STATUS':
              tipoAtividade = userMen.presence.activities[0].type;
            
          }

          game = `${tipoAtividade} ${userMen.presence.activities[0].name}`;
      
      }else{

        game = "Nenhuma";

      }

      if(tipoAtividade === "Ouvindo" && userMen.presence.activities[0].name === "Spotify"){

        nomeMusica = userMen.presence.activities[0].details;
        autor = userMen.presence.activities[0].state;

        nomeMusica = nomeMusica.trimEllip(17);
        autor = autor.trimEllip(20);
        alphaMusica = 0.8;

      }else{

        alphaMusica = 0;

      }

      console.log(userMen.presence.status);
      console.log(userMen.presence);

      switch(userMen.presence.status){

        case 'online':
            color = "#00A16E";
            break;

        case 'idle': 
            color = "#E99C1A";
            break;

        case 'dnd':
            color = "#C93E3F";
            break;
        
        case 'offline':
            color = "#5A636E"
            break;
        
      }
  

    var ref = firebase.database().ref(`Servidores/Levels/${message.guild.id}`);

    ref.once('value', gotData, errData);

    function gotData(data){

      var usuarios = data.val();

      console.log("aqui", usuarios, data.val())

      var array = Object.keys(usuarios).map(key => usuarios[key]);
      var objetoPrincipal = {};
      array.sort((b, a) => a.XPAcumulado - b.XPAcumulado)
      
      
      for (var c = 0; c < array.length; c++){

        var user = array[c].UserName;
        var xpA = array[c].XPAcumulado;
        var level = array[c].level;
        var xp = array[c].xp;

        objetoPrincipal[c] = {nome: user, xpAcumulado : xpA, nivel : level, xp : xp};

        if (userMen.username == array[c].UserName){

          userPos = c;

        }
      }
    }


    function errData(errData){

      console.log('Error!');
      console.log('err')

    }



   
   

    database.ref(`Servidores/Levels/${message.guild.id}/${userMen.id}`)
    .once('value').then(async function(db) { 

    
    const avatar = await resolveImage(userMen.avatarURL({format: 'jpg'}))

    let canvas = new Canvas(1200,1800)

    .printLinearColorGradient(0, 0, 0, 1800, [
      { position: 0, color: '#191B30' },
      { position: 0.5, color: '#0E0E18' }  
    ])

    .printRectangle(0, 0, 1200, 1800)
    
    .printLinearColorGradient(0, 0, 0, 1800, [
      { position: 0, color: '#8125A9' },
      { position: 0.3, color: '#411355' }  
    ])


    .setShadowColor("#000000")
    .setShadowOffsetY(3) 
    .setShadowBlur(10)
    .printCircle(600,-954, 1500)

    
    
    .setShadowColor("#000000")
    .setShadowOffsetY(3) 
    .setShadowBlur(10)
    .setColor("#FFFFFF")
    .printCircle(620, 270, 220)
    .printCircularImage(avatar, 620, 270, 220)

    .beginPath()
    .setShadowColor(color)
    .setShadowOffsetY(3) 
    .setShadowBlur(15)
    .setLineWidth(15)
    .setStroke(color)
    .arc(620, 270, 250, 0, 2 * Math.PI)
    .arc(620, 270, 250, 0, ((100 / (db.val().level * 100)) * db.val().xp) * 2 * Math.PI)
    .stroke()

    
    .setShadowColor("#000000")
    .setShadowOffsetY(3)
    .setShadowBlur(10)
    .save()
    .setColor("#FFFFFF")
    .createRoundedClip(201, 1400, 800, 50, 30)
    .fill()
    .restore()

    .save()
    .setColor("#08B77F")
    .createRoundedClip(201, 1400, ((100 / (db.val().level * 100)) * db.val().xp) * 8, 50, 30)
    .fill()
    .restore()
    
    
    .setTextFont("bold 32pt Arial Black")
    .setColor("#FFFFFF")
    .setTextAlign("center")
    .printText("Membro desde", 620, 700)
    .printText(moment(member.joinedAt).format('LL'), 620, 760)

    .setTextFont("bold 46pt Arial Black")
    .printText("Atividade:", 620, 1000)
    .setTextFont("semibold 36pt Arial")
    .printText(game, 620, 1070)
    
    .setGlobalAlpha(alphaMusica)
    .setTextFont("bold 34pt Arial Black")
    .printText(`${nomeMusica} - ${autor}`, 620, 1140)
    
    .setGlobalAlpha(1)
    .setTextFont("bold 42pt Arial Black")
    .setTextAlign("center")
    .printText(`Posição do rank - ${userPos}º`, 620, 1370)
    .printText(`${db.val().level}`, 110, 1445)
    .printText(`${db.val().level + 1}`, 1098, 1445)
    .printText(`XP Acumulado:`, 620, 1530)
    .printText(db.val().XPAcumulado, 620, 1600)


    .setTextFont("bold 48pt Arial")
    
    .setColor("#FFFFFF")
    .setTextAlign("center")
    .printText(`${userTag}`, eixoTag, 630)

    .toBuffer();

    const attachment = new Discord.MessageAttachment(canvas);

      message.channel.send(attachment)
    })
  }
};
