import TextArea from "antd/es/input/TextArea";
import { useComponentsStore } from "../../../stores/components";
import { useEffect, useState } from "react";

export interface GoToLinkConfig {
  type: "goToLink";
  url: string;
}
export interface GoToLinkProps {
  value?: string;
  defaultValue?: string;
  onChange?: (config: GoToLinkConfig) => void;
}

const GoToLink = (props: GoToLinkProps) => {
  const { value: val, defaultValue, onChange } = props;

  const { curComponentId } = useComponentsStore();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(val);
  }, [val]);

  const urlChange = (value: string) => {
    if (!curComponentId) return;

    setValue(value);

    onChange?.({
      type: "goToLink",
      url: value,
    });
  };

  return (
    <div className="mt-[40px]">
      <div className="flex items-center gap-[10px]">
        <div>跳转链接</div>
        <div>
          <TextArea
            style={{ height: 200, width: 500, border: "1px solid #000" }}
            onChange={(e) => {
              urlChange(e.target.value);
            }}
            value={value || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default GoToLink;
