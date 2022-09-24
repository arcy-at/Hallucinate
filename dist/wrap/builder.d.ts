import { Command as Cmd, CommandClient } from "detritus-client";
import { ArgsFactory, Options, Self, Values } from "./parser";
export declare const CommandArgumentBuilders: Self;
export declare function Command<U extends string, V extends ArgsFactory<U, unknown>>(syntax: U, options: Options<U, V>, run: (context: Cmd.Context, args: Values<V, U>) => unknown): {
    new (client: CommandClient): {
        run(context: Cmd.Context, args: Values<V, U>): unknown;
        metadata: import("./base-command").CommandMetadata;
        readonly _file?: string | undefined;
        readonly argParser: Cmd.ArgumentParser;
        readonly commandClient: CommandClient;
        arg: Cmd.Argument;
        disableDm: boolean;
        disableDmReply: boolean;
        permissions?: bigint[] | undefined;
        permissionsClient?: bigint[] | undefined;
        permissionsIgnoreClientOwner?: boolean | undefined;
        priority: number;
        ratelimits: import("detritus-client/lib/commandratelimit").CommandRatelimit[];
        responseOptional: boolean;
        triggerTypingAfter: number;
        onDmBlocked?(context: Cmd.Context): any;
        onBefore?(context: Cmd.Context): boolean | Promise<boolean>;
        onBeforeRun?(context: Cmd.Context, args: any): boolean | Promise<boolean>;
        onCancel?(context: Cmd.Context): any;
        onCancelRun?(context: Cmd.Context, args: any): any;
        onError?(context: Cmd.Context, args: any, error: any): any;
        onPermissionsFail?(context: Cmd.Context, permissions: Cmd.FailedPermissions): any;
        onPermissionsFailClient?(context: Cmd.Context, permissions: Cmd.FailedPermissions): any;
        onRatelimit?(context: Cmd.Context, ratelimits: Cmd.CommandRatelimitInfo[], metadata: Cmd.CommandRatelimitMetadata): any;
        onRunError?(context: Cmd.Context, args: Values<V, U>, error: any): any;
        onSuccess?(context: Cmd.Context, args: Values<V, U>): any;
        onTypeError?(context: Cmd.Context, args: any, errors: any): any;
        aliases: string[];
        args: Cmd.ArgumentOptions[];
        choices: any[] | undefined;
        default: any;
        readonly fullName: string;
        help: string;
        label: string;
        name: string;
        readonly names: string[];
        prefixes: string[];
        type: Cmd.ArgumentType;
        setAliases(value: string[]): any;
        setArgs(value: Cmd.ArgumentOptions[]): any;
        setChoices(value: any[] | undefined): any;
        setDefault(value: any): any;
        setHelp(value: string): any;
        setLabel(value: string): any;
        setName(value: string): any;
        setPrefixes(value: string[]): any;
        setType(value: Cmd.ArgumentType): any;
        check(name: string): boolean;
        getArgs(attributes: import("detritus-client").CommandAttributes, context: Cmd.Context): Promise<{
            errors: any;
            parsed: any;
        }>;
        getName(content: string): string | null;
    };
};