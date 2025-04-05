const { SlashCommandBuilder } = require('discord.js');
const { PythonShell } = require('python-shell');
const gf = require('./get_folders.js');
const fs = require('fs'); // For handling file operations
const path = require('path');
const {sanitizeHexColor} = require("./get_folders");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('revacc')
        .setDescription('Generates a REVSPORT International Assetto Corsa Competizione livery')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of livery')
                .setRequired(true))
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
                .setRequired(true))
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
                ))
        .addStringOption(option =>
            option.setName('decalfinish')
                .setDescription('Finish of the decal layer')
                .setRequired(true)
                .addChoices(
                    { name: 'Glossy', value: '0' },
                    { name: 'Matte', value: '1' },
                    { name: 'Satin', value: '2' },
                    { name: 'Satin Metallic', value: '3' },
                    { name: 'Metallic', value: '4' },
                    { name: 'Chrome', value: '5' },
                    { name: 'Clear Chrome', value: '6' },
                ))
        .addStringOption(option =>
            option.setName('sponsorfinish')
                .setDescription('Finish of the sponsor layer')
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
        const uid = interaction.user.id
        const car = interaction.options.getString('car');
        const finish = interaction.options.getString('finish');
        const decal_finish = interaction.options.getString('decalfinish');
        const sponsor_finish = interaction.options.getString('sponsorfinish');
        const base_colour = interaction.options.getString('basecolour');
        const validCars = await gf.getFolders('./commands/livery/acc');

        if (!validCars.includes(car)) {
            return interaction.editReply('Invalid car selection. Please choose from the available options.');
        }

        if (valid_acc_colour(base_colour)){}
        else{
            return interaction.editReply("ACC colours are between 1-359 and 500-546")
        }
        const name = interaction.options.getString('name');
        let dazzle1 , dazzle2

        try{
            dazzle1 = sanitizeHexColor(interaction.options.getString('dazzle1'));
            dazzle2 = sanitizeHexColor(interaction.options.getString('dazzle2'));
        }catch(err){
            console.error(err);
            return await interaction.editReply("Please enter six digit hexadecimal values, eg #FFAABB or #112233")
        }
        console.log(uid, "requested",car)
        // Set up PythonShell options
        const options = {
            mode: 'text',
            //pythonPath: 'py',
            pythonOptions: ['-u'], // Unbuffered stdout
            args: [car, finish,decal_finish,sponsor_finish,base_colour,dazzle1,dazzle2,name], // Pass car and finish as arguments to the Python script
        };

        const pyshell = new PythonShell('./commands/livery/acc_script.py', options);
        pyshell.stdout.on('data', async data => {
            // Clean and normalize the path
            const outputPath = data.toString().trim();
            const normalizedPath = outputPath.replace(/\\/g, '/');

            // Get the zip filename and path
            const zipFileName = normalizedPath.substring(normalizedPath.lastIndexOf('/') + 1);
            const zipFilePath = path.join('./commands/livery/temp', zipFileName);

            // Get the corresponding folder name (without .zip extension)
            const folderName = zipFileName.replace('.zip', '');
            const folderPath = path.join('./commands/livery/temp', folderName);

            console.log('Zip file path:', zipFilePath);
            console.log('Folder to delete:', folderPath);

            if (!fs.existsSync(zipFilePath)) {
                console.log('Livery zip file could not be found at', zipFilePath);
                return await interaction.editReply('The livery file could not be found.');
            }

            // Send the zip file first
            await interaction.editReply({
                content: 'Livery generated successfully!',
                files: [zipFilePath],
            });

            // Clean up both the zip and the folder
            try {
                // Delete the zip file
                await fs.promises.unlink(zipFilePath);
                console.log('Deleted zip file:', zipFilePath);

                // Delete the folder if it exists
                if (fs.existsSync(folderPath)) {
                    await fs.promises.rm(folderPath, { recursive: true, force: true });
                    console.log('Deleted folder:', folderPath);
                }
            } catch (err) {
                console.error('Cleanup error:', err);
                // Don't fail the command if cleanup fails
            }
        });
    },
};

function valid_acc_colour(colour) {
    let x
    try{
        x = parseInt(colour)
        return (x > 0 && x < 360) || x > 499 && x < 547;
    }
    catch(error) {
        return false;
    }
}