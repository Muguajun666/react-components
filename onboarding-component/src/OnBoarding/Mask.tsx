import { CSSProperties, FC, useEffect, useState } from "react";
import { getMaskStyle } from "./getMaskStyle";

interface MaskProps {
  element: HTMLElement;
  container?: HTMLElement;
  renderMaskContent?: (wrapper: React.ReactNode) => React.ReactNode;
}

export const Mask: FC<MaskProps> = (props) => {
  const { element, container, renderMaskContent } = props;

  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    if (!element) return;

    element.scrollIntoView({
      block: "center",
      inline: "center",
    });

    const style = getMaskStyle(element, container || document.documentElement);

    console.log({ style });

    setStyle(style);
  }, [element, container]);

  const getContent = () => {
    if (!renderMaskContent) return null;

    return renderMaskContent(
      <div
        className={"mask-content"}
        style={{ width: "100%", height: "100%" }}
      />
    );
  };

  return (
    <div style={style} className="mask">
      {getContent()}
    </div>
  );
};
