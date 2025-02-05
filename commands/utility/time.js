const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('time')
        .setDescription('Replies with time since reincarnation'),
    async execute(interaction) {
        let timeAlive = Date.now()-process.uptime();
        let response = "Since" + timeAlive.toString() + " xm3 bot has been alive.";
        await interaction.reply(response);
    },
};
