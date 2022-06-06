"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_metadata_1 = require("../../../tools/command-metadata");
const formatter_1 = require("../../../tools/formatter");
const parameters_1 = require("../../../tools/parameters");
const basecommand_1 = require("../basecommand");
class TodoGetCommand extends basecommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "todo list",
            metadata: (0, command_metadata_1.ToolsMetadata)("get todo", "?<-user: User>", [
                "-user @insyri#7314",
            ]),
            args: [
                {
                    name: "user",
                    type: parameters_1.Parameters.user,
                    default: parameters_1.Parameters.Default.author,
                },
            ],
        });
    }
    run = formatter_1.Formatter.Todo.list;
}
exports.default = TodoGetCommand;
