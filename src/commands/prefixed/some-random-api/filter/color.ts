import { Command, CommandClient } from "detritus-client";
import { Filters, someRandomApiFilter } from "../../../../functions/formatter";
import { Parameters } from "../../../../functions/parameters";
import { editOrReply } from "../../../../functions/tools";
import { BaseCommand, ImageArgs, ImageMetadata } from "../../basecommand";

export interface SRAColorFilterArgs extends ImageArgs {
  color: number;
}

export default class SRAColorFilterCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: "color",

      label: "image",
      type: Parameters.image(),

      args: [{ name: "color", type: Parameters.color, required: true }],
      metadata: ImageMetadata("Color Filter", "<image: Image> <-color: Color>"),
    });
  }
  async run(context: Command.Context, args: SRAColorFilterArgs) {
    const embed = await someRandomApiFilter(
      context,
      args.image,
      Filters.COLOR,
      args
    );
    return await editOrReply(context, { embed });
  }
}
