import { useState } from "react";
import { ComponentEvent } from "../../stores/component-config";
import { Modal, Segmented } from "antd";
import GoToLink, { GoToLinkConfig } from "./actions/GoToLink";
import ShowMessage, { ShowMessageConfig } from "./actions/ShowMessage";
import CustomJS, { CustomJSConfig } from "./actions/CustomJS";

interface ActionModalProps {
  visible: boolean;
  eventConfig: ComponentEvent;
  handleOk: (config?: ActionConfig) => void;
  handleCancel: () => void;
}

export type ActionConfig = GoToLinkConfig | ShowMessageConfig | CustomJSConfig;

export const ActionModal = (props: ActionModalProps) => {
  const { visible, eventConfig, handleOk, handleCancel } = props;

  const [key, setKey] = useState<string>("访问链接");
  const [curConfig, setCurConfig] = useState<ActionConfig>();

  return (
    <Modal
      title="事件动作配置"
      width={800}
      open={visible}
      okText="添加"
      cancelText="取消"
      onOk={() => handleOk(curConfig)}
      onCancel={handleCancel}
    >
      <div className="h-[500px]">
        <Segmented
          value={key}
          onChange={setKey}
          block
          options={["访问链接", "消息提示", "自定义 JS"]}
        />
        {key === "访问链接" && (
          <GoToLink
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
        {key === "消息提示" && (
          <ShowMessage
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
        {key === "自定义 JS" && (
          <CustomJS
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
      </div>
    </Modal>
  );
};
