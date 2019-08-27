const Discord = require('discord.js')

module.exports = (cbot, role) => {
    console.log(`На ${role.guild.name} (${role.guild.id}) была удалена роль ${role.name}`)
    var roleDeleteEmbed = new Discord.RichEmbed()
        .setColor("#f5ad42")
        .setTitle("🔔")
        .setDescription(role.guild.name)
        .addField("Удалена роль", role.name)
    role.guild.owner.send(roleDeleteEmbed)
}