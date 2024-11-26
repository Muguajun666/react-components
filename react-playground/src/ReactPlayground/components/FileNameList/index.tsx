import { useContext, useEffect, useState } from "react";
import { PlaygroundContext } from "../../PlaygroundContext";

export default function FileNameList() {
  const { files, removeFile, addFile, updateFileName, selectedFileName } =
    useContext(PlaygroundContext);

  const [tabs, setTabs] = useState([""]);

  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  return (
    <div>
      {tabs.map((tab, index) => {
        return <div>{tab}</div>;
      })}
    </div>
  );
}
