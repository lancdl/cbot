const Discord = require('discord.js')

module.exports = (cbot, guild) => {
    console.log(`Теперь я модерирую ${guild.name} (${guild.id})`)
        var guildCreateEmbed = new Discord.RichEmbed()
            .setColor("#b87dff")
            .addField("💌", "Привет! Отныне я буду сообщать тебе о новых событиях на твоем сервере!")
            .addField("⚙", "Немного о функционале\nЧтобы получить информацию о своём сервере напиши команду `!инфо` (ВАЖНО! Писать нужно на своём сервере, чтобы бот понял о каком сервере идёт речь и бот должен иметь разрешение `Администратор`.), а все остальные действия бот будет выполнять сам (уведомление об изменениях будут приходить Вам в личные сообщения).")
        guild.owner.send(guildCreateEmbed)  
}