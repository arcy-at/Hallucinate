"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_metadata_1 = require("../../../tools/command-metadata");
const formatter_1 = require("../../../tools/formatter");
const parameters_1 = require("../../../tools/parameters");
const basecommand_1 = require("../basecommand");
class InfoEmojiCommand extends basecommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "info emoji",
            metadata: (0, command_metadata_1.ToolsMetadata)("emoji info", "<emoji: Emoji>", [
                "🍰",
                ":goodbye:",
                "969606376340992060",
            ]),
            type: [
                {
                    name: "emoji",
                    type: parameters_1.Parameters.emojiUrl,
                },
            ],
        });
    }
    run = formatter_1.Formatter.Info.emoji;
}
exports.default = InfoEmojiCommand;