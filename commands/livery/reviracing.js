const { SlashCommandBuilder } = require('discord.js');
const { PythonShell } = require('python-shell');
const gf = require('./get_folders.js');
const fs = require('fs');
const {sanitizeHexColor} = require("./get_folders"); // For handling file operations

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reviracing')
        .setDescription('Generates a REVSPORT International iRacing livery')
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
            const iracing_cars = await gf.getFolders('./commands/livery/iracing'); // Await the Promise

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
        // Defer the reply to give the bot more time to process the Python script
        await interaction.deferReply();

        // Get the options from the interaction
        const uid = interaction.user.id
        const car = interaction.options.getString('car');
        let dazzle1 , dazzle2 , base_colour

        const validCars = await gf.getFolders('./commands/livery/iracing');

        if (!validCars.includes(car)) {
            return interaction.editReply('Invalid car selection. Please choose from the available options.');
        }

        try{
            dazzle1 = sanitizeHexColor(interaction.options.getString('dazzle1'));
            dazzle2 = sanitizeHexColor(interaction.options.getString('dazzle2'));
            base_colour = sanitizeHexColor(interaction.options.getString('basecolour'));
        }catch(err){
            console.error(err);
            return await interaction.editReply("Please enter six digit hexadecimal values, eg #FFAABB or #112233")
        }

        // Set up PythonShell options
        const options = {
            mode: 'text',
            //pythonPath: 'py',
            pythonOptions: ['-u'], // Unbuffered stdout
            args: [car,base_colour,dazzle1,dazzle2], // Pass car and finish as arguments to the Python script
        };

        const pyshell = new PythonShell('./commands/livery/iracing_script.py', options);
        console.log(uid, "requested",car)
        pyshell.stdout.on('data', async data => {
            // Log the results from the Python script
            console.log('Python script output:', data);
            const outputPath = data.toString().trim(); // Remove any whitespace/newlines
            const normalizedPath = outputPath.replace(/\\/g, '/'); // Convert to forward slashes

            // Extract just the filename
            const fileName = normalizedPath.substring(normalizedPath.lastIndexOf('/') + 1);
            const filePath = `./commands/livery/temp/${fileName}`;
            const basePath = `./commands/livery/temp/base${fileName}`;
            const specPath = test = "./commands/livery/iracing/" + car + "/spec.mip"
            // Check if the file exists
            if (!fs.existsSync(filePath)) {
                console.log('Livery file could not be found at',filePath)
                return await interaction.editReply('The livery file could not be found.');
            }
            // Check if the file exists
            if (!fs.existsSync(specPath)){
                console.log('No spec map')
                await interaction.editReply({
                    content: 'Livery generated successfully!',
                    files: [filePath], // Attach the file
                });
            }
            else{
            console.log('File found at:',filePath)
            await interaction.editReply({
                content: 'Livery generated successfully!',
                files: [specPath,filePath], // Attach the file
            })}

            fs.unlink(filePath, function (err) {
                if (err) {
                    console.log("Failed to delete file")
                }
            })
            fs.unlink(basePath, function (err) {
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
