const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('acchelp')
        .setDescription(`Help for /revacc commands`),

    async execute(interaction) {
        return await interaction.reply({content:"Here are the acc colours to help choose basecolour:",files:['acchelp.png'],ephemeral:true} )
    }
}