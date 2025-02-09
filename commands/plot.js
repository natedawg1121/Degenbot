const { SlashCommandBuilder } = require('discord.js');
const { DANBOORU_USERNAME, DANBOORU_KEY, BLACKLIST } = require("../config.json");
const Danbooru = require("danbooru");
const booru = new Danbooru(DANBOORU_USERNAME + ":" + DANBOORU_KEY);

function plotCollect(list, interaction) {
    console.log("collecting plot");
    for (let i = 0; i < list.length; i++){
        list = list.concat(arguments[i] + " ");
    }

    console.log(list);
    booru.posts({ tags: list }).then(posts => {
        const index = Math.floor(Math.random() * posts.length);
        const post = posts[index];

        try {
            const url = booru.url(post.file_url);
            const name = `${post.md5}.${post.file_ext}`;

            interaction.reply("Here's your plot: \n" + url);
        } catch {
            interaction.reply("I'm sorry, I cannot find what you are looking for.");
        }
    })
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('plot')
		.setDescription('Provides a random plot from Danbooru.')
        .addStringOption(tags =>
            tags.setName('tags')),
	async execute(interaction) {
        let tagList = "order:random " + interaction.tags + BLACKLIST;
        plotCollect(tagList, interaction);
    },
};
