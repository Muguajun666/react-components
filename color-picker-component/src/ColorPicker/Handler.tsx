import cs from "classnames";
import { FC } from "react";

type HandlerSize = "default" | "small";

interface HandlerProps {
  size?: HandlerSize;
  color?: string;
}

const Handler: FC<HandlerProps> = ({ size = "default", color }) => {
  const classNames = cs("color-picker-panel-palette-handler", {
    [`color-picker-panel-palette-handler-sm`]: size === "small",
  });

  return <div className={classNames} style={{backgroundColor: color}}></div>;
};

export default Handler;
