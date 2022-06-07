"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_metadata_1 = require("../../../tools/command-metadata");
const formatter_1 = require("../../../tools/formatter");
const basecommand_1 = require("../basecommand");
class EvalCommand extends basecommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "eval",
            metadata: (0, command_metadata_1.ToolsMetadata)("run code", "<code: string | Codeblock> <-json-spacing: number=2>", ["1", "context.client.token", "while (true) {}"]),
            type: [
                {
                    name: "code",
                    type: "string",
                    required: true,
                    consume: true,
                },
            ],
        });
    }
    run = formatter_1.Formatter.code;
}
exports.default = EvalCommand;