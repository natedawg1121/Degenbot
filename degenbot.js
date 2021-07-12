var { DANBOORU_USERNAME } = require('./config.js');
var { DANBOORU_KEY } = require('./config.js');
var { DISCORD_KEY } = require('./config.js');
const Discord = require('discord.js');
const Danbooru = require('danbooru');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs').promises;
const path = require('path');
const client = new Discord.Client();
const booru = new Danbooru(DANBOORU_USERNAME + ':' + DANBOORU_KEY);
const prefix = ".";
const blacklist = " -guro -scat -loli -pee -peeing -shota -bestiality -rape "


client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
    setToWatching();
})

client.on('message', (receivedMessage) => {
    if (receivedMessage.author === client.user) {
        return;
    }
    if (receivedMessage.content.startsWith(prefix)) {
        processCommand(receivedMessage);
    }
})

async function setToWatching() {
    client.user.setActivity("Hentai Haven", {type:"WATCHING"});
}

async function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0];
    let arguments = splitCommand.slice(1);

    if (primaryCommand === "help") {
        helpCommand(arguments, receivedMessage);
    } else if (primaryCommand === "plot") {
        plotCommand(arguments, receivedMessage);
    } else if (primaryCommand === "splot") {
        splotCommand(arguments, receivedMessage);
    } else if (primaryCommand === "qplot") {
        qplotCommand(arguments, receivedMessage);
    } else if (primaryCommand === "eplot") {
        eplotCommand(arguments, receivedMessage);
    } else if (primaryCommand === "clear") {
        clearCommand(arguments, receivedMessage, 100);
    } else if (primaryCommand === "no") {
        clearCommand(arguments, receivedMessage, 3);
    } else if (primaryCommand === "numbers") {
        numbersCommand(arguments, receivedMessage);
    } else {
        receivedMessage.channel.send("I'm sorry, I do not understand this command, try using .help to learn more.");
    }

    setToWatching()
}

async function helpCommand(arguments, receivedMessage) {
    if (arguments.length === 0) {
        receivedMessage.channel.send("You have .plot (any random hentai), .splot (safe hentai?), .qplot (questionable hentai), .eplot (explicit hentai), .numbers [123456] (hentai comic search)!");
    } else {
        receivedMessage.channel.send("It looks like you need help with " + arguments);
    }
}

async function plotCommand(arguments, receivedMessage) {
    let tagList = "order:random" + blacklist;
    getPlot(arguments, receivedMessage, tagList);
}

async function splotCommand(arguments, receivedMessage) {
    let tagList = "rating:safe order:random" + blacklist;
    getPlot(arguments, receivedMessage, tagList);
}

async function qplotCommand(arguments, receivedMessage) {
    let tagList = "rating:questionable order:random" + blacklist;
    getPlot(arguments, receivedMessage, tagList);
}

async function eplotCommand(arguments, receivedMessage) {
    let tagList = "rating:explicit order:random" + blacklist;
    getPlot(arguments, receivedMessage, tagList);
}

async function getPlot (arguments, receivedMessage, tagList) {
    for (let i = 0; i < arguments.length; i++){
        tagList = tagList.concat(arguments[i] + " ");
    }

    console.log(tagList);
    booru.posts({ tags: tagList }).then(posts => {
        const index = Math.floor(Math.random() * posts.length);
        const post = posts[index];

        try {
            const url = booru.url(post.file_url);
            const name = `${post.md5}.${post.file_ext}`;

            receivedMessage.channel.send("Here's your plot: \n" + url);
        } catch {
            receivedMessage.channel.send("I'm sorry, I cannot find what you are looking for.");
        }
    })
}

async function numbersCommand(arguments, receivedMessage) {
    if (arguments.length === 0) {
        receivedMessage.channel.send("I'm sorry, I cannot find the numbers you are looking for.");
        return;
    }

    let numText = "" + arguments[0];

    if (arguments[0].length > 6) {
        receivedMessage.channel.send("The numbers Mason, what do they mean?");
    } else {
        let urlList = ["http://www.hbrowse.com/" + numText + "/c00001",
                       "https://www.tsumino.com/entry/" + numText,
                       "https://nhentai.net/g/" + numText + "/",
                       "https://asmhentai.com/g/" + numText + "/",
                       "https://imhentai.xxx/gallery/" + numText + "/",
                       "https://hentaifox.com/gallery/" + numText + "/"]

        let found = new Boolean(false);
        let url;

        for (url in urlList) {
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
    let request;

    request = new XMLHttpRequest();

    request.timeout = 3000;

    request.open('GET', url, false);
    request.send();

    if (request.status === 404) {
        console.log(url + " does not exist");
        return false;
    } else {
        console.log(url + " exists");
        return true;
    }
}

async function clearCommand(arguments, receivedMessage, number) {
    receivedMessage.channel.bulkDelete(number);
}

client.login(DISCORD_KEY);
