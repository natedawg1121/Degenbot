const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('degenerateHelp')
		.setDescription('Help command for DegenBot.')
        .addStringOption(commandHelp =>
            tags.setName('command_help')
                .setDescription('Searches for commands you need help with')),
	async execute(interaction) {
        if (commandHelp.length === 0) {
            interaction.reply("You have .plot (any random hentai), .splot (safe hentai?), .qplot (questionable hentai), .eplot (explicit hentai), .numbers [123456] (hentai comic search)!");
        } else {
            interaction.reply("It looks like you need help with " + commandHelp + ", I feel you homie.");
        }
	},
};
