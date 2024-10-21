import { CSSProperties, FC, useEffect, useState } from "react";
import { getMaskStyle } from "./getMaskStyle";

interface MaskProps {
  element: HTMLElement;
  container?: HTMLElement;
  renderMaskContent?: (wrapper: React.ReactNode) => React.ReactNode;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}

export const Mask: FC<MaskProps> = (props) => {
  const { element, container, renderMaskContent, onAnimationStart, onAnimationEnd } = props;

  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    onAnimationStart?.();
    const timer = setTimeout(() => {
      onAnimationEnd?.();
    }, 200)
    return () => {
      clearTimeout(timer);
    }
  }, [element])

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const style = getMaskStyle(
        element,
        container || document.documentElement
      );

      setStyle(style);
    });
    observer.observe(container || document.documentElement);
  }, []);

  useEffect(() => {
    if (!element) {
      return ;
    }

    element.scrollIntoView({
      block: "center",
      inline: "center",
    });

    const style = getMaskStyle(element, container || document.documentElement);

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
