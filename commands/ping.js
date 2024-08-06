const { SlashCommandBuilder } = require("discord.js");
//ping command which 
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("replies with pong"),
  async execute(interaction) {
    console.log(interaction);
    await interaction.reply("pong");
  },
};
