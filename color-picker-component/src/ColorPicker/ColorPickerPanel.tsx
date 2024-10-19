import cs from "classnames";
import { ColorType } from "./interface";
import { Color } from "./color";
import Palette from "./Palette";
import { useControllableValue } from "ahooks";

export interface ColorPickerProps {
  className?: string;
  style?: React.CSSProperties;
  value?: ColorType;
  defaultValue?: ColorType;
  onChange?: (color: Color) => void;
}

function ColorPickerPanel(props: ColorPickerProps) {
  const { className, style, onChange } = props;

  const classNames = cs("color-picker", className);

  const [colorValue, setColorValue] = useControllableValue<Color>(props);

  function onPaletteColorChange(color: Color) {
    setColorValue(color);
    onChange?.(color);
  }

  return (
    <div className={classNames} style={style}>
      <Palette color={colorValue} onChange={onPaletteColorChange} />
      <div
        style={{
          marginTop: 10,
          width: 20,
          height: 20,
          background: colorValue.toRgbString(),
        }}
      ></div>
    </div>
  );
}

export default ColorPickerPanel;
