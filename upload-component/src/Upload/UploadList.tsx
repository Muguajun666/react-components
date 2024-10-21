import { Progress } from "antd";
import {
  DeleteOutlined,
  LoadingOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { FC } from "react";
import './index.scss'

export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status?: "success" | "error" | "uploading" | "ready";
  percent?: number;
  raw?: File;
  response?: any;
  error?: any;
}

interface UploadListProps {
  fileList: UploadFile[];
  onRemove: (file: UploadFile) => void;
}

export const UploadList: FC<UploadListProps> = (props) => {
  const { fileList, onRemove } = props;

  return (
    <ul className="upload-list">
      {fileList.map((item) => {
        return (
          <li
            className={`upload-list-item upload-list-item-${item.status}`}
            key={item.uid}
          >
            <span className="file-name">
              {(item.status === "uploading" || item.status === "ready") && (
                <LoadingOutlined />
              )}
              {item.status === "success" && <CheckOutlined />}
              {item.status === "error" && <CloseOutlined />}
              {item.name}
            </span>
            <span className="file-actions">
              <DeleteOutlined onClick={() => onRemove(item)} />
            </span>
            {item.status === "uploading" && (
              <Progress percent={item.percent || 0} />
            )}
          </li>
        );
      })}
    </ul>
  );
};
