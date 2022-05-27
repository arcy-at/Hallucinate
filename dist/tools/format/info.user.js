"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const constants_1 = require("detritus-client/lib/constants");
const constants_2 = require("../../constants");
const globals_1 = require("../../globals");
const emojis_1 = require("../emojis");
const markdown_1 = require("../markdown");
const tools_1 = require("../tools");
const Basic = __importStar(require("./basic"));
const Embed = __importStar(require("./embed"));
async function user(context, args) {
    const embed = Embed.user(context);
    const { user } = args;
    embed.setTitle(user.tag);
    const profile = await globals_1.selfclient.rest.fetchUserProfile(user.id);
    embed.setThumbnail(profile.user.avatarUrl);
    if (profile) {
        const description = [];
        if (profile.user.bio) {
            description.push(Basic.field(emojis_1.Emojis.MEMO, "Bio", markdown_1.Markdown.Format.codeblock(profile.user.bio)));
        }
        if (profile.premiumSinceUnix) {
            description.push(Basic.field(emojis_1.Emojis.STAR, "Has had nitro since", (0, tools_1.buildTimestampString)(profile.premiumSinceUnix)));
        }
        if (profile.premiumGuildSinceUnix) {
            description.push(Basic.field(emojis_1.Emojis.STAR, "Has boosted a server since", (0, tools_1.buildTimestampString)(profile.premiumGuildSinceUnix)));
        }
        if (description.length) {
            embed.addField("User Profile", description.join("\n"));
        }
    }
    {
        const description = [];
        description.push(Basic.field(emojis_1.Emojis.GEAR, "ID", markdown_1.Markdown.Format.codestring(user.id)));
        description.push(Basic.field(emojis_1.Emojis.LINK, "Profile", `${markdown_1.Markdown.Format.link(user.tag, user.jumpLink)} (${user.mention})`));
        description.push(Basic.field(emojis_1.Emojis.CALENDAR, "Created At", (0, tools_1.buildTimestampString)(user.createdAtUnix)));
        {
            const tags = [];
            if (user.isSystem) {
                tags.push("System");
            }
            if (user.bot) {
                if (user.hasVerifiedBot) {
                    tags.push("Verified Bot");
                }
                tags.push("Bot");
            }
            if (user.isWebhook) {
                tags.push("Webhook");
            }
            if (user.isClientOwner) {
                tags.push("Client Owner");
            }
            if (tags.length) {
                "\n" +
                    description.push(Basic.field("<:IconChannel_Str:798624234745757727>", "Tags", tags.join(", ")));
            }
        }
        const flags = [];
        for (const flag of Object.values(constants_1.UserFlags)) {
            if (typeof flag === "string") {
                continue;
            }
            if (user.hasFlag(flag)) {
                flags.push(constants_2.UserBadges[flag]);
            }
        }
        if (flags.length) {
            description.push(Basic.field(emojis_1.Emojis.NOTEPAD_SPIRAL, "Badges", flags.join("")));
        }
        if (description.length) {
            embed.addField("User Info", description.join("\n"));
        }
    }
    if (context.guild) {
        const member = context.guild.members.get(user.id);
        if (member) {
            const description = [];
            if (member.nick) {
                description.push(Basic.field(emojis_1.Emojis.PENCIL, "Nickname", member.nick));
            }
            if (member.joinedAtUnix) {
                description.push(Basic.field(emojis_1.Emojis.CALENDAR, "Joined At", (0, tools_1.buildTimestampString)(member.joinedAtUnix)));
            }
            if (member.isBoosting) {
                const subscriptions = await context.guild?.fetchPremiumSubscriptions();
                const fromUser = subscriptions.filter((subscription) => subscription.user.id === user.id);
                description.push(Basic.field(emojis_1.Emojis.STAR, "Boosting Since", `${markdown_1.Markdown.Format.timestamp(member.premiumSince)} (${fromUser.length} ${fromUser.length === 1 ? "boost" : "boosts"})`));
            }
            if (member.roles.size) {
                description.push("\n" +
                    Basic.field("<:IconGui_Role:816328284245196840>", "Role Count", String(member.roles.size)));
                if (member.roles.size > 0) {
                    if (member.roles.size <= 20) {
                        description.push(Basic.field("<:IconGui_Role:816328284245196840>", "Roles", member.roles.map((role) => role.mention).join(", ")));
                    }
                    else {
                        const keyRoles = [];
                        for (const [, role] of member.roles) {
                            for (const permission of constants_2.IrrelevantPermissions) {
                                if (role.can(permission)) {
                                    continue;
                                }
                            }
                            keyRoles.push(role);
                        }
                        if (keyRoles.length <= 20) {
                            description.push(Basic.field("<:IconGui_Role:816328284245196840>", "Key Roles", keyRoles.map((role) => role.mention).join(", ")));
                        }
                        else {
                            description.push(Basic.field("<:IconGui_Role:816328284245196840>", "Key Role Count", String(keyRoles.length)));
                        }
                    }
                }
                if (member.voiceState) {
                    const { voiceState } = member;
                    const state = [];
                    if (voiceState.isSpeaking) {
                        state.push("<:IconStatus_Online:798624246728228874>");
                    }
                    else {
                        state.push("<:IconStatus_Offline:798624247546511370>");
                    }
                    if (voiceState.deaf || voiceState.selfDeaf) {
                        state.push("<:IconGui_Deafened:798624239208104019>");
                    }
                    else {
                        state.push("<:IconGui_Undeafened:798624241892982864>");
                    }
                    if (voiceState.mute ||
                        voiceState.selfMute ||
                        voiceState.suppress) {
                        state.push("<:IconGui_Muted:798624247089463356>");
                    }
                    else {
                        state.push("<:IconGui_Unmuted:798624242035326976>");
                    }
                    if (voiceState.selfStream) {
                        state.push("<:IconGui_Stream:836609722047397919>");
                    }
                    if (voiceState.selfVideo) {
                        state.push("<:IconGui_Video:837043839662424104>");
                    }
                    if (voiceState.requestToSpeakTimestamp) {
                        state.push(emojis_1.Emojis.WAVE);
                    }
                    if (state.length) {
                        description.push("\n" +
                            Basic.field(emojis_1.Emojis.MICROPHONE, "Voice State", state.join(" ")));
                    }
                }
                {
                    const permissions = Basic.permissionsList(member);
                    if (permissions.length) {
                        description.push("\n" +
                            Basic.field(emojis_1.Emojis.LOCK, "Permissions", permissions
                                .map((permission) => constants_2.PermissionsText[String(permission)])
                                .join(", ")));
                    }
                }
            }
            if (description.length) {
                embed.addField("Member Info", description.join("\n"));
            }
        }
    }
    return await (0, tools_1.editOrReply)(context, { embed });
}
exports.user = user;
