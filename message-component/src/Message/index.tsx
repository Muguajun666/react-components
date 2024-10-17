import { FC, useEffect, useMemo } from "react";
import { useStore } from "./useStore";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./index.scss";
import { createPortal } from "react-dom";

export type Position = "top" | "bottom";

export interface MessageProps {
  style?: React.CSSProperties;
  position?: Position;
  className?: string | string[];
  content?: React.ReactNode;
  duration?: number;
  id?: number;
}

export const MessageProvider: FC<{}> = (props) => {
  const { messageList, add, update, remove, clearAll } = useStore("top");

  useEffect(() => {
    setInterval(() => {
      add({
        content: "hello world",
      });
    }, 1000);
  }, []);

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
                  <div className="message-item">{item.content}</div>
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
};
