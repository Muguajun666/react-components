import React, { FC, PropsWithChildren, useEffect, useRef } from "react";
import { useTransition, animated } from "@react-spring/web";
import Overlay from "./Overlay";
import classNames from "classnames";

const DURATION = 300;

interface SlideInOverlayProps extends PropsWithChildren {
  isVisible: boolean;
  from?: "right" | "bottom";
  className?: string | string[];
  style?: React.CSSProperties;
  onEnter?: () => void;
  onExit?: () => void;
}

const SlideInOverlay: FC<SlideInOverlayProps> = (props) => {
  const {
    isVisible,
    from = "right",
    children,
    className,
    onEnter,
    onExit,
  } = props;

  const x = React.useMemo(
    () => (from === "right" ? window.screen.width : window.screen.height),
    [from]
  );

  useEffect(() => {
    let timer: any = null;

    if (isVisible && onEnter != null) {
      timer = setTimeout(onEnter, DURATION);
    }

    return () => {
      if (timer != null) {
        clearTimeout(timer);
      }
    };
  }, [isVisible, onEnter]);

  const visibleRef = useRef(isVisible)

  useEffect(() => {
    let timer: any = null;

    if (!isVisible && visibleRef.current && onExit != null) {
      timer = setTimeout(onExit, DURATION);
    }

    visibleRef.current = isVisible;

    return () => {
      if (timer != null) {
        clearTimeout(timer);
      }
    };
  }, [isVisible, onExit]);


  const transitions = useTransition(isVisible, {
    x,
    opacity: 1,
    from: {
      x,
      opacity: 1,
    },
    enter: { x: 0, opacity: 1 },
    leave: { x, opacity: 0 },
    config: { duration: DURATION },
  });

  const translate = React.useCallback(
    (x: number) => {
      switch (from) {
        case "right":
          return `translateX(${x}px)`;
        case "bottom":
          return `translateY(${x}px)`;
      }
    },
    [from]
  );

  return (
    <>
      {transitions(
        (props, isVisible) =>
          isVisible && (
            <Overlay
              as={animated.div}
              className={classNames(className)}
              style={{
                transform: props.x.to((x) => (x === 0 ? "none" : translate(x))),
                opacity: props.opacity,
              }}
            >
              {children}
            </Overlay>
          )
      )}
    </>
  );
};

export { SlideInOverlay, DURATION };
