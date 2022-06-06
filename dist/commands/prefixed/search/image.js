"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_metadata_1 = require("../../../tools/command-metadata");
const formatter_1 = require("../../../tools/formatter");
const basecommand_1 = require("../basecommand");
class SearchImageCommand extends basecommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "search image",
            metadata: (0, command_metadata_1.ToolsMetadata)("look at png", "<query: string>", [
                "plants",
                "money",
            ]),
            type: [
                {
                    name: "query",
                    type: "string",
                    consume: true,
                    required: true,
                },
            ],
        });
    }
    run = formatter_1.Formatter.Search.image;
}
exports.default = SearchImageCommand;
