import { User } from "detritus-client/lib/structures";
import { CustomEmojis } from "../enums/customEmojis";
import { Emojis } from "../enums/emojis";
import { UserStatusMap } from "../enums/userStatus";
import { PresenceStatus, PresenceStatusUnion } from "../enums/utils";
import { Chars } from "../globals";
const spotifyIcon = "<:spotify:826151198603870239>";

export function getPresence(user: User, maxTextLength: number = 45) {
  const pres = user.presence!;
  var stat = `${UserStatusMap.get(pres.status as PresenceStatusUnion)?.icon} ${
    UserStatusMap.get(pres.status as PresenceStatusUnion)?.text
  }`;
  var custom = null;
  const statuses = [];
  for (const i of pres.activities) {
    const item = i[1];
    if (item.type === PresenceStatus.CUSTOM_STATUS) {
      const e = item.emoji ?? CustomEmojis.GUI_RICH_PRESENCE;
      const text = item.state
        ? `${item.state.slice(0, maxTextLength)}${
            item.state.length > maxTextLength ? "..." : ""
          }`
        : "";
      custom = `${e} ${text} (${item.name})`;
    }
    if (item.type == PresenceStatus.PLAYING) {
      const text = item.details ? `${item.details} - ` : "";
      const state = item.state ? `\n${Chars.TAB_SPACER} ${item.state}` : "";
      const name = item.name;
      statuses.push(`${Emojis.VIDEO_GAME} ${text}**${name}**${state}`);
    }
    if (item.type == PresenceStatus.LISTENING) {
      const text = item.details ? `${item.details}` : "";
      const author = item.state ? ` by ${item.state}` : "";
      const track = text + author !== "" ? `${text}${author} - ` : "";
      const name = item.name;
      statuses.push(
        `${
          item.name == "Spotify" ? spotifyIcon : Emojis.MUSICAL_NOTE
        } ${track}**${name}**`
      );
    }
    if (item.type == PresenceStatus.WATCHING) {
      const text = item.details ? `${item.details} - ` : "";
      const state = item.state ? `\n${Chars.TAB_SPACER} ${item.state}` : "";
      const name = item.name;
      statuses.push(`${Emojis.TV} ${text}**${name}**${state}`);
    }
    if (item.type == PresenceStatus.STREAMING) {
      const text = item.details ? `${item.details} - ` : "";
      const state = item.state ? `\n${Chars.TAB_SPACER} ${item.state}` : "";
      const name = item.name;
      statuses.push(`${Emojis.SATELLITE} ${text}**${name}**${state}`);
    }
  }
  return `${stat}${custom ? `\n${custom}` : ""}${
    statuses.length !== 0 ? `\n${statuses.sort().join("\n")}` : ""
  }`;
}
