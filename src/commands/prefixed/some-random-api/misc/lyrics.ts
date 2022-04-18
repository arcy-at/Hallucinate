import { Command, CommandClient } from "detritus-client";
import { Markup } from "detritus-client/lib/utils";
import { SomeRandomAPI } from "pariah";
import { Brand } from "../../../../enums/brands";
import { createBrandEmbed } from "../../../../functions/embed";
import { Err } from "../../../../functions/error";
import { Paginator } from "../../../../functions/paginator";
import { BaseCommand, ToolsMetadata } from "../../basecommand";
export interface SRALyricsArgs {
  title: string;
}
export default class SRALyricsCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: "lyrics",
      label: "title",
      type: "string",
      required: true,
      metadata: ToolsMetadata("Get lyrics for a song", "<title: string>", [
        "killshot eminem",
        "nf lost",
      ]),
    });
  }
  async run(context: Command.Context, args: SRALyricsArgs) {
    const embed = createBrandEmbed(Brand.SOME_RANDOM_API, context);
    const sra = new SomeRandomAPI();
    const lyrics = await sra.lyrics(args.title);
    if (lyrics.error) {
      throw new Err("No lyrics found", { status: 404 });
    }
    embed.setTitle(`Lyrics for ${lyrics.title} by ${lyrics.author}`);
    embed.setUrl(lyrics.links.genius);
    embed.setThumbnail(lyrics.thumbnail.genius);

    const pages = lyrics.lyrics.match(/.{1,1000}/g) || [];
    console.log(pages);
    const paginator = new Paginator(context, {
      pageLimit: pages.length,
      onPage: (page) => {
        console.log(page);
        embed.setDescription(
          Markup.codeblock(pages[page - 1]!.replace(/\n{2,}/g, "\n"), {
            language: "txt",
          })
        );
        return embed;
      },
    });

    return await paginator.start();
  }
}
