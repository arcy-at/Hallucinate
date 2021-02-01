import Discord from "discord.js";
import { formatID } from "../functions/formatID";
import { client } from "../index";
import { config } from "./config";

export function logBlacklistedGuildOwner(
  guild: Discord.Guild,
  user: Discord.User
) {
  config.logs.blacklist.guildBlocked.forEach((e) => {
    const ch = client.channels.cache.get(e) as Discord.TextChannel;
    ch.send(
      `:warning: Blacklisted Guild \`${guild.name}\` ${formatID(
        guild.id
      )} owned by **${user.tag}** tried to add the bot`
    );
  });
}