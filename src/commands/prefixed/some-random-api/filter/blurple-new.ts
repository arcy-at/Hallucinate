import { Command, CommandClient } from "detritus-client";
import { Filters, someRandomApiFilter } from "../../../../functions/formatter";
import { Parameters } from "../../../../functions/parameters";
import { BaseCommand, ImageArgs } from "../../basecommand";

export default class SRABlurpleFilterCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: "newblurple",

      label: "image",
      type: Parameters.image(),
    });
  }
  async run(context: Command.Context, args: ImageArgs) {
    const embed = await someRandomApiFilter(
      context,
      args.image,
      Filters.BLURPLE2,
      {}
    );
    return await context.editOrReply({ embed });
  }
}
