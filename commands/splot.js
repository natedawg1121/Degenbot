const { SlashCommandBuilder } = require('discord.js');
const { DANBOORU_USERNAME, DANBOORU_KEY, BLACKLIST } = require("../config.json");
const Danbooru = require("danbooru");
const {plotCollect} = require("./plot");
const booru = new Danbooru(DANBOORU_USERNAME + ":" + DANBOORU_KEY);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('splot')
		.setDescription('Provides a random safe plot from Danbooru.')
        .addStringOption(tags =>
            tags.setName('tags')),
	async execute(interaction) {
        let tagList = "rating:safe order:random " + interaction.tags + BLACKLIST;
		plotCollect(tagList, interaction);
    },
};
