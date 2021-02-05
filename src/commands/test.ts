import { MessageEmbed, Role } from "discord.js";
import { formatTimestamp } from "../functions/formatTimestamp";
import { simpleGetLongAgo } from "../functions/getLongAgo";
import { getUserPermissions } from "../functions/getUserPermissions";
import { Color } from "../globals";
import { ICommand } from "../interfaces/ICommand";

module.exports = {
  name: "test",
  description: "AAAAAAA",
  restrictions: {
    guildOnly: true,
  },
  usage: "<role: Role>",
  usesArgs: false,
  async run(message, args) {
    if (!message.guild) return;
    var unresolvedID = args.join(" ").length
      ? args.join(" ")
      : message.member?.roles.highest.id;
    var role: Role | undefined | null = null;
    try {
      role = message.guild.roles.cache.find(
        (e) =>
          e.name.toLowerCase() == unresolvedID ||
          e.id == unresolvedID ||
          `${e}` == unresolvedID
      );
    } catch (error) {}
    if (!role) {
      return await message.channel.send("Unknown Role");
    }
    const col = role.color
      ? `https://singlecolorimage.com/get/${role.hexColor.replace(
          "#",
          ""
        )}/256x256`
      : undefined;
    const emb = new MessageEmbed();
    emb.setAuthor(`Role "${role.name}"`, col);
    emb.setColor(Color.embed);
    emb.addField(
      `❯ Role Info`,
      `:gear: **ID**: \`${role.id}\`
:link: **Role**: ${role}
:calendar_spiral: **Created**: ${simpleGetLongAgo(
        +role.createdAt
      )} ${formatTimestamp(role.createdAt)}`
    );
    const posTop = message.guild.roles.cache.filter(
      (e) => e.position == role!.position - 1
    );
    const posLow = message.guild.roles.cache.filter(
      (e) => e.position == role!.position + 1
    );

    emb.addField(
      "❯ Position",
      `**${posTop.size ? posTop.array()[0]?.position : ""} ${
        posTop.size ? posTop.array()[0] : "-- Top Of Role list"
      }**
**- ${role.position} ${role}**
**${posLow.size ? posLow.array()[0]?.position : ""} ${
        posLow.size ? posLow.array()[0] : "-- Bottom Of Role list"
      }**`
    );
    emb.addField("❯ Permissions", getUserPermissions(role));
    emb.addField(
      "❯ Members",
      role.members.size ? role.members.array().join(", ") : "None"
    );
    console.log(emb);
    await message.channel.send(emb);
  },
} as ICommand;