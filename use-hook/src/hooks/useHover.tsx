import { cloneElement, useState } from "react";

export type Element =
  | ((state: boolean) => React.ReactElement)
  | React.ReactElement;

export default function useHover(element: Element) {

  const [state, setState] = useState<boolean>(false)

  const onMouseEnter = (originalOnMouseEnter?: any) => (event: any) => {
    originalOnMouseEnter?.(event)
    setState(true)
  }

  const onMouseLeave = (originalOnMouseLeave?: any) => (event: any) => {
    originalOnMouseLeave?.(event)
    setState(false)
  }

  if (typeof element === "function") {
    element = element(state)
  }

  const el = cloneElement(element, {
    onMouseEnter: onMouseEnter(element.props?.onMouseEnter),
    onMouseLeave: onMouseLeave(element.props?.onMouseLeave)
  })

  return [el, state]
}
