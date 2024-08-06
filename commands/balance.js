const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Shows a user their balance"),
  async execute(interaction, profileData) {
    // Ensure you are using the correct field name
    const { kloudCoins } = profileData;
    const username = interaction.user.username;

    // Check if profileData and kloudCoins are valid
    if (profileData && kloudCoins !== undefined) {
      await interaction.reply(`${username} has ${kloudCoins} coins.`);
    } else {
      await interaction.reply("There was an error fetching your balance. Please try again later.");
    }
  },
};

