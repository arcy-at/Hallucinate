"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PxlFlagSlashSubCommand = void 0;
const constants_1 = require("detritus-client/lib/constants");
const pariah_1 = require("pariah");
const formatter_1 = require("../../../../tools/formatter");
const parameters_1 = require("../../../../tools/parameters");
const baseslash_1 = require("../baseslash");
class PxlFlagSlashSubCommand extends baseslash_1.BaseSlashSubCommand {
    name = "flag";
    description = "stop being gay :(";
    constructor() {
        super({
            options: [
                {
                    name: "target",
                    description: "what to use",
                    value: parameters_1.Parameters.imageUrl(constants_1.ImageFormats.PNG),
                    default: parameters_1.Parameters.Default.imageUrl(constants_1.ImageFormats.PNG),
                    type: constants_1.ApplicationCommandOptionTypes.STRING,
                    required: false,
                },
                {
                    name: "flag",
                    description: "what flag",
                    type: constants_1.ApplicationCommandOptionTypes.STRING,
                    autocomplete: true,
                    onAutoComplete: parameters_1.Parameters.Autocomplete.choices(Object.values(pariah_1.APIs.PxlAPI.Flags)),
                },
            ],
        });
    }
    run = formatter_1.Formatter.Pxl.flag;
}
exports.PxlFlagSlashSubCommand = PxlFlagSlashSubCommand;
