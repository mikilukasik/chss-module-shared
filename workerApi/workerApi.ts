import { Conversations, MessageHandlers, OnHandlers } from "./apiTypes.js";
import { getDo } from "./helpers/getDo.js";
import { getOn } from "./helpers/getOn.js";
import { getMessageHandlers } from "./helpers/getMessageHandlers.js";
import { setOnmessage } from "./helpers/setOnmessage.js";

export class WorkerApi {
  private conversations: Conversations = {};
  private onHandlers: OnHandlers = {};
  private messageHandlers: MessageHandlers;
  public worker;
  public parentPort;

  public do;
  public on;

  constructor({
    worker,
    parentPort,
    nodeWorker,
  }: {
    worker?: any;
    nodeWorker?: any;
    parentPort?: any;
  } = {}) {
    this.messageHandlers = getMessageHandlers({
      conversations: this.conversations,
      onHandlers: this.onHandlers,
      worker,
      parentPort,
    });

    setOnmessage({
      messageHandlers: this.messageHandlers,
      worker,
      nodeWorker,
      parentPort,
    });

    this.do = getDo({
      conversations: this.conversations,
      worker: worker || nodeWorker || parentPort,
    });
    this.on = getOn({ onHandlers: this.onHandlers });

    this.worker = worker || nodeWorker || null;
    this.parentPort = parentPort || null;
  }
}
