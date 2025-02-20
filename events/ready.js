const { Events, ActivityType, PresenceUpdateStatus } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        client.user.setPresence({ activities: [{ name: 'Mongolian F4', type: ActivityType.Competing }], status: PresenceUpdateStatus.DoNotDisturb });
		console.log(`Ready! Logged in as ${client.user.tag}`);

        //Clear commands
        //const guild = client.guilds.cache.get("280423419722465281");

		// This updates immediately
		//guild.commands.set([]);
        //client.application.commands.set([]);
	},
};