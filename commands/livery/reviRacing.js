const { SlashCommandBuilder } = require('discord.js');
const PythonShell = require('python-shell').PythonShell;
const gf = require('./get_folders.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('reviracing')
        .setDescription('Generates a REVSPORT International livery for iRacing')
        .addStringOption(option =>
            option.setName('car')
                .setDescription('Car to search for')
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();

        try {
            const iracing_cars = await gf.getFolders('./commands/livery/iracing'); // Await the Promise
            console.log("Available iRacing cars:", iracing_cars);
            console.log("Focused value:", focusedValue);

            if (!iracing_cars || iracing_cars.length === 0) {
                return await interaction.respond([]); // Return an empty array if no folders are found
            }

            const choices = iracing_cars.sort();
            const filtered = choices
                .filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()))
                .slice(0, 25);

            await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
        } catch (error) {
            console.error("Error fetching iRacing cars:", error);
            await interaction.respond([]); // Return empty if an error occurs
        }
    },

    async execute(interaction) {
        const selectedCar = interaction.options.getString('car');
        console.log(`Selected Car: ${selectedCar}`);
        await interaction.reply(`Generating livery for **${selectedCar}**...`);

        PythonShell.run('./commands/livery/iracing_script.py', { args: [selectedCar] })
            .then(async messages => {
                console.log(messages);
                await interaction.followUp(messages[0] || 'Livery generated successfully!');
            })
            .catch(async err => {
                console.error(err);
                await interaction.followUp('An error occurred while generating the livery.');
            });
    },
};

