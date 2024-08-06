const { SlashCommandBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register to start using Kloudcoins"),
  async execute(interaction) {
    const { id, username } = interaction.user;
    const serverID = interaction.guild.id;

    try {
      const existingProfile = await profileModel.findOne({ userID: id });

      if (existingProfile) {
        await interaction.reply("You are already registered!");
        return;
      }

      const profile = new profileModel({
        userID: id,
        serverID: serverID,
        kloudCoins: 1, // Starting balance for every monke
        dailyLastUsed: 0,
      });

      await profile.save();
      await interaction.reply("You have been registered successfully!");
    } catch (err) {
      console.error("Error registering user:", err);
      await interaction.reply("There was an error during registration.");
    }
  },
};
