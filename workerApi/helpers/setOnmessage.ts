import { MessageHandlers, MessagePayload } from "../apiTypes";

export const setOnmessage = ({
  messageHandlers,
  worker,
  nodeWorker,
  parentPort,
}: {
  messageHandlers: MessageHandlers;
  worker?: any;
  nodeWorker?: any;
  parentPort?: any;
}) => {
  const messageHandler = ({ data }: { data: MessagePayload }) => {
    const { type } = data as { type: string };
    messageHandlers[type](data);
  };

  if (worker) {
    worker.onmessage = messageHandler;
    return;
  }

  if (nodeWorker) {
    nodeWorker.on("message", (data: any) => messageHandler({ data }));
    return;
  }

  if (parentPort) {
    parentPort.addListener("message", (data: any) => messageHandler({ data }));
    return;
  }

  onmessage = messageHandler;
};
