const Discord = require('discord.js')

module.exports = (cbot, member) => {
    console.log(`${member.user.tag} (${member.user.id}) зашел на ${member.guild.name} (${member.guild.id})`)
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
}