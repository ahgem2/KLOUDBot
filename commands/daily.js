const { SlashCommandBuilder } = require("discord.js");
const parseMilliseconds = require("parse-ms-2");
const profileModel = require("../models/profileSchema");
const { dailyMin, dailyMax } = require("../globalValues.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Redeem Kloudcoins when you workout"),
  async execute(interaction) {
    const { id } = interaction.user;
    let profileData;

    try {
      profileData = await profileModel.findOne({ userID: id });

      if (!profileData) {
        // Handle the case where profileData is null
        await interaction.reply("No profile data found for you. Please register first.");
        return;
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
      await interaction.reply("There was an error fetching your profile data.");
      return;
    }

    const { dailyLastUsed } = profileData;
    const cooldown = 86400000; // 24 hours in milliseconds

    const timeleft = cooldown - (Date.now() - dailyLastUsed);

    if (timeleft > 0) {
      await interaction.deferReply({ ephemeral: true });
      const { hours, minutes, seconds } = parseMilliseconds(timeleft);
      await interaction.editReply(
        `Claim your next coin in ${hours} hrs ${minutes} min ${seconds} sec`
      );
      return;
    }

    await interaction.deferReply();

    const randomAmt = Math.floor(
      Math.random() * (dailyMax - dailyMin + 1) + dailyMin
    );

    try {
      await profileModel.findOneAndUpdate(
        { userID: id },
        {
          $set: { dailyLastUsed: Date.now() },
          $inc: { kloudCoins: randomAmt },
        },
        { new: true } // Return the updated document
      );
    } catch (err) {
      console.error("Error updating profile data:", err);
      await interaction.editReply("There was an error redeeming your daily coins.");
      return;
    }

    await interaction.editReply(`You redeemed ${randomAmt} coins!`);
  },
};

