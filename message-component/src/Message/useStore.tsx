import React from "react";
import { MessageProps, Position } from ".";

type MessageList = {
  top: MessageProps[];
  bottom: MessageProps[];
};

const initialState = {
  top: [],
  bottom: [],
};

export const useStore = (defaultPosition: Position) => {
  const [messageList, setMessageList] = React.useState<MessageList>({
    ...initialState,
  });

  const add = (messageProps: MessageProps) => {
    const id = getId(messageProps);

    setMessageList((preState) => {
      if (messageProps?.id) {
        const position = getMessagePosition(preState, messageProps.id);
        if (position) {
          return preState;
        }
      }

      const position = messageProps.position || defaultPosition;
      const isTop = position.includes("top");
      const messages = isTop
        ? [{ ...messageProps, id }, ...(preState[position] ?? [])]
        : [...(preState[position] ?? []), { ...messageProps, id }];

      return {
        ...preState,
        [position]: messages,
      }
    });

    return id;
  };

  const update = (id: number, messageProps: MessageProps) => {
    if(!id) return

    setMessageList((preState) => {
      const nextState = { ...preState };
      const { position, index } = findMessage(nextState, id);
    })
  };

  const remove = (id: number) => {};

  const clearAll = () => {};

  return {
    messageList,
    add,
    update,
    remove,
    clearAll,
  };
};

let count = 0;

export const getId = (messageProps: MessageProps) => {
  if (messageProps.id) {
    return messageProps.id;
  }
  return ++count;
};

export const getMessagePosition = (messageList: MessageList, id: number) => {
  for (const [position, list] of Object.entries(messageList)) {
    if (list.find((item) => item.id === id)) {
      return position as Position;
    }
  }
};

export const findMessage = (messageList: MessageList, id: number) => {
  
}
