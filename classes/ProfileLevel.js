const firebase = require ("firebase");
const Discord = require('discord.js');


class Profile{

    constructor(Nome, Xp, Level, ID, Avatar, Acumulado){

        this.userName = Nome;
        this.xp = Xp;
        this.level = Level;
        this.id = ID;
        this.avatar = Avatar;
        this.XPAcumulado = Acumulado;

    }

    CreateNewProfile(guild){

        const database = firebase.database();

        var userObj = {nome: this.userName, XP: this.xp, Level: this.level, ID: this.id, AVATAR: this.avatar, XPACUMULADO: this.XPAcumulado}

        database.ref(`Servidores/Levels/${guild}/${this.id}`)
        .once('value').then(async function(db) {

            database.ref(`Servidores/Levels/${guild}/${userObj.ID}`)
            .set({

                xp: userObj.XP,
                level: userObj.Level,
                XPAcumulado: userObj.XPACUMULADO,
                UserName: userObj.nome,
                ID: userObj.ID,
                Avatar: userObj.AVATAR

            });

        });

    }

    UpdateProfile(guild, XpPlus){

        const database = firebase.database();

        var userObj = {nome: this.userName, XP: this.xp, Level: this.level, ID: this.id, AVATAR: this.avatar, XPACUMULADO: this.XPAcumulado}

        database.ref(`Servidores/Levels/${guild}/${this.id}`)
        .once('value').then(async function(db) {

            database.ref(`Servidores/Levels/${guild}/${userObj.ID}`)
            .update({

                    xp: db.val().xp + XpPlus,
                    XPAcumulado: db.val().XPAcumulado + XpPlus,
                    UserName: userObj.nome,
                    ID: userObj.ID,
                    Avatar: userObj.AVATAR

            })
        });
    }

    UpdateLevel(guild, XpPlus){

        const database = firebase.database();

        var userObj = {nome: this.userName, XP: this.xp, Level: this.level, ID: this.id, AVATAR: this.avatar, XPACUMULADO: this.XPAcumulado}

        database.ref(`Servidores/Levels/${guild}/${this.id}`)
        .once('value').then(async function(db) {

            if(db.val().level * 100 < db.val().xp){
                
                database.ref(`Servidores/Levels/${guild}/${userObj.ID}`)
                .update({

                    xp: 1,
                    level: db.val().level + 1,
                    XPAcumulado: db.val().XPAcumulado + XpPlus,
                    UserName: userObj.nome,
                    ID: userObj.ID,
                    Avatar: userObj.AVATAR

                })
            }
        });
    }

    UpdateLevelHoldXp(guild, XpPlus){

        var userObj = {nome: this.userName, XP: this.xp, Level: this.level, ID: this.id, AVATAR: this.avatar, XPACUMULADO: this.XPAcumulado}

        const database = firebase.database();

        database.ref(`Servidores/Levels/${guild}/${this.id}`)
        .once('value').then(async function(db) {

            var guardaResto = db.val().xp - (db.val().level * 100);

            database.ref(`Servidores/Levels/${guild}/${userObj.ID}`)
            .update({

                xp: guardaResto,
                level: db.val().level + 1,
                XPAcumulado: db.val().XPAcumulado + XpPlus,
                UserName: userObj.nome,
                ID: userObj.ID,
                Avatar: userObj.AVATAR

            })
        });
    }
}

module.exports = Profile;