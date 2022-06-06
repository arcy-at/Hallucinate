"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_metadata_1 = require("../../../tools/command-metadata");
const formatter_1 = require("../../../tools/formatter");
const basecommand_1 = require("../basecommand");
class SearchWebCommand extends basecommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "search web",
            metadata: (0, command_metadata_1.ToolsMetadata)("look at html", "<query: string>", [
                "what is a monkey",
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
    run = formatter_1.Formatter.Search.web;
}
exports.default = SearchWebCommand;
