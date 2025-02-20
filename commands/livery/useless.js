const { SlashCommandBuilder } = require('discord.js');
const PythonShell = require('python-shell').PythonShell;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('useless')
        .setDescription('Replies with useless bullshit!'),
    async execute(interaction) {

        PythonShell.run('./commands/livery/iracing_script.py', null, function (err) {
            if (err) throw err;
            console.log('finished');
        }).then(async messages => {
            console.log(messages)
            await interaction.reply(messages[0])
        });
    },
}