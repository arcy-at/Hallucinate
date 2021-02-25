"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tags = exports.sequelize = exports.commandFiles = exports.commands = exports.client = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
const formatID_1 = require("./functions/formatID");
const globals_1 = require("./globals");
const commandHandler_1 = require("./handlers/commandHandler");
const discordjsError_1 = require("./handlers/discordjsError");
const fetchCommandFiles_1 = require("./handlers/fetchCommandFiles");
const makeCommandFromFile_1 = require("./handlers/makeCommandFromFile");
const onReady_1 = require("./handlers/onReady");
const setUserPresence_1 = require("./handlers/setUserPresence");
const logError_1 = require("./logs/logError");
const TerminalColors_1 = require("./types/TerminalColors");
setUserPresence_1.setUserPresence();
exports.client = new discord_js_1.default.Client({
    intents: discord_js_1.default.Intents.ALL,
    ws: {
        properties: {
            $browser: config_1.config.bot.presence.browser,
        },
    },
    allowedMentions: {
        roles: [],
        users: [],
        repliedUser: false,
    },
    retryLimit: 10,
    presence: {
        activity: {
            name: config_1.config.bot.presence.activity.name,
            type: config_1.config.bot.presence.activity.type,
        },
        afk: true,
    },
});
exports.commands = new discord_js_1.default.Collection();
exports.commandFiles = fetchCommandFiles_1.fetchCommandFiles();
exports.commandFiles.forEach(makeCommandFromFile_1.makeCommands(exports.commands));
exports.commands
    .array()
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .forEach((e) => {
    const consoleMessages = [];
    if (!e.description)
        consoleMessages.push(`it is recommended to set a ${TerminalColors_1.color("description", "\u001B[32m")} for the help menu page for this command`);
    if (!e.run)
        consoleMessages.push(`you must set a ${TerminalColors_1.color("run()", "\u001B[34m")} function`);
    if (e.usage == undefined)
        consoleMessages.push(`it is recommended to set ${TerminalColors_1.color("usage", "\u001B[32m")} for the command`);
    if (consoleMessages.length)
        console.log(`${TerminalColors_1.color("[COMMAND MANAGER]", "\u001B[35m")} ${e.name}:\n${consoleMessages.join("\n")}`);
});
exports.sequelize = new sequelize_1.Sequelize("database", "user", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite",
});
exports.Tags = exports.sequelize.define("tags", {
    name: {
        type: sequelize_1.STRING,
        unique: true,
    },
    description: sequelize_1.TEXT,
    username: sequelize_1.STRING,
    usage_count: {
        type: sequelize_1.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
});
exports.client.once("ready", async () => {
    exports.Tags.sync();
    onReady_1.onReady();
});
exports.client.on("error", (e) => discordjsError_1.discordjsError(e));
exports.client.on("message", async (message) => {
    const sexes = message.content.match(globals_1.regexes.sex);
    if (sexes) {
        if (message.author !== exports.client.user && !message.author.bot) {
            try {
                message.author.send(`No sex :bangbang:`);
            }
            catch (e) { }
            await message.react("😳");
        }
        config_1.config.global.sexAlarm.forEach(async (e) => {
            if (exports.client.user == message.author && message.channel.type == "dm")
                return;
            if (message.author.bot)
                return;
            (await exports.client.channels.fetch(e)).send(`${message.author} ${formatID_1.formatID(message.author.id)} has **sexed** __${sexes.length} time${sexes.length == 1 ? "" : "s"}__ in ${message.guild ? message.channel : "DMs"} ${formatID_1.formatID(message.channel.id)} ${message.guild && message.guild.id !== config_1.config.global.mainServerID
                ? `on \`${message.guild.name}\` ${formatID_1.formatID(message.guild.id)}`
                : ""}`);
        });
    }
    await commandHandler_1.commandHandler(message);
});
process.on("uncaughtException", (e) => logError_1.logError(e));
exports.client.login(config_1.config.bot.token);
exports.client.on("guildCreate", onReady_1.onReady);
