const Discord = require ('discord.js');


class Profile{


    constructor(Name, Xp, Level, ID, Avatar, Acumulado){

        this.userName = Name;
        this.xp = Xp;
        this.level = Level;
        this.id = ID;
        this.avatar = Avatar;
        this.XPAcumulado = Acumulado;

    }

    exports.create = function(guild){

        database.ref(`Servidores/Levels/${guild}/${this.id}`)
        .once('value').then(async function(db) {

            database.ref(`Servidores/Levels/${guild}/${author}`)
            .set({

                xp: this.xp,
                level: this.level,
                XPAcumulado: this.XPAcumulado,
                UserName: this.userName,
                ID: this.id,
                Avatar: this.avatar

            })

        });

    }

    exports.update = function(guild){

        database.ref(`Servidores/Levels/${guild}/${this.id}`)
        .once('value').then(async function(db) {
            
           let XpPlus = Math.floor(Math.random() * db.val().level) + 1;

            if(db.val().xp * 100 < db.val().xp){

                if(db.val().xp + XpPlus > db.val().level * 100){
                    database.ref(`Servidores/Levels/${guild}/${this.id}`).update({

                        xp: 1,
                        level: db.val().level + 1,
                        XPAcumulado: db.val().XPAcumulado + XpPlus,
                        UserName: this.userName,
                        ID: this.id,
                        Avatar: this.avatar


                    })
                }

                message.channel.send(`Parabéns, ${this.userName}! Você acaba de subir para o nível ${db.val().level+1}!`)

            }else{
                database.ref(`Servidores/Levels/${guild}/${this.id}`).update({

                    xp: db.val(),
                    XPAcumulado: db.val() + XpPlus,
                    UserName: this.userName,
                    ID: this.id,
                    Avatar: this.avatar


                })
            }

        });
    }  
}

module.exports = Profile;
