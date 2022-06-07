"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalBirdSlashSubCommand = void 0;
const pariah_1 = require("pariah");
const formatter_1 = require("../../../../../tools/formatter");
const baseslash_1 = require("../../baseslash");
class AnimalBirdSlashSubCommand extends baseslash_1.BaseSlashSubCommand {
    name = "bird";
    description = "fly";
    run = formatter_1.Formatter.SomeRandomApi.animal(pariah_1.APIs.SomeRandomApi.Animals.BIRD);
}
exports.AnimalBirdSlashSubCommand = AnimalBirdSlashSubCommand;