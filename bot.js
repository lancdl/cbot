const Discord = require('discord.js')
const config = require('./config_defaults')
const fs = require('fs')
const cbot = new Discord.Client()

const io = require('@pm2/io')

io.init({
  metrics: {
    network: {
      ports: true
    }
  }
})

/*/const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true });

mongoose.connection.once('open', function(){
    console.log('Бот подключен к базе данных.')
}).on('error', function(error){
    console.log('Ошибка подключения:', error)
})
/*/

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

cbot.login(config.token)

cbot.on('ready', ready => {
    console.log(`${cbot.user.tag}:\x1b[32mON\x1b[0m`)

    cbot.user.setActivity("lancdl.github.io/callback/")

    cbot.users.get(config.dev_id).send('Бот запущен.')

    rl.on('line', function(guildsSize) {
        if (guildsSize !== "guilds") {
            return;
        }
        console.log(`Бот находится на ${cbot.guilds.size} серверах.\n${cbot.guilds.map(g=>g.name).join("\n")}`)
    })

    rl.on('line', function(usersSize) {
        if (usersSize !== "users") {
            return;
        }
        console.log(`К боту подключено ${cbot.users.size} пользователей.\n${cbot.users.map(u=>u.tag).join("\n")}`)
    })
})

cbot.on("message", async message => {
    let prefix = "!"

    if (message.channel.type === "dm") {
        if (message.author.id !== config.bot_id) {
            return console.log(`${message.author.tag} (${message.author.id}) пытался достучаться в личные сообщения бота. Вот что он пытался сказать: ${message.content}`);
        }
    }

    if(message.content === `${prefix}guilds`) {
        await message.delete()

        if(message.author.id !== config.dev_id) {
            return;
        }
        return message.author.send(`Бот находится на ${cbot.guilds.size} серверах.\n${cbot.guilds.map(g=>g.name).join("\n")}`)
    }

    if(message.content === `${prefix}users`) {
        await message.delete()

        if(message.author.id !== config.dev_id) {
            return;
        }
        return message.author.send(`К боту подключено ${cbot.users.size} пользователей.\n${cbot.users.map(u=>u.tag).join("\n")}`)
    }

    if (message.content === `${prefix}проверка`) {
        await message.delete()

        if (!message.member.guild.me.hasPermission([8])) {
            if (message.author.id !== message.guild.ownerID) {
                var noneOwnerEmbed = new Discord.RichEmbed()
                    .setColor("#fcba03")
                    .setTitle("⚠")
                    .setDescription("Нужно быть владельцем сервера.")
                return message.author.send(noneOwnerEmbed), console.log(`${message.author.tag} (${message.author.id}) пытался проверить бота не являясь владельцем.`);
            } else {
                return message.author.send("Боту необходимо разрешение `ADMINISTRATOR`.\nВ данный момент бот не сможет выполнять команду `!инфо`."), console.log(`${message.author.tag} (${message.author.id}) проверил бота. Результат: Необходимо разрешение.`);
            }
        }

        if (message.member.guild.me.hasPermission([8])) {
            if (message.author.id !== message.guild.ownerID) {
                var noneOwnerEmbed = new Discord.RichEmbed()
                    .setColor("#fcba03")
                    .setTitle("⚠")
                    .setDescription("Нужно быть владельцем сервера.")
                return message.author.send(noneOwnerEmbed), console.log(`${message.author.tag} (${message.author.id}) пытался проверить бота не являясь владельцем.`);
            } else {
                return message.author.send("Бот впорядке!"), console.log(`${message.author.tag} (${message.author.id}) проверил бота. Результат: Бот впорядке!`);
            }
        }
    }

    if (message.content === `${prefix}инфо`) {
        await message.delete();

        if (message.author.id !== message.guild.ownerID) {
            var noneOwnerEmbed = new Discord.RichEmbed()
                .setColor("#fcba03")
                .setTitle("⚠")
                .setDescription("Нужно быть владельцем сервера.")
            return message.author.send(noneOwnerEmbed), console.log(`${message.author.tag} (${message.author.id}) пытался получить информацию о сервере не являясь владельцем.`);
        }
        if (message.author.id === message.guild.ownerID) {
            console.log(`Информация по серверу ${message.guild.name}/${message.guild.id}`);
            console.log(message.guild)
            var serverEmbed = new Discord.RichEmbed()
                .setColor("#fac534")
                .setTitle("📋 Информация про сервер")
                .setThumbnail(message.guild.iconURL)
                .addField("Название", message.guild.name)
                .addField("Акроним", message.guild.nameAcronym)
                .addField("ID сервера", message.guild.id)
                .addField("Регион", message.guild.region)
                .addBlankField()
                .addField("Кол-во сообщений", message.guild.messages)
                .addField("Кол-во участников", message.guild.memberCount)
                .addField("Кол-во онлайн участников", message.guild.members.filter(m => m.presence.status === 'online').size)
                .addField("Кол-во ролей", message.guild.roles.size)
                .addField("Кол-во эмоджи", message.guild.emojis.size)
                .addField("Кол-во каналов", message.guild.channels.size)
                .addBlankField()
                .addField("mfaLevel", message.guild.mfaLevel)
                .addField("Уровень верификации", message.guild.verificationLevel)
                .addField("Наличие верификации", message.guild.verified)
            return message.author.send(serverEmbed)
        }
    }
})

