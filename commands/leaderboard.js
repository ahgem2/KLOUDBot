const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require('@discordjs/builders');
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows Top 5 Coin Earners"),
    async execute(interaction, profileData) {
        await interaction.deferReply();

        const { username, id } = interaction.user;
        const { kloudCoins: userBalance } = profileData;

        let leaderboardEmbed = new EmbedBuilder()
            .setTitle("**Top 5 Coin Earners**")
            .setColor(0x45d6fd)
            .setFooter({ text: "You aren't ranked yet" });

        try {
            // Fetch top 5 members sorted by balance
            const topFive = await profileModel.find()
                .sort({ kloudCoins: -1 })
                .limit(5);

            // Create a list of usernames and balances
            let desc = "";
            for (let i = 0; i < topFive.length; i++) {
                const memberProfile = topFive[i];
                const user = await interaction.guild.members.fetch(memberProfile.userID).catch(() => null);
                const username = user ? user.user.username : "Unknown User";
                desc += `**${i + 1}. ${username}:** ${memberProfile.kloudCoins} coins\n`;
            }

            // Check if the user is in the top 5 and include their rank
            const userRank = topFive.findIndex(member => member.userID === id);
            if (userRank !== -1) {
                leaderboardEmbed.setFooter({ text: `${username}, you're ranked #${userRank + 1} with ${userBalance} coins.` });
            }

            // Set the description of the embed
            leaderboardEmbed.setDescription(desc || "No data available.");

            await interaction.editReply({ embeds: [leaderboardEmbed] });
        } catch (err) {
            console.error("Error fetching leaderboard data:", err);
            await interaction.editReply("There was an error fetching the leaderboard.");
        }
    },
};