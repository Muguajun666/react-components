import { TooltipPlacement } from "antd/es/tooltip";
import "./index.scss";
import { FC, useEffect, useState } from "react";
import { Button, Popover } from "antd";
import { Mask } from "./Mask";
import { createPortal } from "react-dom";

export interface OnBoardingStepConfig {
  selector: () => HTMLElement | null;
  placement?: TooltipPlacement;
  renderContent?: (currentStep: number) => React.ReactNode;
  beforeForward?: (currentStep: number) => void;
  beforeBack?: (currentStep: number) => void;
}

export interface OnBoardingProps {
  step?: number;
  steps: OnBoardingStepConfig[];
  getContainer?: () => HTMLElement;
  onStepsEnd?: () => void;
}

export const OnBoarding: FC<OnBoardingProps> = (props) => {
  const { steps, step = 0, getContainer, onStepsEnd } = props;

  const [currentStep, setCurrentStep] = useState<number>(0);

  const [done, setDone] = useState<boolean>(false);

  const [isMaskMoving, setIsMaskMoving] = useState<boolean>(false);

  const currentSelectedElement = steps[currentStep]?.selector?.();

  const currentContainerElement = getContainer?.() || document.documentElement;

  const getCurrentStep = () => {
    return steps[currentStep];
  };

  const back = async () => {
    if (currentStep === 0) return;

    const { beforeBack } = getCurrentStep();
    await beforeBack?.(currentStep);
    setCurrentStep(currentStep - 1);
  };

  const forward = async () => {
    if (currentStep === steps.length - 1) {
      await onStepsEnd?.();
      setDone(true);
      return;
    }

    const { beforeForward } = getCurrentStep();
    await beforeForward?.(currentStep);
    setCurrentStep(currentStep + 1);
  };

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  const renderPopover = (wrapper: React.ReactNode) => {
    const config = getCurrentStep();

    if (!config) return wrapper;

    const { renderContent } = config;

    const content = renderContent ? renderContent(currentStep) : null;

    const operation = (
      <div className={"onboarding-operation"}>
        {currentStep !== 0 && (
          <Button className={"back"} onClick={back}>
            {"上一步"}
          </Button>
        )}
        <Button className={"forward"} type={"primary"} onClick={forward}>
          {currentStep === steps.length - 1 ? "我知道了" : "下一步"}
        </Button>
      </div>
    );

    return isMaskMoving ? (
      wrapper
    ) : (
      <Popover
        content={
          <div>
            {content}
            {operation}
          </div>
        }
        open={true}
        placement={getCurrentStep()?.placement}
      >
        {wrapper}
      </Popover>
    );
  };

  const [, setRenderTick] = useState<number>(0);

  useEffect(() => {
    setRenderTick(1);
  }, []);

  if (!currentSelectedElement || done) return null;

  const mask = (
    <Mask
      container={currentContainerElement}
      element={currentSelectedElement}
      renderMaskContent={(wrapper) => renderPopover(wrapper)}
      onAnimationStart={() => setIsMaskMoving(true)}
      onAnimationEnd={() => setIsMaskMoving(false)}
    />
  );

  return createPortal(mask, currentContainerElement);
};
