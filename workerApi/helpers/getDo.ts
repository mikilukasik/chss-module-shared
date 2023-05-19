import { getRandomId } from "../../utils/getRandomId.js";
import { Conversations } from "../apiTypes.js";

export const getDo =
  ({ conversations, worker }: { conversations: Conversations; worker?: any }) =>
  (command: string, data?: Record<string, any>) => {
    return new Promise((resolve, reject) => {
      const id = getRandomId();
      const conversation = {
        id,
        resolve,
        reject,
      };

      conversations[conversation.id] = conversation;

      const payload = { type: "do", id, command, data };

      if (worker) {
        worker.postMessage(payload);
        return;
      }

      postMessage(payload);
    });
  };
