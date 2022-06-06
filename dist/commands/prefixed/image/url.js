"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_metadata_1 = require("../../../tools/command-metadata");
const formatter_1 = require("../../../tools/formatter");
const parameters_1 = require("../../../tools/parameters");
const basecommand_1 = require("../basecommand");
class ImageUrlCommand extends basecommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "image url",
            metadata: (0, command_metadata_1.ImageMetadata)("get url of image", "<target: Image>", [
                "@insyri#7314",
                "insyri",
                "533757461706964993",
                "https://cdn.clancy.lol/turkey.png",
                "^",
            ]),
            type: [
                {
                    name: "target",
                    type: parameters_1.Parameters.imageUrl(),
                    required: true,
                },
            ],
        });
    }
    run = formatter_1.Formatter.Image.url;
}
exports.default = ImageUrlCommand;
