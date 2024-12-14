import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { OscillatorNode } from "./components/OscillatorNode";
import { VolumeNode } from "./components/VolumeNode";
import OutputNode from "./components/OutputNode";
import { connect, createAudioNode, disconnect, removeAudioNode } from "./audio";

const initialNodes = [
  {
    id: "a",
    position: { x: 200, y: 0 },
    data: { frequency: 220, type: "square" },
    type: "osc",
  },
  {
    id: "b",
    position: { x: 150, y: 250 },
    data: { gain: 0.5 },
    type: "volume",
  },
  { id: "c", position: { x: 350, y: 400 }, data: {}, type: "out" },
];
const initialEdges: Edge[] = [];

const nodeTypes = {
  osc: OscillatorNode,
  volume: VolumeNode,
  out: OutputNode,
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Connection) => {
    connect(params.source, params.target);
    setEdges((eds) => addEdge(params, eds));
  };

  const addOscNode = () => {
    const id = Math.random().toString().substring(2, 8);
    const position = { x: 0, y: 0 };
    const type = "osc";
    const data = { frequency: 400, type: "sine" };

    setNodes([...nodes, { id, position, type, data }]);
    createAudioNode(id, type, data);
  };

  const addVolumeNode = () => {
    const id = Math.random().toString().substring(2, 8);
    const position = { x: 0, y: 0 };
    const type = "volume";
    const data = { gain: 0.5 };

    setNodes([...nodes, { id, position, type, data }]);
    createAudioNode(id, type, data);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodesDelete={(nodes) => {
          for (const { id } of nodes) {
            removeAudioNode(id);
          }
        }}
        onEdgesDelete={(edges) => {
          for (const item of edges) {
            const { source, target } = item;
            disconnect(source, target);
          }
        }}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Lines} />
        <Panel className={"space-x-4"} position="top-right">
          <button
            className={"p-[4px] rounded bg-white shadow"}
            onClick={addOscNode}
          >
            添加振荡器节点
          </button>
          <button
            className={"p-[4px] rounded bg-white shadow"}
            onClick={addVolumeNode}
          >
            添加音量节点
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
