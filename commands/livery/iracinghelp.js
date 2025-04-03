const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('iracinghelp')
        .setDescription(`Help for /revhelmet commands`),

    async execute(interaction) {
        return await interaction.reply({content:"Here are the visorstrip options and a guide for /revhelmet ",files:['helmethelp.png','visorhelp.png'],ephemeral:true} );
    }
}