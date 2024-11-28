import { useContext, useEffect, useRef, useState } from "react";
import { PlaygroundContext } from "../../PlaygroundContext";
// import { compile } from "./compiler.worker";
import iframeRaw from "./iframe.html?raw";
import { IMPORT_MAP_FILE_NAME } from "../../files";
import { Message } from "../Message";
import CompilerWorker from "./compiler.worker?worker";
import { debounce } from "lodash-es";

interface MessageData {
  data: {
    type: string;
    message: string;
  };
}

export default function Preview() {
  const { files } = useContext(PlaygroundContext);

  const [compiledCode, setCompiledCode] = useState("");

  const compilerWorkerRef = useRef<Worker>();

  useEffect(() => {
    if (!compilerWorkerRef.current) {
      compilerWorkerRef.current = new CompilerWorker();
      compilerWorkerRef.current.addEventListener("message", ({ data }) => {
        console.log("worker", data);
        if (data.type === "COMPILED_CODE") {
          setCompiledCode(data.data);
        } else {
          console.log("error", data);
        }
      });
    }
  }, []);

  useEffect(
    debounce(() => {
      compilerWorkerRef.current?.postMessage(files);
    }, 500),
    [files]
  );

  const getIframeUrl = () => {
    console.log(files);
    const res = iframeRaw
      .replace(
        '<script type="importmap"></script>',
        `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`
      )
      .replace(
        '<script type="module" id="appSrc"></script>',
        `<script type="module" id="appSrc">${compiledCode}</script>`
      );
    return URL.createObjectURL(new Blob([res], { type: "text/html" }));
  };

  useEffect(() => {
    setIframeUrl(getIframeUrl());
  }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode]);

  const [iframeUrl, setIframeUrl] = useState(getIframeUrl());

  const [error, setError] = useState("");

  const handleMessage = (msg: MessageData) => {
    const { type, message } = msg.data;
    if (type === "ERROR") {
      setError(message);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <iframe
        src={iframeUrl}
        style={{ height: "100%", width: "100%", padding: 0, border: "none" }}
      />
      <Message type="error" content={error} />
    </div>
  );
}
