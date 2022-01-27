import { Command, CommandClient } from "detritus-client";
import { Filters, someRandomApiFilter } from "../../../../functions/formatter";
import { Parameters } from "../../../../functions/parameters";
import { BaseCommand, ImageArgs } from "../../basecommand";

export default class SRARedFilterCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: "red",

      label: "image",
      type: Parameters.image(),
    });
  }
  async run(context: Command.Context, args: ImageArgs) {
    const embed = await someRandomApiFilter(
      context,
      args.image,
      Filters.RED,
      {}
    );
    return await context.editOrReply({ embed });
  }
}
