const Discord = require('discord.js')

module.exports = (cbot, oldGuild, newGuild) => {
    console.log(`На сервере ${newGuild.name} произошло изменение`)

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
}