import { Form, Input, InputNumber, Select } from "antd";
import { useComponentsStore } from "../../stores/components";
import {
  ComponentSetter,
  useComponentConfigStore,
} from "../../stores/component-config";
import { CSSProperties, useEffect, useState } from "react";
import CssEditor from "./CssEditor";
import { debounce } from "lodash-es";

export function ComponentStyle() {
  const [form] = Form.useForm();

  const [css, setCss] = useState("");

  const { curComponentId, curComponent, updateComponentStyles } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent?.styles });
  }, [curComponent]);

  if (!curComponentId || !curComponent) return null;

  const renderFormElement = (setting: ComponentSetter) => {
    const { type, options } = setting;

    if (type === "select") {
      return <Select options={options} />;
    } else if (type === "input") {
      return <Input />;
    } else if (type === "inputNumber") {
      return <InputNumber />;
    }
  };

  const valueChange = (changeValues: CSSProperties) => {
    if (curComponentId) {
      updateComponentStyles(curComponentId, changeValues);
    }
  };

  const handleEditorChange = debounce((value) => {
    setCss(value);
  }, 500);

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      {componentConfig[curComponent.name]?.stylesSetter?.map((setter) => (
        <Form.Item key={setter.name} name={setter.name} label={setter.label}>
          {renderFormElement(setter)}
        </Form.Item>
      ))}
      <div className="h-[200px] border-[1px] border-[#ccc]">
        <CssEditor value={`.comp{\n\n}`} onChange={handleEditorChange} />
      </div>
    </Form>
  );
}
