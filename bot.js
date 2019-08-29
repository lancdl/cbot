const Discord = require('discord.js')
const config = require('./config_defaults')
const fs = require('fs')
const cbot = new Discord.Client()

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

    rl.on('line', function(guildSize) {
        if (guildSize !== "guilds") {
            return;
        }
        console.log(`Бот находится на ${cbot.guilds.size} серверах.\n${cbot.guilds.map(g=>g.name).join("\n")}`)
    })

    rl.on('line', function(userSize) {
        if (userSize !== "users") {
            return;
        }
        console.log(`К боту подключено ${cbot.users.size} пользователей.\n${cbot.users.map(u=>u.tag).join("\n")}`)
    })

    rl.on('line', function(botUptime) {
    	if(botUptime !== "uptime") {
    		return;
    	}
			let totalSeconds = (cbot.uptime / 1000);
			let days = Math.floor(totalSeconds / 86400);
			let hours = Math.floor(totalSeconds / 3600);
			totalSeconds %= 3600;
			let minutes = Math.floor(totalSeconds / 60);
			let seconds = totalSeconds % 60;
			let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
			
    	console.log(uptime)
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

cbot.on('guildBanAdd', guild => {

})

cbot.on('guildBanRemove', guild => {

})