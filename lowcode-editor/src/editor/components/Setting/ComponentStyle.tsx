import { Form, Input, InputNumber, Select } from "antd";
import { useComponentsStore } from "../../stores/components";
import {
  ComponentSetter,
  useComponentConfigStore,
} from "../../stores/component-config";
import { CSSProperties, useEffect, useState } from "react";
import CssEditor from "./CssEditor";
import { debounce } from "lodash-es";
import StyleToObject from "style-to-object";

export function ComponentStyle() {
  const [form] = Form.useForm();

  const [css, setCss] = useState<string>(".comp{\n\n}");

  const { curComponentId, curComponent, updateComponentStyles } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    form.resetFields();

    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent?.styles });

    setCss(toCSSStr(curComponent?.styles!));
  }, [curComponent]);

  const toCSSStr = (css: Record<string, any>) => {
    let str = `.comp {\n`;

    for (const key in css) {
      let value = css[key];
      if (!value) continue;
      if (
        ["width", "height"].includes(key) &&
        !value.toString().includes("px")
      ) {
        value = `${value}px`;
      }
      str += `\t${key}: ${value};\n`;
    }
    str += `}`;

    return str;
  };

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

    let css: Record<string, any> = {};

    try {
      const cssStr = value
        .replace(/\/\*.*\*\//, "") // 去除注释/** */
        .replace(/(\.?[^{]+{)/, "") // 去除.comp {
        .replace("}", ""); // 去除 }

      StyleToObject(cssStr, (name, value) => {
        css[
          name.replace(/-\w/, (item) => item.toUpperCase().replace("-", ""))
        ] = value;
      });

      console.log(css);
      updateComponentStyles(
        curComponentId,
        { ...form.getFieldsValue(), ...css },
        true
      );
    } catch (e) {}
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
        <CssEditor value={css} onChange={handleEditorChange} />
      </div>
    </Form>
  );
}
