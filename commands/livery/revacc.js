const { SlashCommandBuilder } = require('discord.js');
const { PythonShell } = require('python-shell');
const gf = require('./get_folders.js');
const fs = require('fs'); // For handling file operations
const math = require('mathjs');
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
        const uid = interaction.user.id
        const car = interaction.options.getString('car');
        const finish = interaction.options.getString('finish');
        const decal_finish = interaction.options.getString('decalfinish');
        const sponsor_finish = interaction.options.getString('sponsorfinish');
        const base_colour = interaction.options.getString('basecolour');
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
        let output = '';
        pyshell.stdout.on('data', async data => {
            // Log the results from the Python script
            console.log('Python script output:', data);

            const fullFilePath = data.replace(/\\/g, "/");
            const filePath = test = "./commands/livery/temp" + fullFilePath.substring(fullFilePath.lastIndexOf("/"), fullFilePath.length - 2);
            const folderPath = filePath.substring(0, filePath.lastIndexOf("."));
            // Check if the file exists
            if (!fs.existsSync(filePath)) {
                console.log('Livery file could not be found')
                return await interaction.editReply('The livery file could not be found.');
            }

            // Send the file as an attachment
            console.log('File found at:',filePath)
            await interaction.editReply({
                content: 'Livery generated successfully!',
                files: [filePath], // Attach the file
            });

            fs.unlink(filePath, function (err) {
                if (err) {
                    console.log("Failed to delete file")
                }
            });

            fs.rmdir(folderPath, { recursive: true, force: true }, function (err) {
                if (err) {
                    console.log("Failed to delete folder")
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

function valid_acc_colour(colour) {
    let x
    try{
        x = parseint(colour)
        if((x > 0 && x < 360) || x > 499 && x < 547 ){
            return true;
        }
    }
    catch(error) {
        return false;
    }
}