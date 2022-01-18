import { Command, Context } from "detritus-client/lib/command";
import { decode, Frame, GIF, Image as OldImage } from "imagescript";
import { Animation, Image } from "imagescript/v2";
import fetch from "node-fetch";
import { altclients, client, Regex, selfclient } from "../globals";
import { Converter } from "./converter";
import { findImage } from "./findImage";
import { storeImage } from "./tools";

export namespace Parameters {
  export function command(content: string, context: Context) {
    if (content) {
      const commands: Array<Command> = [];
      const commandsWithPrefix: Array<Command> = [];

      const insensitive = content.toLowerCase().replace(/\s\s+/g, " ");
      const insensitiveAsPrefix = insensitive + " ";

      for (let command of context.commandClient.commands) {
        if (command.names.includes(insensitive)) {
          commandsWithPrefix.push(command);
          continue;
        }
        if (
          command.names.some((name) => name.startsWith(insensitiveAsPrefix))
        ) {
          commandsWithPrefix.push(command);
          continue;
        }
        if (command.names.some((name) => name.startsWith(insensitive))) {
          commands.push(command);
          continue;
        }
      }
      return [
        ...commandsWithPrefix.sort((x, y) => {
          if (x.names.includes(insensitive)) {
            return -1;
          }
          return x.name.localeCompare(y.name);
        }),
        ...commands.sort((x, y) => x.name.localeCompare(y.name)),
      ];
    }
    return null;
  }

  export async function user(value: string, _context: Context) {
    const found = [client, ...altclients, selfclient]
      .map((v) => v.users.toArray())
      .flat(1)
      .find((key) => {
        return (
          key.username.toLowerCase().includes(value) ||
          key.toString().toLowerCase() === value ||
          key.id === value.replace(/\D/g, "")
        );
      });
    if (!found) {
      try {
        const fetchy = await client.rest.fetchUser(value.replace(/\D/g, ""));
        if (fetchy) {
          return fetchy;
        }
      } catch (e) {}
    }
    return found;
  }
  export async function imageUrl(value: string, context: Context) {
    const img = await findImage(context, value);
    if (!img) return undefined;
    return await storeImage(
      await (await fetch(img)).buffer(),
      "attachment.gif"
    );
  }
  export async function image(value: string, context: Context) {
    let url = await imageUrl(value, context);
    if (!url) throw new Error("Could not find any images");

    const imageResponse = await fetch(url.url!);
    if (!imageResponse.ok)
      throw new Error(
        `Error ${imageResponse.status}: ${imageResponse.statusText}`
      );

    return imageResponse.buffer();
  }
  export namespace ImageScript {
    export async function animation(
      value: string,
      context: Context
    ): Promise<Animation> {
      const img = await image(value, context);
      let gif = await decode(img);
      if (gif instanceof OldImage) {
        gif = new GIF([Frame.from(gif)]);
      }
      return Converter.ImageScript.Animation.v1v2(gif);
    }

    export async function frame(
      value: string,
      context: Context
    ): Promise<Image> {
      const img = await image(value, context);
      const gif = await decode(img);
      if (gif instanceof OldImage) {
        return Converter.ImageScript.Image.v1v2(gif);
      }
      return Converter.ImageScript.Image.v1v2(gif[0]!);
    }
  }

  export function emojiImage(query: string) {
    query = query.toLowerCase();
    if (![Regex.EMOJI, Regex.UNICODE_EMOJI].some((v) => v.test(query)))
      return undefined;
    var url, type: "twemoji" | "custom", id;
    if (!query!.replace(/\D/g, "")) {
      const hex = query!.codePointAt(0)!.toString(16);
      const result = "0000".substring(0, 4 - hex.length) + hex;
      url = `https://cdn.notsobot.com/twemoji/512x512/${result}.png`;
      type = "twemoji";
    } else {
      url = `https://cdn.discordapp.com/emojis/${query?.replace(/\D/g, "")}.${
        query?.startsWith("<a:") ? "gif" : "png"
      }`;
      type = "custom";
      id = query?.replace(/\D/g, "");
    }
    return {
      url,
      type,
      id,
    };
  }
  export function guildEmoji(emoj: string) {
    emoj = emoj.toLowerCase();
    return client.emojis.find(
      (v) =>
        v.name.toLowerCase().includes(emoj) ||
        v.id === emoj.replace(/\D/g, "") ||
        v.url.toLowerCase() === emoj
    );
  }
  export function color(value: string) {
    let hex = value.replace(/\D/g, "");
    if (![3, 6].some((v) => v === hex.length)) throw new Error("Invalid color");
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((v) => v + v)
        .join("");
    return hex;
  }
  export function url(value: string) {
    let url: URL;

    url = new URL(value);

    return url;
  }
  export function date(value: string, _context: Context) {
    const date = new Date(value);
    if (isNaN(date.getTime())) throw new Error("Invalid date");
    return date;
  }
  export function phone(value: string, _context: Context) {
    // phone number regex
    const regex =
      /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!value.match(regex)) throw new Error("Invalid phone number");
    return value;
  }
  export function email(value: string, _context: Context) {
    // email regex
    const regex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (!value.match(regex)) throw new Error("Invalid email");
    return value;
  }
}
export namespace DefaultParameters {
  export function user(context: Context) {
    return context.user;
  }
}
