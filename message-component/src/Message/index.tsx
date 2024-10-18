import { forwardRef, FC, useEffect, useMemo, useImperativeHandle } from "react";
import { useStore } from "./useStore";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./index.scss";
import { createPortal } from "react-dom";
import { useTimer } from "./useTimer";

export type Position = "top" | "bottom";

export interface MessageProps {
  style?: React.CSSProperties;
  position?: Position;
  className?: string | string[];
  content?: React.ReactNode;
  duration?: number;
  id?: number;
  onClose?: (...args: any) => void;
}

const MessageItem: FC<MessageProps> = (item) => {
  const { onMouseEnter, onMouseLeave } = useTimer({
    id: item.id!,
    duration: item.duration,
    remove: item.onClose!,
  });
  return (
    <div
      className="message-item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {item.content}
    </div>
  );
};

export interface MessageRef {
  add: (messageProps: MessageProps) => number;
  remove: (id: number) => void;
  update: (id: number, messageProps: MessageProps) => void;
  clearAll: () => void;
}

export const MessageProvider = forwardRef<MessageRef, {}>((props, ref) => {
  const { messageList, add, update, remove, clearAll } = useStore("top");

  // 在调用后才开始的赋值暴露给外部 时机不对
  // useImperativeHandle(
  //   ref,
  //   () => {
  //     return {
  //       add,
  //       remove,
  //       update,
  //       clearAll,
  //     };
  //   },
  //   []
  // );

  if ("current" in ref!) {
    ref.current = {
      add,
      update,
      remove,
      clearAll,
    };
  }

  const positions = Object.keys(messageList) as Position[];

  const messageWrapper = (
    <div className="message-wrapper">
      {positions.map((position) => {
        return (
          <TransitionGroup
            className={`message-wrapper-${position}`}
            key={position}
          >
            {messageList[position].map((item) => {
              return (
                <CSSTransition
                  key={item.id}
                  timeout={1000}
                  classNames="message"
                >
                  <MessageItem onClose={remove} {...item}></MessageItem>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        );
      })}
    </div>
  );

  const el = useMemo(() => {
    const el = document.createElement("div");
    el.className = "wrapper";

    document.body.appendChild(el);
    return el;
  }, []);

  return createPortal(messageWrapper, el);
});
