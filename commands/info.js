const { SlashCommandBuilder } = require('discord.js');
const server = require('./server');
const user = require('./user');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('info')
	.setDescription('Get info about a user or a server!')
	.addSubcommand(subcommand =>
		subcommand
			.setName('user')
			.setDescription('Info about a user')
			.addUserOption(option => option.setName('target').setDescription('The user')))
	.addSubcommand(subcommand =>
		subcommand
			.setName('server')
			.setDescription('Info about the server')),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'user') {
            await user.execute(interaction);
        }
        else if (interaction.options.getSubcommand() === 'server') {
            await server.execute(interaction);
        }
    },
};