"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_metadata_1 = require("../../../tools/command-metadata");
const formatter_1 = require("../../../tools/formatter");
const parameters_1 = require("../../../tools/parameters");
const basecommand_1 = require("../basecommand");
class InfoGuildCommand extends basecommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "info guild",
            aliases: ["info server"],
            metadata: (0, command_metadata_1.ToolsMetadata)("guild info", "<guild: Guild=here>", [
                "walking",
                "248981745502781440",
            ]),
            type: [
                {
                    name: "guild",
                    type: parameters_1.Parameters.guild,
                    default: parameters_1.Parameters.Default.guild,
                },
            ],
        });
    }
    run = formatter_1.Formatter.Info.guild;
}
exports.default = InfoGuildCommand;