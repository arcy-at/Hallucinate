import { Command, Interaction } from "detritus-client";
import {
  InteractionCallbackTypes,
  MessageComponentButtonStyles,
  MessageFlags,
} from "detritus-client/lib/constants";
import { Member, Message, User } from "detritus-client/lib/structures";
import { ComponentContext, Components, Embed } from "detritus-client/lib/utils";
import { Timers } from "detritus-utils";
import { editOrReply } from "./tools";

export const MAX_PAGE = Number.MAX_SAFE_INTEGER;
export const MIN_PAGE = 1;

export enum PageButtonNames {
  // CUSTOM = "custom",
  NEXT = "next",
  NEXT_DOUBLE = "nextDouble",
  PREVIOUS = "previous",
  PREVIOUS_DOUBLE = "previousDouble",
  SHUFFLE = "shuffle",
  STOP = "stop",
}

export interface PageButton {
  emoji?: string | { animated?: boolean; id?: null | string; name: string };
  label?: string;
}

export const PageButtons: Record<PageButtonNames, PageButton> = Object.freeze({
  // [PageButtonNames.CUSTOM]: { label: "?" },
  [PageButtonNames.NEXT]: { label: ">" },
  [PageButtonNames.NEXT_DOUBLE]: {
    label: ">>",
  },
  [PageButtonNames.PREVIOUS]: { label: "<" },
  [PageButtonNames.PREVIOUS_DOUBLE]: {
    label: "<<",
  },
  [PageButtonNames.SHUFFLE]: { label: "*" },
  [PageButtonNames.STOP]: { label: "X" }, //{emoji: '<:b_stop:848383585873428520>'},
});

export type OnErrorCallback = (
  error: any,
  paginator: Paginator
) => Promise<any> | any;
export type OnExpireCallback = (paginator: Paginator) => Promise<any> | any;
export type OnPageCallback = (page: number) => Promise<Embed> | Embed;
export type OnPageNumberCallback = (
  content: string
) => Promise<number> | number;

export type PaginatorButtons = Partial<Record<PageButtonNames, PageButton>>;

export interface PaginatorOptions {
  buttons?: PaginatorButtons;
  expire?: number;
  isEphemeral?: boolean;
  message?: Message;
  page?: number;
  pageLimit?: number;
  pageSkipAmount?: number;
  pages?: Array<Embed>;
  targets?: Array<Member | User | string>;

  onError?: OnErrorCallback;
  onExpire?: OnExpireCallback;
  onPage?: OnPageCallback;
  onPageNumber?: OnPageNumberCallback;
}

export class Paginator {
  readonly context: Command.Context | Interaction.InteractionContext | Message;
  readonly custom: {
    expire: number;
    isActive: boolean;
    message?: null | Message;
    timeout: Timers.Timeout;
    userId?: null | string;
  } = {
    expire: 10000,
    isActive: false,
    timeout: new Timers.Timeout(),
  };
  _isEphemeral?: boolean;
  _message: null | Message = null;

  buttons: Record<PageButtonNames, PageButton> = Object.assign({}, PageButtons);
  expires: number = 1 * (60 * 1000);
  page: number = MIN_PAGE;
  pageLimit: number = MAX_PAGE;
  pageSkipAmount: number = 10;
  pages?: Array<Embed>;
  ratelimit: number = 250;
  ratelimitTimeout = new Timers.Timeout();
  stopped: boolean = false;
  targets: Array<string> = [];

  onError?: OnErrorCallback;
  onExpire?: OnExpireCallback;
  onPage?: OnPageCallback;
  onPageNumber?: OnPageNumberCallback;

