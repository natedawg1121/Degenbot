const { DISCORD_KEY } = require("./config.json");
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const client = new Client({ intents: [GatewayIntentBits.Guilds]});

//Command Importing
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

//Command listening
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	//console.log(interaction);

    const command = client.commands.get(interaction.commandName);

    if (!command) {
		//console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(DISCORD_KEY);

client.on("ready", () => {
    console.log("Connected as " + client.user.tag);
    client.user.setActivity("Hentai Haven", {type:"WATCHING"});
})

async function helpCommand(arguments, receivedMessage) {
    if (arguments.length === 0) {
        receivedMessage.channel.send("You have .plot (any random hentai), .splot (safe hentai?), .qplot (questionable hentai), .eplot (explicit hentai), .numbers [123456] (hentai comic search)!");
    } else {
        receivedMessage.channel.send("It looks like you need help with " + arguments + " I feel you homie.");
    }
}

async function numbersCommand(arguments, receivedMessage) {
    console.log("running numbers command");
    if (arguments.length === 0) {
        receivedMessage.channel.send("I'm sorry, I cannot find the numbers you are looking for.");
        return;
    }

    let numText = "" + arguments[0];

    if (arguments[0].length > 6) {
        receivedMessage.channel.send("The numbers Mason, what do they mean?");
    } else {
        let urlList = ["https://9hentai.to/g/" + numText + "/",
                       "http://www.hbrowse.com/" + numText + "/c00001",
                       "https://www.tsumino.com/entry/" + numText,
                       "https://nhentai.net/g/" + numText + "/",
                       "https://asmhentai.com/g/" + numText + "/",
                       "https://imhentai.xxx/gallery/" + numText + "/",
                       "https://hentaifox.com/gallery/" + numText + "/"]

        let found = false;

        for (let url in urlList) {
            if (await checkURL(urlList[url]) === true) {
                found = true;
                receivedMessage.channel.send("I found the plot you were looking for at: " + urlList[url]);
                console.log("found " + urlList[url]);
                break;
            }
        }

        if (found == false)
            receivedMessage.channel.send("I'm sorry, I cannot find the numbers you are looking for.");
    }
}

async function checkURL(url) {
    let request = new XMLHttpRequest();

    request.timeout = 500;

    request.open("GET", url, false);
    request.send();

    if (request.status === 404) {
        console.log(url + " does not exist");
        return false;
    } else {
        console.log(url + " exists");
        return true;
    }
}
