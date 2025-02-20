const { SlashCommandBuilder } = require('discord.js');
const { PythonShell } = require('python-shell');
const gf = require('./get_folders.js');
const fs = require('fs'); // For handling file operations

module.exports = {
    data: new SlashCommandBuilder()
        .setName('revacc')
        .setDescription('Generates a REVSPORT International Assetto Corsa Competizione livery')
        .addStringOption(option =>
            option.setName('car')
                .setDescription('Car to search for')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('finish')
                .setDescription('Finish of the base colour')
                .setRequired(true)
                .addChoices(
                    { name: 'Glossy', value: '0' },
                    { name: 'Matte', value: '1' },
                    { name: 'Satin', value: '2' },
                    { name: 'Satin Metallic', value: '3' },
                    { name: 'Metallic', value: '4' },
                    { name: 'Chrome', value: '5' },
                    { name: 'Clear Chrome', value: '6' },
                )),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();

        try {
            const acc_cars = await gf.getFolders('./commands/livery/acc'); // Await the Promise
            console.log("Available ACC cars:", acc_cars);
            console.log("Focused value:", focusedValue);

            if (!acc_cars || acc_cars.length === 0) {
                return await interaction.respond([]); // Return an empty array if no folders are found
            }

            const choices = acc_cars.sort();
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
        // Defer the reply to give the bot more time to process the Python script
        await interaction.deferReply();

        // Get the options from the interaction
        const car = interaction.options.getString('car');
        const finish = interaction.options.getString('finish');

        // Set up PythonShell options
        const options = {
            mode: 'text',
            pythonOptions: ['-u'], // Unbuffered stdout
            args: [car, finish], // Pass car and finish as arguments to the Python script
        };

        // Run the Python script
        PythonShell.run('./commands/livery/acc_script.py', options, async (err, results) => {
            if (err) {
                console.error('Error running Python script:', err);
                return await interaction.editReply('An error occurred while generating the livery.');
            }

            // Log the results from the Python script
            console.log('Python script output:', results);

            // Assuming the Python script outputs a file path or generates a file
            const filePath = results; // Replace this with the actual file path or logic to get the file

            // Check if the file exists
            if (!fs.existsSync(filePath)) {
                return await interaction.editReply('The livery file could not be found.');
            }

            // Send the file as an attachment
            await interaction.editReply({
                content: 'Livery generated successfully!',
                files: [filePath], // Attach the file
            });
        });
    },
};