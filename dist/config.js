"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    __global: {
        guildId: "775743191441735712",
        locale: "en-US",
        timezone: "America/Chicago",
    },
    bot: {
        prefixes: ["\\$", "p\\/", "<@!?760143615124439040>", ""],
        id: "760143615124439040",
        token: "NzYwMTQzNjE1MTI0NDM5MDQw.X3Hw6A.qMOIPdjMf8sKPIk04g5GvsIlJ08",
        application: {
            ownerId: "504698587221852172",
            clientId: "760143615124439040",
            publicKey: "3667c73b9600c708d5b7e2fdd25e48351510554845216a7086976e0848813a10",
        },
        ownerIds: [
            "533757461706964993",
            "504698587221852172",
        ],
        presence: {
            activity: {
                name: "$",
                type: "STREAMING",
                url: "https://www.youtube.com/watch?v=db_sYdSPD24&ab_channel=FalseNoise-Topic",
            },
            browser: "Discord iOS",
        },
    },
    logs: {
        starts: {
            keys: ["800439411036520459"],
        },
        commands: {
            usage: {
                keys: ["800561781302362124"],
            },
            onError: {
                keys: ["800561781302362124"],
            },
        },
        blacklist: {
            userBlocked: ["800561781302362124"],
            guildBlocked: ["800561781302362124"],
            guildOwnerBlocked: ["800561781302362124"],
        },
    },
    blacklist: {
        guild: {
            owners: ["606162661184372736"],
            ids: [],
        },
        users: ["606162661184372736"],
    },
};