  constructor(
    context: Command.Context | Interaction.InteractionContext | Message,
    options: PaginatorOptions
  ) {
    this.context = context;
    this._message = options.message || null;

    if (options.isEphemeral !== undefined) {
      this.isEphemeral = options.isEphemeral;
    }

    if (Array.isArray(options.pages)) {
      this.pages = options.pages;
      this.pageLimit = this.pages.length;
    } else {
      if (options.pageLimit !== undefined) {
        this.pageLimit = Math.max(
          MIN_PAGE,
          Math.min(options.pageLimit, MAX_PAGE)
        );
      }
    }

    if (options.page !== undefined) {
      this.page = Math.max(MIN_PAGE, Math.min(options.page, MAX_PAGE));
    }
    this.pageSkipAmount = Math.max(
      2,
      options.pageSkipAmount || this.pageSkipAmount
    );

    if (Array.isArray(options.targets)) {
      for (let target of options.targets) {
        if (typeof target === "string") {
          this.targets.push(target);
        } else {
          this.targets.push(target.id);
        }
      }
    } else {
      if (context instanceof Message) {
        this.targets.push(context.author.id);
      } else {
        this.targets.push(context.userId);
      }
    }

    if (!this.targets.length) {
      throw new Error("A userId must be specified in the targets array");
    }

    const buttons: PaginatorButtons = Object.assign(
      {},
      PageButtons,
      options.buttons
    );
    for (let key in PageButtons) {
      (this.buttons as any)[key] = (buttons as any)[key];
    }

    this.onError = options.onError;
    this.onExpire = options.onExpire;
    this.onPage = options.onPage;
    this.onPageNumber = options.onPageNumber;

    Object.defineProperties(this, {
      _message: { enumerable: false },
      buttons: { enumerable: false },
      context: { enumerable: false },
      custom: { enumerable: false },
      onError: { enumerable: false },
      onExpire: { enumerable: false },
      onPage: { enumerable: false },
      onPageNumber: { enumerable: false },
    });
  }

  get components() {
    const components = new Components({
      timeout: this.expires,
      onTimeout: this.onStop.bind(this),
      run: this.onButtonPress.bind(this),
    });
    if (!this.shouldHaveComponents || this.stopped) {
      return components;
    }

    if (this.isLarge) {
      components.createButton({
        customId: PageButtonNames.PREVIOUS_DOUBLE,
        disabled: this.page === MIN_PAGE,
        ...this.buttons[PageButtonNames.PREVIOUS_DOUBLE],
      });
    }

    components.createButton({
      customId: PageButtonNames.PREVIOUS,
      disabled: this.page === MIN_PAGE,
      ...this.buttons[PageButtonNames.PREVIOUS],
    });
    components.createButton({
      customId: PageButtonNames.NEXT,
      disabled: this.page === this.pageLimit,
      ...this.buttons[PageButtonNames.NEXT],
    });

    if (this.isLarge) {
      components.createButton({
        customId: PageButtonNames.NEXT_DOUBLE,
        disabled: this.page === this.pageLimit,
        ...this.buttons[PageButtonNames.NEXT_DOUBLE],
      });
    }

    components.createButton({
      customId: PageButtonNames.SHUFFLE,
      ...this.buttons[PageButtonNames.SHUFFLE],
    });
    components.createButton({
      customId: PageButtonNames.STOP,
      style: MessageComponentButtonStyles.DANGER,
      ...this.buttons[PageButtonNames.STOP],
    });
    return components;
  }

  get channelId(): string {
    return this.context.channelId!;
  }

  get id(): string {
    if (this.context instanceof Interaction.InteractionContext) {
      return this.context.id;
    } else if (this.context instanceof Command.Context) {
      return this.context.messageId;
    } else if (this.context instanceof Message) {
      return this.context.id;
    }
    return "";
  }

  get isEphemeral(): boolean {
    if (this._isEphemeral !== undefined) {
      return this._isEphemeral;
    }
    if (this.message) {
      return (this._isEphemeral = this.message.hasFlag(MessageFlags.EPHEMERAL));
    }
    return false;
  }

  set isEphemeral(isEphemeral: boolean) {
    this._isEphemeral = isEphemeral;
  }

  get isLarge(): boolean {
    return this.pageLimit > this.pageSkipAmount;
  }

  get message(): null | Message {
    if (this._message) {
      return this._message;
    }
    if (this.context instanceof Interaction.InteractionContext) {
      return (this._message = this.context.response);
    }
    return null;
  }

  set message(value: null | Message) {
    this._message = value;
  }

  get messageId(): string {
    return this.message ? this.message.id : "";
  }

  get shouldHaveComponents(): boolean {
    return this.pageLimit !== MIN_PAGE;
  }

