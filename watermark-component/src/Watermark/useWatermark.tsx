import { useEffect, useRef, useState } from "react";
import { WatermarkProps } from ".";
import { merge, isNumber } from "lodash-es";

export type WatermarkOptions = Omit<
  WatermarkProps,
  "className" | "style" | "children"
>;

const toNumber = (value?: string | number, defaultValue?: number) => {
  if (!value) {
    return defaultValue;
  }
  if (isNumber(value)) {
    return value;
  }
  const numberVal = parseFloat(value);
  return isNumber(numberVal) ? numberVal : defaultValue;
};

const defaultOptions = {
  rotate: -20,
  zIndex: 1,
  width: 100,
  gap: [100, 100],
  fontStyle: {
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.15)",
    fontFamily: "sans-serif",
    fontWeight: "normal",
  },
  getContainer: () => document.body,
};

const getMergedOptions = (o: Partial<WatermarkOptions>) => {
  const options = o || {};

  const mergedOptions = {
    ...options,
    rotate: options.rotate || defaultOptions.rotate,
    zIndex: options.zIndex || defaultOptions.zIndex,
    fontStyle: { ...defaultOptions.fontStyle, ...options.fontStyle },
    width: toNumber(
      options.width,
      options.image ? defaultOptions.width : undefined
    ),
    height: toNumber(options.height, undefined),
    getContainer: options.getContainer,
    gap: [
      toNumber(options.gap?.[0], defaultOptions.gap[0]),
      toNumber(options.gap?.[1] || options.gap?.[0], defaultOptions.gap[1]),
    ],
  } as Required<WatermarkOptions>;

  const mergedOffsetX = toNumber(mergedOptions.offset?.[0], 0)!;
  const mergedOffsetY = toNumber(
    mergedOptions.offset?.[1] || mergedOptions.offset?.[0],
    0
  )!;
  mergedOptions.offset = [mergedOffsetX, mergedOffsetY];

  return mergedOptions;
};

const getCanvasData = async (
  options: Required<WatermarkOptions>
): Promise<{ width: number; height: number; base64Url: string }> => {
  const { image, rotate, fontStyle, gap, content } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio;

  const configCanvas = (size: { width: number; height: number }) => {
    const canvasWidth = gap[0] + size.width;
    const canvasHeight = gap[1] + size.height;

    canvas.setAttribute("width", `${canvasWidth * ratio}px`);
    canvas.setAttribute("height", `${canvasHeight * ratio}px`);

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx?.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2);
    ctx?.scale(ratio, ratio);

    const RotateAngle = (rotate * Math.PI) / 180;
    ctx?.rotate(RotateAngle);
  };

  const drawText = () => {
    const { fontFamily, fontSize, color, fontWeight } = fontStyle;
    const realFontSize = toNumber(fontSize, 0) || fontStyle.fontSize;

    ctx!.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
    const;
  };

  function drawImage() {
    return new Promise<{ width: number; height: number; base64Url: string }>(
      (resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.referrerPolicy = "no-referrer";

        img.src = image;
        img.onload = () => {
          let { width, height } = options;
          if (!width || !height) {
            if (width) {
              height = (img.height / img.width) * +width;
            } else {
              width = (img.width / img.height) * +height;
            }
          }
          configCanvas({ width, height });
          ctx?.drawImage(img, -width / 2, -height / 2, width, height);
          return resolve({
            width,
            height,
            base64Url: canvas.toDataURL(),
          });
        };
        img.onerror = () => {
          return drawText();
        };
      }
    );
  }

  return image ? drawImage() : drawText();
};

export default function useWatermark(params: WatermarkOptions) {
  const [options, setOptions] = useState(params || {});

  const mergedOptions = getMergedOptions(options);
  const watermarkDiv = useRef<HTMLDivElement>();

  const container = mergedOptions.getContainer!();
  const { zIndex, gap } = mergedOptions;

  function drawWatermark() {
    if (!container) {
      return;
    }

    getCanvasData(mergedOptions).then(({ width, height, base64Url }) => {
      const wmStyle = `
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        pointer-events: none;
        z-index: ${zIndex};
        background-position: 0 0;
        background-size: ${gap[0] + width}px ${gap[1] + height}px;
        background-repeat: repeat;
        background-image: url(${base64Url});
      `;

      if (!watermarkDiv.current) {
        const div = document.createElement("div");
        watermarkDiv.current = div;
        container.appendChild(div);
        container.style.position = "relative";
      }

      watermarkDiv.current?.setAttribute("style", wmStyle.trim());
    });
  }

  useEffect(() => {
    drawWatermark();
  }, [options]);

  function generateWatermark(newOptions: Partial<WatermarkOptions>) {
    setOptions(merge({}, options, newOptions));
  }

  function destroy() {}

  return {
    generateWatermark,
    destroy,
  };
}
