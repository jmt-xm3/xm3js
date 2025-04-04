const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('path');
const { pipeline } = require('stream');
const { promisify } = require('util');

const streamPipeline = promisify(pipeline);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addiracing')
        .setDescription('Add iRacing Livery')
        .addStringOption(name =>
            name.setName('name').setDescription("Car's name").setRequired(true)
        )
        .addAttachmentOption(sponsor =>
            sponsor.setName('sponsors').setDescription('Sponsor file').setRequired(true)
        )
        .addAttachmentOption(dazzle =>
            dazzle.setName('dazzle').setDescription('Dazzle file').setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply(); // Defer reply before starting async tasks

        const carName = interaction.options.getString('name');
        const sponsorFile = interaction.options.getAttachment('sponsors');
        const dazzleFile = interaction.options.getAttachment('dazzle');
        const dirPath = path.join(process.cwd(), 'commands', 'livery', 'iracing', carName);

        try {
            // Ensure the directory exists
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            console.log(`Downloading sponsor file: ${sponsorFile.proxyURL}`);
            console.log(`Downloading dazzle file: ${dazzleFile.proxyURL}`);

            // Download and save the sponsor file
            await downloadFile(sponsorFile.proxyURL, path.join(dirPath, 'sponsors.png'));

            // Download and save the dazzle file
            await downloadFile(dazzleFile.proxyURL, path.join(dirPath, 'dazzle.png'));

            console.log(`Added a new car: ${carName}`);

            // Use editReply since we deferred the reply
            await interaction.editReply(`iRacing Livery added for ${carName}!`);
        } catch (error) {
            console.error('Error saving files:', error);
            await interaction.editReply('Failed to save iRacing Livery files.');
        }
    }
};

// Function to download and save a file using fetch
async function downloadFile(url, filePath) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    return streamPipeline(response.body, fs.createWriteStream(filePath));
}
