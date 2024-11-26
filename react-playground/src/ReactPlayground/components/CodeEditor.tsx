import FileNameList from "./FileNameList";
import Editor from "./Editor";

export default function CodeEditor() {
  const file = {
    name: "test.tsx",
    value: 'import lodash from "lodash";\n\nconst a = <div>guang</div>',
    language: "typescript",
  };

  const onEditorChange = () => {};

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <FileNameList />
      <Editor file={file} onChange={onEditorChange} />
    </div>
  );
}
