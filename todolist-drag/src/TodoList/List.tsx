import classNames from "classnames";
import { FC, Fragment, useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Gap } from "./Gap";
import { Item } from "./Item";
import { useTodoListStore } from "./Store";
import { animated, useTransition } from "@react-spring/web";

interface ListProps {
  className?: string | string[];
}

export const List: FC<ListProps> = (props) => {
  const list = useTodoListStore((state) => state.list);

  const cs = classNames("h-full p-10", props.className);

  const transitions = useTransition(list, {
    from: { transform: "translate3d(100%,0,0)", opacity: 0 },
    enter: { transform: "translate3d(0%,0,0)", opacity: 1 },
    leave: { transform: "translate3d(-100%,0,0)", opacity: 0 },
    keys: list.map((item) => item.id),
  });

  return (
    <div className={cs}>
      {list.length > 0
        ? transitions((style, item) => {
            return (
              <animated.div style={style}>
                <Gap id={item.id} />
                <Item data={item} />
              </animated.div>
            );
          })
        : "暂无代办事项"}
      <Gap />
    </div>
  );
};
