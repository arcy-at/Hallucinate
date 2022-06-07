"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("detritus-client/lib/constants");
const command_metadata_1 = require("../../../tools/command-metadata");
const formatter_1 = require("../../../tools/formatter");
const parameters_1 = require("../../../tools/parameters");
const basecommand_1 = require("../basecommand");
class ImaggaColorsCommand extends basecommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "imagga colors",
            aliases: ["imagga color"],
            metadata: (0, command_metadata_1.ImageMetadata)("what colors is this image of", "<target: Image>"),
            type: [
                {
                    name: "target",
                    type: parameters_1.Parameters.imageUrl(constants_1.ImageFormats.PNG),
                    required: true,
                },
            ],
        });
    }
    run = formatter_1.Formatter.Imagga.colors;
}
exports.default = ImaggaColorsCommand;