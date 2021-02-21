import Discord, { MessageEmbed } from "discord.js";
import { client as c } from "..";
import { config as conf } from "../config";
import { arrayContainsAll } from "../functions/checkArrayContainsAll";
import { fetchCommand as fc } from "../functions/fetchCommand";
import * as globals from "../globals";
import { ICommand } from "../interfaces/ICommand";
import { decor } from "../maps/emojiEnum";

module.exports = {
  name: "eval",
  description: "Run code",
  usage: "<code: text>",
  restrictions: {
    ownerOnly: true,
  },
  async run(message, args: string[]) {
    var lang: "json" | "ts" | "js" = "ts";
    const code = args.join(" ").replace(/\`{3}\n?(.+)?/g, "");
    const input = `\`\`\`ts\n${code}\`\`\``;
    var str = null;
    try {
      const client = c;
      const config = conf;
      const fetchCommand = fc;
      const cf = arrayContainsAll;
      const discord = Discord;
      const char = globals.Chars;
      client;
      config;
      fetchCommand;
      cf;
      discord;
      char;
      str = eval(code);
      const embed = new MessageEmbed();
      embed.setColor(globals.Color.embed);
      embed.setTitle(`${decor.Emojis.WHITE_CHECK_MARK} Eval Success`);
      embed.addField("Input", input);
      // if (str instanceof Promise) str = await str;
      if (str instanceof Object) {
        str = JSON.stringify(str, null, 2);
        lang = "json";
      }
      const output = `\`\`\`${lang}\n${str}\`\`\``;
      embed.addField("Output", output);
      await message.reply(embed);
    } catch (e) {
      str = e;
      const embed = new MessageEmbed();
      embed.setColor(globals.Color.embed);
      embed.setTitle(`${decor.Emojis.NO_ENTRY} Eval Failed`);
      embed.addField("Input", input);
      const output = `\`\`\`ts\n${str}\`\`\``;
      embed.addField("Output", output);
      await message.reply(embed);
    }
  },
} as ICommand;
