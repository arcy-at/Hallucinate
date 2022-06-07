import { CommandClient } from "detritus-client";
import { BaseCommand } from "../basecommand";
export default class PxlAjitCommand extends BaseCommand {
    constructor(client: CommandClient);
    run: typeof import("../../../tools/format/pxl").Pxl.ajit;
}