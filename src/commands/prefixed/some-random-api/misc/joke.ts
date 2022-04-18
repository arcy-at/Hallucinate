import { CommandClient } from "detritus-client";
import { Context } from "detritus-client/lib/command";
import { SomeRandomAPI } from "pariah";
import { Brand } from "../../../../enums/brands";
import { createBrandEmbed } from "../../../../functions/embed";
import { Markup } from "../../../../functions/markup";
import { editOrReply } from "../../../../functions/tools";
import { BaseCommand, ToolsMetadata } from "../../basecommand";

export default class SRAJokeCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: "joke",
      metadata: ToolsMetadata("Get a joke"),
    });
  }
  async run(context: Context, _args: {}) {
    const { joke } = await new SomeRandomAPI().joke();

    const embed = createBrandEmbed(Brand.SOME_RANDOM_API, context);
    embed.setTitle("Joke");
    embed.setDescription(Markup.codeblock(joke));
    return await editOrReply(context, { embed });
  }
}
