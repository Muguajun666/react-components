import FileNameList from "./FileNameList";
import Editor from "./Editor";
import { useContext } from "react";
import { PlaygroundContext } from "../PlaygroundContext";
import { debounce } from "lodash-es";

export default function CodeEditor() {
  const { theme, files, setFiles, selectedFileName, setSelectedFileName } =
    useContext(PlaygroundContext);

  const file = files[selectedFileName];

  const onEditorChange = (value?: string) => {
    files[file.name].value = value!;
    setFiles({ ...files });
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <FileNameList />
      <Editor
        file={file}
        onChange={debounce(onEditorChange, 500)}
        options={{
          theme: `vs-${theme}`,
        }}
      />
    </div>
  );
}
