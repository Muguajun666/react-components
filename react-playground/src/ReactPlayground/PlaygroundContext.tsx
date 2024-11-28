import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { compress, fileName2Language, uncompress } from "./utils";
import { initFiles } from "./files";

export interface File {
  name: string;
  value: string;
  language: string;
}

export interface Files {
  [key: string]: File;
}

export type Theme = "light" | "dark";

export interface PlaygroundContext {
  files: Files;
  selectedFileName: string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setSelectedFileName: (fileName: string) => void;
  setFiles: (files: Files) => void;
  addFile: (fileName: string) => void;
  removeFile: (fileName: string) => void;
  updateFileName: (oldFieldName: string, newFieldName: string) => void;
}

export const PlaygroundContext = createContext<PlaygroundContext>({
  selectedFileName: "App.tsx",
} as PlaygroundContext);

const getFilesFromUrl = () => {
  let files: Files | undefined;
  try {
    if (!window.location.hash.slice(1)) return files;
    const hash = uncompress(window.location.hash.slice(1));
    files = JSON.parse(hash);
  } catch (e) {
    console.error(e);
  }
  return files;
};

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const [files, setFiles] = useState<Files>(getFilesFromUrl() || initFiles);
  const [selectedFileName, setSelectedFileName] = useState("App.tsx");
  const [theme, setTheme] = useState<Theme>("light");

  const addFile = (fileName: string) => {
    files[fileName] = {
      name: fileName,
      language: fileName2Language(fileName),
      value: "",
    };
    setFiles({ ...files });
  };

  const removeFile = (fileName: string) => {
    delete files[fileName];
    setFiles({ ...files });
  };

  const updateFileName = (oldFieldName: string, newFieldName: string) => {
    if (
      !files[oldFieldName] ||
      newFieldName === undefined ||
      newFieldName === null
    )
      return;
    const { [oldFieldName]: value, ...rest } = files;
    const newFile = {
      [newFieldName]: {
        ...value,
        language: fileName2Language(newFieldName),
        name: newFieldName,
      },
    };
    setFiles({
      ...rest,
      ...newFile,
    });
  };

  useEffect(() => {
    const hash = compress(JSON.stringify(files));
    window.location.hash = hash;
  }, [files]);

  return (
    <PlaygroundContext.Provider
      value={{
        files,
        selectedFileName,
        theme,
        setTheme,
        setSelectedFileName,
        setFiles,
        addFile,
        removeFile,
        updateFileName,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
};
