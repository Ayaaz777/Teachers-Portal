require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { Client, GatewayIntentBits, Partials } = require('discord.js');

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const REGISTER = String(process.env.DISCORD_REGISTER_COMMANDS || '1') === '1';

if (!TOKEN) {
	console.error('DISCORD_BOT_TOKEN not set in .env');
	// do not throw here so callers can decide how to handle
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
	],
	partials: [Partials.Channel],
});

async function registerCommandsIfNeeded() {
	try {
		if (!REGISTER) {
			console.log('Skipping command registration (DISCORD_REGISTER_COMMANDS != 1)');
			return;
		}
        const commands = [
            { name: 'ping', description: 'Ping the bot' },
            {
                name: 'ask',
                description: 'Ask the AI a question',
                options: [
                    { name: 'prompt', type: 3, description: 'Your question', required: true },
                ],
            },
        ];
		if (GUILD_ID) {
			console.log('Registering commands to guild', GUILD_ID);
			const guild = await client.guilds.fetch(GUILD_ID);
			await guild.commands.set(commands);
			console.log('Commands registered (guild)');
		} else {
			console.log('No GUILD_ID set — skipping guild command registration. To register globally set DISCORD_REGISTER_COMMANDS=1 and provide DISCORD_GUILD_ID.');
		}
	} catch (err) {
		console.error('Failed to register commands', err);
	}
}

function loadEventHandlers() {
	const eventsDir = path.join(__dirname, 'events');
	try {
		if (fs.existsSync(eventsDir)) {
			for (const f of fs.readdirSync(eventsDir)) {
				if (!f.endsWith('.js')) continue;
				require(path.join(eventsDir, f))(client);
			}
			console.log('Loaded event handlers from', eventsDir);
		} else {
			console.log('No events directory found at', eventsDir);
		}
	} catch (err) {
		console.error('Error loading event handlers', err);
	}
}

async function start() {
	if (!TOKEN) {
		throw new Error('DISCORD_BOT_TOKEN must be set in .env before starting the bot');
	}
	loadEventHandlers();
	client.once('ready', async () => {
		console.log('Discord bot ready as', client.user?.tag);
		await registerCommandsIfNeeded();
	});
	await client.login(TOKEN);
	console.log('Discord client login initiated');
}

async function stop() {
	try {
		await client.destroy();
		console.log('Discord client destroyed');
	} catch (err) {
		console.error('Error destroying client', err);
	}
}

module.exports = { start, stop, client };
