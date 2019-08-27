const Discord = require('discord.js')

module.exports = (callback, member) => {
    console.log(`${member.user.tag} (${member.user.id}) вышел/был забанен/кикнут на ${member.guild.name} (${member.guild.id})`)
        var removeEmbed = new Discord.RichEmbed()
            .setColor("#ff4242")
            .setTitle("💔")
            .setDescription(`Сервер: ${member.guild.name}`)
            .addField(`${member.user.tag}`, " покинул нас/был забанен/кикнут", true)
            .addField("Кол-во участников", member.guild.memberCount)
        member.guild.owner.send(removeEmbed)
}