import cs from "classnames";
import { ColorType } from "./interface";
import { Color } from "./color";
import { useState } from "react";
import Palette from "./Palette";

export interface ColorPickerProps {
  className?: string;
  style?: React.CSSProperties;
  value?: ColorType;
  onChange?: (color: Color) => void;
}

function ColorPickerPanel(props: ColorPickerProps) {
  const { className, style, value, onChange } = props;

  const classNames = cs("color-picker", className);

  const [colorValue, setColorValue] = useState<Color>(() => {
    if (value instanceof Color) {
      return value;
    }
    return new Color(value);
  });

  return (
    <div className={classNames} style={style}>
      <Palette color={colorValue} />
    </div>
  );
}

export default ColorPickerPanel;
