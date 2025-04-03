const fs = require('fs').promises;
const path = require('path');

async function getFolders(directory) {
    try {
        const items = await fs.readdir(directory, { withFileTypes: true }); // Await the async operation
        return items.filter(item => item.isDirectory()).map(item => item.name);
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}

async function getFiles(directory) {
    try {
        const items = await fs.readdir(directory, { withFileTypes: false }); // Await the async operation
        return  items.map(item => item.replaceAll(".png",""))
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}

function sanitizeHexColor(input) {
    let hex = input.startsWith('#') ? input.slice(1) : input;
    hex = hex.toLowerCase();
    if (!/^[0-9a-f]+$/.test(hex)) {
        throw new Error('Invalid hexadecimal characters - only 0-9 and a-f allowed');
    }
    if (hex.length !== 6) {
        throw new Error('Hex color must be exactly 6 characters long (e.g., ff00aa)');
    }

    return hex;
}

module.exports = { getFolders,getFiles, sanitizeHexColor };
