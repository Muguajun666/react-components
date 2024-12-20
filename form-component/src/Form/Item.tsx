import { ChangeEvent, useContext, useEffect, useState } from "react";
import FormContext from "./FormContext";
import React from "react";
import cs from "classnames";
import Schema from "async-validator";

export interface ItemProps {
  className?: string;
  style?: React.CSSProperties;
  label?: React.ReactNode;
  name?: string;
  valuePropName?: string;
  rules?: Array<Record<string, any>>;
  children?: React.ReactElement;
}

const getValueFromEvent = (e: ChangeEvent<HTMLInputElement>) => {
  const { target } = e;
  if (target.type === "checkbox") {
    return target.checked;
  } else if (target.type === "radio") {
    return target.value;
  }

  return target.value;
};

const Item = (props: ItemProps) => {
  const { className, style, label, name, valuePropName, rules, children } =
    props;
  if (!name) {
    return children;
  }

  const [value, setValue] = useState<number | string | boolean>();

  const [error, setError] = useState("");

  const { onValueChange, values, validateRegister } = useContext(FormContext);

  useEffect(() => {
    if (value !== values?.[name]) {
      setValue(values?.[name]);
    }
  }, [values, values?.[name]]);

  const handleValidate = (value: any) => {
    let errorMsg = null;
    if (Array.isArray(rules) && rules.length) {
      const validator = new Schema({
        [name]: rules.map((rule) => {
          return {
            type: "string",
            ...rule,
          };
        }),
      });

      validator.validate({ [name]: value }, (errors) => {
        if (errors) {
          if (errors?.length) {
            setError(errors[0].message!);
            errorMsg = errors[0].message;
          }
        } else {
          setError("");
          errorMsg = null;
        }
      });
    }
    return errorMsg;
  };

  const propsName: Record<string, any> = {};

  if (valuePropName) {
    propsName[valuePropName] = value;
  } else {
    propsName.value = value;
  }

  const childEle =
    React.Children.toArray(children).length > 1
      ? children
      : React.cloneElement(children!, {
          ...propsName,
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            const value = getValueFromEvent(e);
            setValue(value);
            onValueChange?.(name, value);

            handleValidate(value);
          },
        });

  useEffect(() => {
    validateRegister?.(name, () => handleValidate(value));
  }, [value]);

  const classNames = cs("ant-form-item", className);

  return (
    <div className={classNames} style={style}>
      <div>{label && <label>{label}</label>}</div>
      <div>
        {childEle}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
};

export default Item;
