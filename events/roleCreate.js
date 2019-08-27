const Discord = require('discord.js')

module.exports = (cbot, role) => {
    console.log(`На ${role.guild.name} (${role.guild.id}) была создана роль ${role.name}`)
    var roleCreateEmbed = new Discord.RichEmbed()
        .setColor("#f5ad42")
        .setTitle("🔔")
        .setDescription(role.guild.name)
        .addField("Создана роль", role.name)
    role.guild.owner.send(roleCreateEmbed)
}