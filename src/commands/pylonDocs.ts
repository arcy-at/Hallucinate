import { buildDocsEmbed, lookup } from "../functions/buildDocsEmbed";
import { ICommand } from "../interfaces/ICommand";

module.exports = {
  name: "pylondocs",
  usage: "<query: string>",
  usesArgs: true,
  description: "get stuff from pylon docs",
  async run(message, args) {
    const resp = await lookup(args.join(" "), 0);

    await message.reply(buildDocsEmbed(resp, 15));
  },
} as ICommand;
