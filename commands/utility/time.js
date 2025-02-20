const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Replies with time since reincarnation'),
    async execute(interaction) {
        let timeAlive = process.uptime();
        let response = "For" + timeAlive.toString()+ " seconds xm3 bot has been alive.";
        await interaction.reply(response);
    },
};