fs.readdir('./events', (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`./events/${file}`)
        let evtName = file.split('.')[0]
        console.log(`Загружен ивент '${evtName}'`)
        cbot.on(evtName, evt.bind(null, cbot))
    })
})

/*/
cbot.on('guildMemberAdd', member => {
    console.log(`${member.user.tag} зашел на ${member.guild.name}`)
        var joinEmbed = new Discord.RichEmbed()
            .setColor("#ff4242")
            .setTitle("💖")
            .setDescription(`Сервер: ${member.guild.name}`)
            .addField(`${member.user.tag}`, " зашел на сервер", true)
            .addField("Кол-во участников", member.guild.memberCount)
        member.guild.owner.send(joinEmbed)
        if(member.guild.id === "403271253290647562"){
            let myRole = member.guild.roles.find(role => role.name === "Фалконовец")
            return member.addRole(myRole).catch(console.error);
        }
})
/*/
/*/
cbot.on('guildCreate', guild => {
    console.log(`Теперь я модерирую ${guild.name}`)
        var guildCreateEmbed = new Discord.RichEmbed()
            .setColor("#b87dff")
            .addField("💌", "Привет! Отныне я буду сообщать тебе о новых событиях на твоем сервере!")
            .addField("⚙", "Немного о функционале\nЧтобы получить информацию о своём сервере напиши команду `!инфо` (ВАЖНО! Писать нужно на своём сервере, чтобы бот понял о каком сервере идёт речь.), а все остальные действия бот будет выполнять сам (уведомление об изменениях будут приходить Вам в личные сообщения).")
        guild.owner.send(guildCreateEmbed)            
})
/*/
/*/
cbot.on('guildDelete', guild => {
    console.log(`${guild.name} отключили нас...`)
        var guildDeleteEmbed = new Discord.RichEmbed()
            .setColor("#b87dff")
            .setTitle("🤔")
            .addField("Может возникла какая-то ошибка?", "Вы уверены что хотите отказаться от модерации с помощью нашего бота?\nЕсли это ошибка, то вы сможете пригласить бота снова по этой ссылке: `ссылка`")
        guild.owner.send(guildDeleteEmbed)
})
/*/
/*/
cbot.on('guildMemberRemove', member => {
    console.log(`${member.user.tag} вышел/был забанен/кикнут на ${member.guild.name}`)
        var removeEmbed = new Discord.RichEmbed()
            .setColor("#ff4242")
            .setTitle("💔")
            .setDescription(`Сервер: ${member.guild.name}`)
            .addField(`${member.user.tag}`, " покинул нас/был забанен/кикнут", true)
            .addField("Кол-во участников", member.guild.memberCount)
        member.guild.owner.send(removeEmbed)
})
/*/
/*/
cbot.on('guildUpdate', (oldGuild, newGuild) => {
    console.log(`На ${newGuild.name} произошло изменение`)
    var guildUpdateEmbed = new Discord.RichEmbed()
        .setColor("#4287f5")
        .setTitle("⚙")
        .setDescription(newGuild.name)
        .addField("oldName", oldGuild.name)
        .addField("oldNameAcronym", oldGuild.nameAcronym)
        .addField("oldRegion", oldGuild.region)
        .addField("oldVerificationLevel", oldGuild.verificationLevel)
        .addField("oldMFALevel", oldGuild.mfaLevel)
        .addField("oldVerified", oldGuild.verified)
        .addBlankField()
        .addField("newName", newGuild.name)
        .addField("newNameAcronym", newGuild.nameAcronym)
        .addField("newRegion", newGuild.region)
        .addField("newVerificationLevel", newGuild.verificationLevel)
        .addField("newMFALevel", newGuild.mfaLevel)
        .addField("newVerified", newGuild.verified)
    newGuild.owner.send(guildUpdateEmbed)
})
/*/
/*/
cbot.on('roleCreate', role => {
    console.log(`На ${role.guild.name} была создана роль ${role.name}`)
    var roleCreateEmbed = new Discord.RichEmbed()
        .setColor("#f5ad42")
        .setTitle("🔔")
        .setDescription(role.guild.name)
        .addField("Создана роль", role.name)
    role.guild.owner.send(roleCreateEmbed)
})
/*/
/*/
cbot.on('roleDelete', role => {
    console.log(`На ${role.guild.name} была удалена роль ${role.name}`)
    var roleDeleteEmbed = new Discord.RichEmbed()
        .setColor("#f5ad42")
        .setTitle("🔔")
        .setDescription(role.guild.name)
        .addField("Удалена роль", role.name)
    role.guild.owner.send(roleDeleteEmbed)
})
/*/
/*/
cbot.on('roleUpdate', (oldRole, newRole) => {
    console.log(`На ${newRole.guild.name} была изменена роль ${oldRole.name} на ${newRole.name}`)
    var roleUpdateEmbed = new Discord.RichEmbed()
        .setColor("#f5ad42")
        .setTitle("🔔")
        .setDescription(newRole.guild.name)
        .addField("oldName", oldRole.name)
        .addField("oldPermissions", oldRole.permissions)
        .addField("oldColor", oldRole.color)
        .addBlankField()
        .addField("newName", newRole.name)
        .addField("newColor", newRole.color)
        .addField("newPermissions", newRole.permissions)
    newRole.guild.owner.send(roleUpdateEmbed)   
})
/*/

cbot.on('guildBanAdd', guild => {

})

cbot.on('guildBanRemove', guild => {

})