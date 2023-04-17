const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('numbers')
		.setDescription('Looks through doujin sites to find the name of numbered plots. (Janky but usually works)'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
