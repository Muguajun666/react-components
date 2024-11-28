import { useContext, useEffect, useState } from "react";
import { PlaygroundContext } from "../../PlaygroundContext";
import { FileNameItem } from "./FileNameItem";
import styles from "./index.module.scss";
import {
  APP_COMPONENT_FILE_NAME,
  ENTRY_FILE_NAME,
  IMPORT_MAP_FILE_NAME,
} from "../../files";

export default function FileNameList() {
  const {
    files,
    removeFile,
    addFile,
    updateFileName,
    selectedFileName,
    setSelectedFileName,
  } = useContext(PlaygroundContext);

  const [tabs, setTabs] = useState([""]);

  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  const handleEditComplete = (name: string, prevName: string) => {
    updateFileName(prevName, name);
    setSelectedFileName(name);

    setCreating(false);
  };

  const addTab = () => {
    addFile("Comp" + Math.random().toString().slice(2, 8) + ".tsx");
    setCreating(true);
  };

  const handleRemove = (name: string) => {
    removeFile(name);
    setSelectedFileName(ENTRY_FILE_NAME);
  };

  const readonlyFileNames = [
    ENTRY_FILE_NAME,
    IMPORT_MAP_FILE_NAME,
    APP_COMPONENT_FILE_NAME,
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map((tab, index) => {
        return (
          <FileNameItem
            value={tab}
            key={tab + index}
            creating={creating && index === tabs.length - 1}
            actived={selectedFileName === tab}
            readonly={readonlyFileNames.includes(tab)}
            onClick={() => setSelectedFileName(tab)}
            onEditComplete={(name: string) => handleEditComplete(name, tab)}
            onRemove={() => handleRemove(tab)}
          />
        );
      })}
      <div className={styles.add} onClick={addTab}>
        +
      </div>
    </div>
  );
}
