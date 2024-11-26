import classNames from "classnames";
import { FC, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { useTodoListStore } from "./Store";

interface GarbageBinProps {
  className?: string | string[];
}

export const GarbageBin: FC<GarbageBinProps> = (props) => {
  const deleteItem = useTodoListStore((state) => state.deleteItem);

  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: "list-item",
    drop(item: { id: string }) {
      deleteItem(item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    drop(ref);
  }, []);

  const cs = classNames(
    "h-200 border-2 border-black",
    "bg-orange-300",
    "leading-200 text-center text-2xl",
    "cursor-move select-none",
    isOver ? "bg-yellow-400 border-dashed" : "",
    props.className
  );

  return (
    <div ref={ref} className={cs}>
      垃圾箱
    </div>
  );
};
