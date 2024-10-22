import {
  FormEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import cs from "classnames";
import FormContext from "./FormContext";

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string;
  style?: React.CSSProperties;
  onFinish?: (values: Record<string, any>) => void;
  onFinishFailed?: (errors: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  children: React.ReactNode;
}

export interface FormRefApi {
  getFieldsValue: () => Record<string, any>;
  setFieldsValue: (values: Record<string, any>) => void;
}

const Form = forwardRef<FormRefApi, FormProps>((props, ref) => {
  const {
    className,
    style,
    onFinish,
    onFinishFailed,
    initialValues,
    children,
    ...others
  } = props;

  const [values, setValues] = useState<Record<string, any>>(
    initialValues || {}
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        getFieldsValue: () => {
          return values;
        },
        setFieldsValue: (fieldValues) => {
          setValues({ ...values, ...fieldValues });
        },
      };
    },
    []
  );

  const validatorMap = useRef(new Map<string, Function>());

  const errors = useRef<Record<string, any>>({});

  const onValueChange = (key: string, value: any) => {
    // 直接修改 不触发重新渲染
    values[key] = value;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 校验
    for (let [key, validator] of validatorMap.current) {
      if (typeof validator === "function") {
        errors.current[key] = validator();
      }
    }

    const errorList = Object.keys(errors.current)
      .map((key) => {
        return errors.current[key];
      })
      .filter(Boolean);

    if (errorList.length) {
      onFinishFailed?.(errors.current);
    } else {
      onFinish?.(values);
    }
  };

  const handleValidateRegister = (key: string, validator: Function) => {
    validatorMap.current.set(key, validator);
  };

  const classNames = cs("ant-form", className);

  return (
    <FormContext.Provider
      value={{
        onValueChange,
        values,
        setValues: (v) => setValues(v),
        validateRegister: handleValidateRegister,
      }}
    >
      <form
        {...others}
        className={classNames}
        style={style}
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
});

export default Form;
