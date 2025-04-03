const { SlashCommandBuilder } = require('discord.js');
const { PythonShell } = require('python-shell');
const gf = require('./get_folders.js');
const fs = require('fs');
const {sanitizeHexColor} = require("./get_folders"); // For handling file operations

module.exports = {
    data: new SlashCommandBuilder()
        .setName('revhelmet')
        .setDescription('Generates a REVSPORT International branded helmet for iRacing')
        .addStringOption(option =>
            option.setName('design')
                .setDescription('Design to search for')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('colour1')
                .setDescription('Hexadecimal value')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('colour2')
                .setDescription('Hexadecimal value')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('colour3')
                .setDescription('Hexadecimal value')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('visorcolour')
                .setDescription('Hexadecimal value')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sponsor')
                .setDescription('Sunstrip for helmet')
                .setRequired(true)
                .addChoices({ name: 'None', value: 'None' },{ name: 'DMZ Oils', value: 'dmz.png' },
                    { name: 'GILF Oils', value: 'gilf.png' },
                    { name: 'Mongkok', value: 'mongkok.png' },
                    { name: 'Revsport Icon', value: 'revsport.png' },
                    { name: 'REV Heavy Industries', value: 'rhi.png' },
                    { name: 'revsport.racing/shop', value: 'shop.png' },
                    { name: 'Smang Racing', value: 'smang.png' },
                    { name: 'SOMAD', value: 'somad.png' },
                    { name: 'Throbbing Energy', value: 'throb.png' }
                ))
        .addStringOption(option =>
            option.setName('visorstrip')
                .setDescription('Sunstrip for helmet')
                .setRequired(true)
                .addChoices({ name: 'Dark Background / White text', value: 'darkwhitetext.png' },
                    { name: 'Dazzle Classic', value: 'dazzleclassic.png' },
                    { name: 'Dazzle dark', value: 'dazzledark.png' },
                    { name: 'Dazzle light', value: 'dazzlelight.png' },
                    { name: 'Hexagon pattern', value: 'hexpattern.png' },
                    { name: 'Learn chinese', value: 'learnchinese.png' },
                    { name: 'White Background / Black text', value: 'whiteblacktext.png' },
                    { name: 'Visit Pen Island', value: 'penisland.png' },
                    { name: 'Throbbing Energy', value: 'throb.png' },
                    { name: 'Revvving my wife tonite', value: 'wife.png' }
                )),



    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        try {
            const helmet_designs = await gf.getFiles('./commands/livery/helmet/designs'); // Await the Promise

            if (!helmet_designs || helmet_designs.length === 0) {
                return await interaction.respond([]); // Return an empty array if no folders are found
            }

            const choices = helmet_designs.sort();
            const filtered = choices
                .filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()))
                .slice(0, 25);

            await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
        } catch (error) {
            console.error("Error fetching helmet designs:", error);
            await interaction.respond([]); // Return empty if an error occurs
        }
    },

    async execute(interaction) {
        // Defer the reply to give the bot more time to process the Python script
        await interaction.deferReply();

        // Get the options from the interaction
        const uid = interaction.user.id;
        const design = interaction.options.getString('design');

        // Declare variables outside try block
        let colour1, colour2, colourv, colour3, visor_strip, sponsor;

        try {
            colour1 = sanitizeHexColor(interaction.options.getString('colour1'));
            colour2 = sanitizeHexColor(interaction.options.getString('colour2'));
            colourv = sanitizeHexColor(interaction.options.getString('visorcolour'));
            colour3 = sanitizeHexColor(interaction.options.getString('colour3'));
        } catch(error) {
            return await interaction.editReply("Please enter six digit hexadecimal values, eg #FFAABB or #112233");
        }
        visor_strip = interaction.options.getString('visorstrip');
        sponsor = interaction.options.getString('sponsor');

        // Set up PythonShell options
        const options = {
            mode: 'text',
            //pythonPath: 'py',
            pythonOptions: ['-u'], // Unbuffered stdout
            args: [design,colour1,colour2,colour3,colourv,visor_strip,uid,"0",sponsor], // Pass car and finish as arguments to the Python script
        };

        const pyshell = new PythonShell('./commands/livery/helmet_script.py', options);
        let output = '';
        console.log(uid, "requested",design)
        pyshell.stdout.on('data', async data => {
            // Log the results from the Python script
            console.log('Python script output:', data);
            const fullFilePath = data.replace(/\\/g, "/");
            const filePath = test = "./commands/livery/temp/" + fullFilePath.substring(fullFilePath.lastIndexOf("/"), fullFilePath.length - 2);
            // Check if the file exists
            if (!fs.existsSync(filePath)) {
                console.log('Livery file could not be found at',filePath)
                return await interaction.editReply('The livery file could not be found.');
            }
            // Check if the file exists
            else{
            console.log('File found at:',filePath)
            await interaction.editReply({
                content: 'Helmet generated successfully!',
                files: [filePath], // Attach the file
            })}

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


