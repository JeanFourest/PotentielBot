export const pingCommand = () => {
  return client.application.commands.create(
    new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Ask a question to the bot")
  );
};

export const pingContent = async (interaction) => {
  await interaction.reply("Pong! The bot is alive!");
};
