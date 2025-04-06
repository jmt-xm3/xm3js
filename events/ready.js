const { Events, ActivityType, PresenceUpdateStatus } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

const races = ['iRacing F4','IMSA Fixed','ACC','NASCAR C Fixed','NASCAR B Fixed','Mongolian F4','Bolivian F7','Chinese F4','NASCAR A Fixed']
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        client.user.setPresence({ activities: [{ name: getRandomItem(races), type: ActivityType.Competing }], status: PresenceUpdateStatus.DoNotDisturb });
		console.log(`Ready! Logged in as ${client.user.tag}`);
		deleteAllFiles(path.normalize('./commands/livery/temp'))
			.catch(console.error);
		setInterval(() => {
			client.user.setPresence({ activities: [{ name: getRandomItem(races), type: ActivityType.Competing }], status: PresenceUpdateStatus.DoNotDisturb });
			deleteAllFiles(path.normalize('./commands/livery/temp'))
				.catch(console.error);
		}, 7200000); // 24 hours

        //Clear commands
        //const guild = client.guilds.cache.get("280423419722465281");

		// This updates immediately
		//guild.commands.set([]);
        //client.application.commands.set([]);
	},
};
async function deleteAllFiles(directory) {
	try {
		const files = await fs.readdir(directory);

		const deletePromises = files.map(async file => {
			const filePath = path.join(directory, file);
			const stats = await fs.stat(filePath);

			if (stats.isFile()) {
				await fs.unlink(filePath);
				console.log(`Deleted: ${filePath}`);
			}
		});

		await Promise.all(deletePromises);
		console.log('All files deleted successfully');
	} catch (err) {
		console.error('Error deleting files:', err);
	}
}

function getRandomItem(array) {
	if (!Array.isArray(array) || array.length === 0) {
		throw new Error('Input must be a non-empty array');
	}
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}