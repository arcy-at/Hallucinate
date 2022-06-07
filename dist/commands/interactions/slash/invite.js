"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatter_1 = require("../../../tools/formatter");
const baseslash_1 = require("./baseslash");
class SlashPingCommand extends baseslash_1.BaseSlashCommand {
    name = "invite";
    description = "add bot";
    run = formatter_1.Formatter.invite;
}
exports.default = SlashPingCommand;