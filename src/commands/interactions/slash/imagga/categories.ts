import { ApplicationCommandOptionTypes, ImageFormats } from "detritus-client/lib/constants";
import { Formatter } from "../../../../tools/formatter";
import { Parameters } from "../../../../tools/parameters";
import { BaseSlashSubCommand } from "../baseslash";

export class ImaggaCategoriesSlashSubCommand extends BaseSlashSubCommand {
  name = "categories";
  description = "identify it now";
  constructor() {
    super({
      options: [
        {
            name: "target",
            description: "what to use",
            value: Parameters.imageUrl(ImageFormats.PNG),
            default: Parameters.Default.imageUrl(ImageFormats.PNG),
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
          },
      ],
    });
  }
  run = Formatter.Imagga.categories;
}
