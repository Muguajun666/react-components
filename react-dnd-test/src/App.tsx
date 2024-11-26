import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useDrag, useDragLayer, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

interface ItemType {
  color: string;
}

interface BoxProps {
  color: string;
}

const DragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging) {
    return null;
  }
  return (
    <div
      className="drag-layer"
      style={{
        left: currentOffset?.x,
        top: currentOffset?.y,
      }}
    >
      {item.color} 拖拖拖
    </div>
  );
};

function Box(props: BoxProps) {
  const ref = useRef(null);
  const [{ dragging }, drag, dragPreview] = useDrag({
    type: "box",
    item: {
      color: props.color,
    },
    collect: (monitor) => ({
      dragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    drag(ref);
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <div
      ref={ref}
      className={dragging ? "box dragging" : "box"}
      style={{ backgroundColor: props.color || "black" }}
    ></div>
  );
}

function Container() {
  const [boxes, setBoxes] = useState<ItemType[]>([]);
  const ref = useRef(null);

  const [, drop] = useDrop(() => {
    return {
      accept: "box",
      drop(item: ItemType) {
        setBoxes((boxes) => [...boxes, item]);
      },
    };
  });

  useEffect(() => {
    drop(ref);
  }, []);

  return (
    <div ref={ref} className="container">
      {boxes.map((box, index) => {
        return <Box key={index} color={box.color}></Box>;
      })}
    </div>
  );
}

function App() {
  return (
    <div>
      <Container></Container>
      <Box color="red"></Box>
      <Box color="blue"></Box>
      <Box color="black"></Box>
      <DragLayer></DragLayer>
    </div>
  );
}

export default App;
