const { SlashCommandBuilder } = require('discord.js');
const { DANBOORU_USERNAME, DANBOORU_KEY, BLACKLIST } = require("../config.json");
const Danbooru = require("danbooru");
const booru = new Danbooru(DANBOORU_USERNAME + ":" + DANBOORU_KEY);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eplot')
		.setDescription('Provides a random explicit plot from Danbooru.')
        .addStringOption(tags =>
            tags.setName('tags')),
	async execute(interaction) {
        let tagList = "rating:explicit order:random " + tags + BLACKLIST;
		console.log("running Eplot command");

        console.log(tagList);
        booru.posts({ tags: tagList }).then(posts => {
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
    },
};
