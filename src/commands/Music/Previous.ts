import { Manager } from "../../manager.js";
import { EmbedBuilder, Message } from "discord.js";
import { Accessableby, Command } from "../../structures/Command.js";
import { CommandHandler } from "../../structures/CommandHandler.js";
import { KazagumoPlayer } from "kazagumo.mod";

// Main code
export default class implements Command {
  public name = ["previous"];
  public description = "Play the previous song in the queue.";
  public category = "Music";
  public accessableby = Accessableby.Member;
  public usage = "";
  public aliases = ["pre"];
  public lavalink = true;
  public playerCheck = true;
  public usingInteraction = true;
  public sameVoiceCheck = true;
  public options = [];

  public async execute(client: Manager, handler: CommandHandler) {
    await handler.deferReply();

    const player = client.manager.players.get(
      handler.guild!.id
    ) as KazagumoPlayer;
    const previousIndex = player.queue.previous.length - 1;
    const previousTrack = player.queue.previous[previousIndex];

    if (
      player.queue.previous.length == 0 ||
      player.queue.previous[0].uri == player.queue.current?.uri ||
      previousIndex < -1
    )
      return handler.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(
                handler.language,
                "music",
                "previous_notfound"
              )}`
            )
            .setColor(client.color),
        ],
      });

    player.queue.unshift(previousTrack);
    player.skip();
    player.queue.previous.slice(previousIndex, 1);

    console.log();

    const embed = new EmbedBuilder()
      .setDescription(
        `${client.i18n.get(handler.language, "music", "previous_msg")}`
      )
      .setColor(client.color);

    handler.editReply({ content: " ", embeds: [embed] });
  }
}