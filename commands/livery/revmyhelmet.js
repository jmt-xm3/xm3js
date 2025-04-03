// Core Node.js modules
const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream');
const { promisify } = require('util');

// Third-party libraries
const { SlashCommandBuilder } = require('discord.js');
const { PythonShell } = require('python-shell');
const { fileTypeFromFile } = require('file-type'); // Updated import

// Modern fetch implementation
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Configuration
const IMAGE_SIZE_LIMITS = {
    minBytes: 1024,       // 1KB minimum
    maxBytes: 10 * 1024 * 1024,  // 10MB maximum
};

async function downloadImageWithSizeCheck(url, outputDir) {
    // Ensure output directory exists
    await fs.promises.mkdir(outputDir, { recursive: true });

    // Create temp file path
    const tempPath = path.join(outputDir, `temp_image_${Date.now()}`);
    let response, writeStream;
    let bytesDownloaded = 0;

    try {
        // Start fetch request
        response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Check Content-Length header
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
            const expectedSize = parseInt(contentLength);
            if (expectedSize > IMAGE_SIZE_LIMITS.maxBytes) {
                throw new Error(`Image too large (${(expectedSize / 1024 / 1024).toFixed(1)}MB)`);
            }
        }

        // Create write stream
        writeStream = fs.createWriteStream(tempPath);
        let destroyCalled = false;

        // Manual stream piping with size checking
        for await (const chunk of response.body) {
            bytesDownloaded += chunk.length;
            if (bytesDownloaded > IMAGE_SIZE_LIMITS.maxBytes) {
                destroyCalled = true;
                writeStream.destroy();
                throw new Error('Image exceeded size limit during download');
            }
            if (!writeStream.write(chunk)) {
                // Handle backpressure
                await new Promise(resolve => writeStream.once('drain', resolve));
            }
        }
        writeStream.end();

        // Verify final size
        const stats = await fs.promises.stat(tempPath);
        if (stats.size < IMAGE_SIZE_LIMITS.minBytes) {
            throw new Error('Image too small, likely corrupted');
        }

        // Verify image type - USING THE NEW fileTypeFromFile API
        const type = await fileTypeFromFile(tempPath);
        if (!type?.mime.startsWith('image/')) {
            throw new Error('Downloaded file is not a valid image');
        }

        // Create final filename
        const finalPath = path.join(outputDir, `image_${Date.now()}.${type.ext}`);
        await fs.promises.rename(tempPath, finalPath);

        return {
            path: finalPath,
            format: type.ext,
            size: stats.size,
            mimeType: type.mime
        };

    } catch (error) {
        // Cleanup resources
        if (writeStream && !writeStream.destroyed && !destroyCalled) {
            writeStream.destroy();
        }
        if (fs.existsSync(tempPath)) {
            await fs.promises.unlink(tempPath).catch(() => {});
        }
        if (response?.body) {
            // Properly consume the remaining body
            response.body.resume();
        }

        throw error;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('revmyhelmet')
    .setDescription('Rev Up Your own helmet or texture!')
    .addAttachmentOption(sponsor =>
        sponsor.setName('design').setDescription('Image file').setRequired(true)
    )
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
            .addChoices({ name: 'Dark white text', value: 'darkwhitetext.png' },
                { name: 'Dazzle Classic', value: 'dazzleclassic.png' },
                { name: 'Dazzle dark', value: 'dazzledark.png' },
                { name: 'Dazzle light', value: 'dazzlelight.png' },
                { name: 'Hexagon pattern', value: 'hexpattern.png' },
                { name: 'Learn chinese', value: 'learnchinese.png' },
                { name: 'White black text', value: 'whiteblacktext.png' },
                { name: 'Visit Penn Island', value: 'penisland.png' },
                { name: 'Throbbing energy', value: 'throb.png' },
                { name: 'Revvving my wife tonite', value: 'wife.png' }
            )),


    async execute(interaction) {
        await interaction.deferReply();
        const design = interaction.options.getAttachment('design');

        // Validate attachment
        if (!design.contentType?.startsWith('image/')) {
            return interaction.editReply('Please upload a valid image file.');
        }

        let finalPath;
        try {
            console.log(`Downloading sponsor file: ${design.proxyURL}`);
            const download_result = await downloadImageWithSizeCheck(
                design.proxyURL,
                path.join(__dirname, 'temp')
            );
            finalPath = download_result.path;
        } catch (error) {
            console.error('Error saving files:', error);
            return interaction.editReply('Error downloading the image file: ' + error.message);
        }

        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            args: [
                finalPath,
                0, // colour1
                0, // colour2
                0, // colour3
                interaction.options.getString('visorcolour'),
                interaction.options.getString('visorstrip'),
                interaction.user.id,
                "1",
                interaction.options.getString('sponsor')
            ],
        };

        return new Promise((resolve) => {
            const pyshell = new PythonShell('./commands/livery/helmet_script.py', options);
            let output = '';

            pyshell.stdout.on('data', (data) => {
                output += data;
            });

            pyshell.end(async (err) => {
                if (err) {
                    console.error('Python error:', err);
                    await interaction.editReply('Error generating helmet.');
                    return resolve();
                }

                try {
                    const fullFilePath = output.trim();
                    const filePath = path.join('./commands/livery/temp', path.basename(fullFilePath));

                    if (!fs.existsSync(filePath)) {
                        console.error('File not found:', filePath);
                        return interaction.editReply('Helmet generation failed - output file missing.');
                    }

                    await interaction.editReply({
                        content: 'Helmet generated successfully!',
                        files: [filePath],
                    });

                    // Clean up files
                    [finalPath, filePath].forEach(file => {
                        if (fs.existsSync(file)) {
                            fs.unlink(file, err => err && console.error('Cleanup error:', err));
                        }
                    });
                } catch (error) {
                    console.error('Output handling error:', error);
                    await interaction.editReply('Error processing helmet output.');
                }
                resolve();
            });
        });
    },
};