  get randomPage(): number {
    if (this.pageLimit === MIN_PAGE) {
      return this.pageLimit;
    }
    if (this.pageLimit === 2) {
      return this.page === MIN_PAGE ? 2 : MIN_PAGE;
    }
    let page: number = this.page;
    while (page === this.page) {
      page = Math.ceil(Math.random() * this.pageLimit);
    }
    return page;
  }

  addPage(embed: Embed): Paginator {
    if (typeof this.onPage === "function") {
      throw new Error(
        "Cannot add a page when onPage is attached to the paginator"
      );
    }
    if (!Array.isArray(this.pages)) {
      this.pages = [];
    }
    this.pages.push(embed);
    this.pageLimit = this.pages.length;
    return this;
  }

  canInteract(userId: string): boolean {
    return this.targets.includes(userId) || this.context.client.isOwner(userId);
  }

  reset() {
    this.custom.timeout.stop();
    this.ratelimitTimeout.stop();
  }

  stop(clearButtons: boolean = true, context?: ComponentContext) {
    return this.onStop(null, clearButtons, context);
  }

  async clearCustomMessage(context?: ComponentContext): Promise<void> {
    this.custom.timeout.stop();
    if (this.custom.isActive) {
      if (this.custom.message) {
        if (!this.custom.message.deleted) {
          try {
            if (this.context instanceof Interaction.InteractionContext) {
              await this.context.deleteMessage(this.custom.message.id);
            } else {
              await this.custom.message.delete();
            }
            await this.custom.message.delete();
          } catch (error) {}
        }
        this.custom.message = null;
      }
      this.custom.isActive = false;
      await this.updateButtons(context);
    }
  }

  async getPage(page: number): Promise<Embed> {
    if (typeof this.onPage === "function") {
      return await Promise.resolve(this.onPage(this.page));
    }
    if (Array.isArray(this.pages)) {
      page -= 1;
      if (page in this.pages) {
        return this.pages[page]!;
      }
    }
    throw new Error(`Page ${page} not found`);
  }

  async setPage(page: number, context?: ComponentContext): Promise<void> {
    page = Math.max(MIN_PAGE, Math.min(page, this.pageLimit));
    if (page === this.page) {
      if (context) {
        await context.respond(InteractionCallbackTypes.DEFERRED_UPDATE_MESSAGE);
      }
      return;
    }
    this.page = page;
    const embed = await this.getPage(page);
    if (context) {
      await context.editOrRespond({
        allowedMentions: { parse: [] },
        components: this.components,
        embed,
      });
    } else if (this.context instanceof Interaction.InteractionContext) {
      await this.context.editOrRespond({
        allowedMentions: { parse: [] },
        components: this.components,
        embed,
      });
    } else if (this.message) {
      await this.message.edit({
        allowedMentions: { parse: [] },
        components: this.components,
        embed,
      });
    }
  }

  async updateButtons(context?: ComponentContext): Promise<void> {
    if (!this.stopped) {
      if (context) {
        await context.editOrRespond({
          allowedMentions: { parse: [] },
          components: this.components,
        });
      } else if (this.context instanceof Interaction.InteractionContext) {
        await this.context.editResponse({
          allowedMentions: { parse: [] },
          components: this.components,
        });
      } else if (this.message) {
        await this.message.edit({
          allowedMentions: { parse: [] },
          components: this.components,
        });
      }
    }
  }

  async onButtonPress(context: ComponentContext): Promise<void> {
    if (this.stopped) {
      await context.respond(InteractionCallbackTypes.DEFERRED_UPDATE_MESSAGE);
      return;
    }

    if (!this.canInteract(context.userId)) {
      await context.respond(InteractionCallbackTypes.DEFERRED_UPDATE_MESSAGE);
      return;
    }
    if (this.ratelimitTimeout.hasStarted) {
      await context.respond(InteractionCallbackTypes.DEFERRED_UPDATE_MESSAGE);
      return;
    }

    try {
      switch (context.customId) {
        case PageButtonNames.NEXT:
          {
            await this.setPage(this.page + 1, context);
          }
          break;
        case PageButtonNames.NEXT_DOUBLE:
          {
            if (!this.isLarge) {
              return;
            }
            await this.setPage(this.page + this.pageSkipAmount, context);
          }
          break;
        case PageButtonNames.PREVIOUS:
          {
            await this.setPage(this.page - 1, context);
          }
          break;
        case PageButtonNames.PREVIOUS_DOUBLE:
          {
            if (!this.isLarge) {
              return;
            }
            await this.setPage(this.page - this.pageSkipAmount, context);
          }
          break;
        case PageButtonNames.SHUFFLE:
          {
            await this.setPage(this.randomPage, context);
          }
          break;
        case PageButtonNames.STOP:
          {
            await this.onStop(null, true, context, true);
            if (this.context instanceof Command.Context) {
              const message = this.context.message;
              if (!message.deleted && message.canDelete) {
                try {
                  await message.delete();
                } catch (error) {}
              }
            }
          }
          break;
        default: {
          return;
        }
      }

      this.ratelimitTimeout.start(this.ratelimit, () => {});
    } catch (error) {
      if (typeof this.onError === "function") {
        await Promise.resolve(this.onError(error, this));
      }
    }
  }

