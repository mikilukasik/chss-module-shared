import { Conversations, MessageHandlers, OnHandlers } from "../apiTypes.js";
import { getDoMessageHandler } from "./getDoMessageHandler.js";
import { getResponseMessageHandler } from "./getResponseMessageHandler.js";

export const getMessageHandlers = ({
  conversations,
  onHandlers,
  worker,
  parentPort,
}: {
  conversations: Conversations;
  onHandlers: OnHandlers;
  worker?: any;
  parentPort?: any;
}): MessageHandlers => ({
  do: getDoMessageHandler({ onHandlers, worker: worker || parentPort }),

  answer: getResponseMessageHandler({
    handlerKey: "resolve",
    conversations: conversations,
  }),

  error: getResponseMessageHandler({
    handlerKey: "reject",
    conversations: conversations,
  }),
});
