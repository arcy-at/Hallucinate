import { BaseSlashSubCommand } from "../baseslash";
export declare class ChannelSlashSubCommand extends BaseSlashSubCommand {
    name: string;
    description: string;
    constructor();
    run: typeof import("../../../../tools/format/info.channel").channel;
}