  async onMessage(message: Message): Promise<void> {
    if (!this.custom.isActive || !this.canInteract(message.author.id)) {
      return;
    }
    const page = parseInt(message.content);
    if (!isNaN(page)) {
      await this.clearCustomMessage();
      await this.setPage(page);
      if (message.canDelete) {
        try {
          await message.delete();
        } catch (error) {}
      }
    }
  }

  async onStop(
    error?: any,
    clearButtons: boolean = true,
    context?: ComponentContext,
    deleteMessage?: boolean
  ) {
    this.reset();
    if (!this.stopped) {
      this.stopped = true;
      try {
        if (error) {
          if (typeof this.onError === "function") {
            await Promise.resolve(this.onError(error, this));
          }
        }
        if (typeof this.onExpire === "function") {
          await Promise.resolve(this.onExpire(this));
        }
      } catch (error) {
        if (typeof this.onError === "function") {
          await Promise.resolve(this.onError(error, this));
        }
      }

      if (deleteMessage) {
        if (this.message && !this.message.deleted) {
          try {
            if (this.context instanceof Interaction.InteractionContext) {
              await this.context.deleteMessage(this.message.id);
            } else {
              await this.message.delete();
            }
          } catch (error) {}
        }
      } else if (clearButtons) {
        if (context) {
          await context.editOrRespond({
            allowedMentions: { parse: [] },
            components: [],
            embed: await this.getPage(this.page), // temporarily here until they fix ephemeral message component clearing on button press
          });
        } else if (
          this.message &&
          !this.message.deleted &&
          this.message.components.length
        ) {
          try {
            if (this.context instanceof Interaction.InteractionContext) {
              await this.context.editMessage(this.message.id, {
                components: [],
              });
            } else {
              await this.message.edit({ components: [] });
            }
          } catch (error) {}
        }
      }
      await this.clearCustomMessage();

      this.onError = undefined;
      this.onExpire = undefined;
      this.onPage = undefined;
      this.onPageNumber = undefined;
    }
  }

  async start() {
    if (
      typeof this.onPage !== "function" &&
      !(this.pages && this.pages.length)
    ) {
      throw new Error(
        "Paginator needs an onPage function or at least one page added to it"
      );
    }

    if (
      this.isEphemeral &&
      !(this.context instanceof Interaction.InteractionContext)
    ) {
      this.isEphemeral = false;
    }

    let message: Message | null = null;
    if (this.context instanceof Interaction.InteractionContext) {
      const embed = await this.getPage(this.page);
      await this.context.editOrRespond({
        components: this.components,
        embed,
        flags: this.isEphemeral ? MessageFlags.EPHEMERAL : undefined,
      });
      message = this.message;
    } else if (this.message) {
      message = this.message;
      if (message.canEdit) {
        const embed = await this.getPage(this.page);
        message = this.message = await message.edit({
          components: this.components,
          embed,
        });
      }
    } else {
      if (!this.context.canReply) {
        throw new Error("Cannot create messages in this channel");
      }

      const embed = await this.getPage(this.page);
      if (this.context instanceof Command.Context) {
        message = this._message = await editOrReply(this.context, {
          components: this.components,
          embed,
        });
      } else {
        message = this._message = await this.context.reply({
          components: this.components,
          embed,
        });
      }
    }

    this.reset();
    if (!this.stopped && this.shouldHaveComponents) {
    }

    return message;
  }
}
