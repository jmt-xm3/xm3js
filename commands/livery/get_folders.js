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
        const items = await fs.readdir(directory, { withFileTypes: true }); // Await the async operation
        return items.filter(item => item.isFile()).map(item => item.name);
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}

module.exports = { getFolders,getFiles };
