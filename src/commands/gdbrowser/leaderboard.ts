import { Command, CommandClient } from "detritus-client";
import { Markup } from "detritus-client/lib/utils";
import { Brand } from "../../enums/brands";
import { createBrandEmbed } from "../../functions/embed";
import { GDBrowser } from "../../functions/gdbrowser";
import { padCodeBlockFromRows } from "../../functions/tools";
import { BaseCommand } from "../basecommand";
export interface GDLeaderboardArgs {
  count: number;
  type: "creator" | "accuracy" | "none";
}
export default class GDLeaderboardCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: "gleaderboard",
      label: "count",
      type: "number",
      default: 100,

      args: [
        {
          name: "type",
          type: "string",
          choices: ["creator", "accuracy", "none"],
          default: "none",
        },
      ],
    });
  }
  async run(context: Command.Context, args: GDLeaderboardArgs) {
    let type = "Player";
    const options = { creator: false, accuracy: false };
    if (args.type === "creator") {
      options.creator = true;
      type = "Creator";
    } else if (args.type === "accuracy") {
      options.accuracy = true;
      type = "Accurate Player";
    }
    const gd = new GDBrowser();
    let leaderboard = await gd.leaderboard(args.count, options);
    if (leaderboard === -1) {
      return context.editOrReply("No leaderboard found");
    }
    leaderboard = leaderboard.slice(0, args.count);
    const embed = createBrandEmbed(Brand.GD_BROWSER, context);
    embed.setTitle(`${type} Leaderboard`);

    let rows = [["Rank", "Username", "Stars", "Demons", "Creator Points"]];
    for (let item of leaderboard) {
      rows.push([
        item.rank.toString(),
        item.username,
        item.stars.toLocaleString(),
        item.demons.toLocaleString(),
        item.cp.toLocaleString(),
      ]);
    }
    embed.setDescription(
      Markup.codeblock(padCodeBlockFromRows(rows).join("\n"))
    );

    embed.setThumbnail("https://gdbrowser.com/assets/leaderboard.png");
    return await context.editOrReply({ embed });
  }
}