import { CommandClient } from "detritus-client";
import { ToolsMetadata } from "../../../tools/command-metadata";
import { Formatter } from "../../../tools/formatter";
import { Parameters } from "../../../tools/parameters";
import { BaseCommand } from "../basecommand";

export default class InfoUserCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: "info user",
      metadata: ToolsMetadata("user info", "<user: User=self>", [
        "@insyri#7314",
        "insyri",
        "533757461706964993",
      ]),
      type: [
        {
          name: "user",
          type: Parameters.user,
        },
      ],
    });
  }

  run = Formatter.Info.user;
}
