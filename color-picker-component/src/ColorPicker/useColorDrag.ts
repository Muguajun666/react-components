import { useEffect, useRef, useState } from "react";
import { TransformOffset } from "./Transform";
import { Color } from "./color";

type EventType = MouseEvent | React.MouseEvent<Element, MouseEvent>;

type EventHandle = (e: EventType) => void;

interface useColorDragProps {
  offset?: TransformOffset;
  color?: Color;
  containerRef: React.RefObject<HTMLDivElement>;
  targetRef: React.RefObject<HTMLDivElement>;
  direction?: "x" | "y";
  onDragChange?: (offset: TransformOffset) => void;
  calculate?: () => TransformOffset;
}

function useColorDrag(
  props: useColorDragProps
): [TransformOffset, EventHandle] {
  const {
    offset,
    color,
    containerRef,
    targetRef,
    direction,
    onDragChange,
    calculate,
  } = props;

  const [offsetValue, setOffsetValue] = useState(offset || { x: 0, y: 0 });

  const dragRef = useRef({ drag: false });

  useEffect(() => {
    if (dragRef.current.drag === false) {
      const calcOffset = calculate?.();
      if (calcOffset) {
        setOffsetValue(calcOffset);
      }
    }
  }, [color]);

  useEffect(() => {
    document.removeEventListener("mouseup", onDragStop);
    document.removeEventListener("mousemove", onDragMove);
  }, []);

  const updateOffset: EventHandle = (e) => {
    const scrollXOffset =
      document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollYOffset =
      document.documentElement.scrollTop || document.body.scrollTop;

    const pageX = e.pageX - scrollXOffset;
    const pageY = e.pageY - scrollYOffset;

    const {
      x: rectX,
      y: rectY,
      width,
      height,
    } = containerRef.current!.getBoundingClientRect();

    const { width: targetWidth, height: targetHeight } =
      targetRef.current!.getBoundingClientRect();

    const centerOffsetX = targetWidth / 2;
    const centerOffsetY = targetHeight / 2;

    const offsetX = Math.max(0, Math.min(pageX - rectX, width)) - centerOffsetX;
    const offsetY =
      Math.max(0, Math.min(pageY - rectY, height)) - centerOffsetY;

    const calcOffset = {
      x: offsetX,
      y: direction === "x" ? offsetValue.y : offsetY,
    };

    setOffsetValue(calcOffset);
    onDragChange?.(calcOffset);
  };

  const onDragStart: EventHandle = (e) => {
    document.addEventListener("mouseup", onDragStop);
    document.addEventListener("mousemove", onDragMove);

    onDragMove(e);

    dragRef.current.drag = true;
  };

  const onDragMove: EventHandle = (e) => {
    e.preventDefault();
    updateOffset(e);
  };

  const onDragStop: EventHandle = (e) => {
    document.removeEventListener("mouseup", onDragStop);
    document.removeEventListener("mousemove", onDragMove);

    dragRef.current.drag = false;
  };

  return [offsetValue, onDragStart];
}

export default useColorDrag;
