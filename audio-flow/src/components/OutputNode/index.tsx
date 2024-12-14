import { Handle, Position } from "@xyflow/react";
import { useState } from "react";
import { toggleAudio } from "../../audio";

const OutputNode = () => {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className={"bg-white shadow-xl p-[20px]"}>
      <Handle
        type="target"
        className="w-[10px] h-[10px]"
        position={Position.Top}
      />

      <div>
        <p>输出节点</p>
        <button
          onClick={() => {
            setIsRunning((isRunning) => !isRunning);
            toggleAudio();
          }}
        >
          {isRunning ? <span role="img">🔈</span> : <span role="img">🔇</span>}
        </button>
      </div>
    </div>
  );
};

export default OutputNode;
