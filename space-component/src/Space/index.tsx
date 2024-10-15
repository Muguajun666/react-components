import React, { Fragment } from "react";
import cs from "classnames";
import "./index.scss";
import { ConfigContext } from "./ConfigProvider";

export type SizeType = "small" | "middle" | "large" | number | undefined;

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: React.CSSProperties;
  size?: SizeType | [SizeType, SizeType];
  direction?: "horizontal" | "vertical";
  align?: "start" | "end" | "center" | "baseline";
  split?: React.ReactNode;
  wrap?: boolean;
}

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

function getNumberSize(size: SizeType) {
  return typeof size === "string" ? spaceSize[size] : size || 0;
}

const Space: React.FC<SpaceProps> = (props) => {

  const { space } = React.useContext(ConfigContext)

  const {
    className,
    size = space?.size || "small",
    direction = "horizontal",
    style,
    children,
    align,
    split,
    wrap = false,
    ...rest
  } = props;

  const childNodes = React.Children.toArray(props.children);

  const mergedAlign =
    direction === "horizontal" && align === undefined ? "center" : align;

  const cn = cs(
    "space",
    `space-${direction}`,
    { [`space-align-${mergedAlign}`]: mergedAlign },
    className
  );

  const nodes = childNodes.map((child: any, index) => {
    const key = (child && child.key) || `space-item-${index}`;
    return (
      <Fragment key={key}>
        <div className="space-item">
          {child}
        </div>
        {index < childNodes.length - 1 && split && (
          <span className={`${className}-split`} style={style}>
            {split}
          </span>
        )}
      </Fragment>
    );
  });

  const otherStyles: React.CSSProperties = {};

  const [horizontalSize, verticalSize] = React.useMemo(() => {
    return (
      (Array.isArray(size) ? size : [size, size]) as [SizeType, SizeType]
    ).map((item) => getNumberSize(item));
  }, [size]);

  otherStyles.columnGap = horizontalSize;
  otherStyles.rowGap = verticalSize;

  if (wrap) {
    otherStyles.flexWrap = "wrap";
  }

  return (
    <div className={cn} style={{ ...style, ...otherStyles }} {...rest}>
      {nodes}
    </div>
  );
};

export default Space;
