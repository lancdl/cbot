const Discord = require('discord.js')

module.exports = (cbot, guild) => {
    console.log(`${guild.name} (${guild.id}) отключили нас...`)
        var guildDeleteEmbed = new Discord.RichEmbed()
            .setColor("#b87dff")
            .setTitle("🤔")
            .addField("Может возникла какая-то ошибка?", "Вы уверены что хотите отказаться от модерации с помощью нашего бота?\nЕсли это ошибка, то вы сможете пригласить бота снова по этой ссылке: https://lancdl.github.io/cbot/")
        guild.owner.send(guildDeleteEmbed)
}