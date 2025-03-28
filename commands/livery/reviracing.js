const { SlashCommandBuilder } = require('discord.js');
const { PythonShell } = require('python-shell');
const gf = require('./get_folders.js');
const fs = require('fs'); // For handling file operations
const math = require('mathjs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reviracing')
        .setDescription('Generates a REVSPORT International Assetto Corsa Competizione livery')
        .addStringOption(option =>
            option.setName('car')
                .setDescription('Car to search for')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('basecolour')
                .setDescription('Base colour of car run /acchelp for all combos')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('dazzle1')
                .setDescription('Hexadecimal value for the colour of the dazzle')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('dazzle2')
                .setDescription('Hexadecimal value for the colour of the dazzle')
                .setRequired(true)),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();

        try {
            const acc_cars = await gf.getFolders('./commands/livery/iracing'); // Await the Promise
            console.log("Available iRacing cars:", acc_cars);
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
        const base_colour = interaction.options.getString('basecolour');
        let dazzle1 = interaction.options.getString('dazzle1');
        let dazzle2 = interaction.options.getString('dazzle2');

        // Set up PythonShell options
        const options = {
            mode: 'text',
            //pythonPath: 'py',
            pythonOptions: ['-u'], // Unbuffered stdout
            args: [car,base_colour,dazzle1,dazzle2], // Pass car and finish as arguments to the Python script
        };

        const pyshell = new PythonShell('./commands/livery/iracing_script.py', options);
        let output = '';
        pyshell.stdout.on('data', async data => {
            console.log(data)

            // Log the results from the Python script
            console.log('Python script output:', data);
            const data_split = ((((data.replace("(","").replace(")","")).replaceAll("'","")).replaceAll(" ","")).replace(/\\/g, "/")).split(",")
            const specPath = data_split[0].replace(/\\/g, "/")
            const filePath = data_split[1].replace(/\\/g, "/")
            console.log(filePath,specPath)
            // Check if the file exists
            if (!fs.existsSync(filePath)) {
                return await interaction.editReply('The livery file could not be found.');
            }

            // Send the file as an attachment
            await interaction.editReply({
                content: 'Livery generated successfully!',
                files: [specPath,filePath], // Attach the file
            });

            fs.unlink(filePath, function (err) {
                if (err) {
                    console.log("Failed to delete file")
                }
            });
        });

        pyshell.end(async err => {
            if (err) {
                console.error('Error running Python script:', err);
                return await interaction.editReply('An error occurred while generating the livery.');
            }
        });
    },
};

function is6DigitHex(str) {
    // Regular expression to match a 6-digit hexadecimal string
    const hexRegex = /^[0-9A-Fa-f]{6}$/;
    return hexRegex.test(str);
}