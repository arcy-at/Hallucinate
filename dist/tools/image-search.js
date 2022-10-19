"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMediaUrls = exports.AllMediaTypes = exports.MediaType = void 0;
const command_1 = require("detritus-client/lib/command");
const constants_1 = require("detritus-client/lib/constants");
const structures_1 = require("detritus-client/lib/structures");
const utils_1 = require("detritus-client/lib/utils");
const builder_1 = require("../wrap/builder");
const emoji_1 = require("./emoji");
const util_1 = require("./util");
var MediaType;
(function (MediaType) {
    MediaType["Audio"] = "Audio";
    MediaType["Video"] = "Video";
    MediaType["Image"] = "Image";
})(MediaType = exports.MediaType || (exports.MediaType = {}));
exports.AllMediaTypes = [
    MediaType.Audio,
    MediaType.Image,
    MediaType.Video,
];
async function findMediaUrls(type, context, text) {
    if (context instanceof command_1.Context) {
        context = context.message;
    }
    const canBeAudio = type.includes(MediaType.Audio);
    const canBeVideo = type.includes(MediaType.Video);
    const canBeImage = type.includes(MediaType.Image);
    const out = [];
    for (const [, attachment] of context.attachments) {
        if ((canBeAudio && attachment.isAudio) ||
            (canBeVideo && attachment.isVideo) ||
            (canBeImage && attachment.isImage)) {
            out.push(attachment.url);
        }
    }
    if (context.referencedMessage) {
        out.push(...(await findMediaUrls(type, context.referencedMessage, context.content)));
    }
    for (const [, embed] of context.embeds) {
        if (canBeImage && embed.image && embed.image.url) {
            out.push(embed.image.url);
        }
    }
    for (const [, stickerItem] of context.stickerItems) {
        if (canBeImage && stickerItem.formatType === constants_1.StickerFormats.PNG) {
            out.push(stickerItem.assetUrl);
        }
    }
    if (text) {
        const urls = (0, utils_1.regex)(constants_1.DiscordRegexNames.TEXT_URL, text);
        for (const { text } of urls.matches) {
            if (text === undefined) {
                continue;
            }
            if (canBeAudio && structures_1.EmbeddableRegexes.audio.test((0, util_1.fileExtension)(text))) {
                out.push(text);
            }
            if (canBeImage && structures_1.EmbeddableRegexes.image.test((0, util_1.fileExtension)(text))) {
                out.push(text);
            }
            if (canBeVideo && structures_1.EmbeddableRegexes.video.test((0, util_1.fileExtension)(text))) {
                out.push(text);
            }
        }
        try {
            const id = await builder_1.CommandArgumentBuilders.user()(text, context);
            console.log(id);
            if (canBeImage) {
                out.push(id.avatarUrlFormat(null, { size: 1024 }) || id.defaultAvatarUrl);
            }
        }
        catch {
            void 0;
        }
        const emojis = (0, utils_1.regex)(constants_1.DiscordRegexNames.EMOJI, text);
        for (const { matched } of emojis.matches) {
            if (canBeImage) {
                out.push(emoji_1.CustomEmoji.url(matched));
            }
        }
    }
    return out;
}
exports.findMediaUrls = findMediaUrls;