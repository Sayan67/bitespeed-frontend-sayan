import React from "react";
import { Handle, Position } from "reactflow";

interface TextNodeData {
  message: string;
}

interface TextNodeProps {
  data: TextNodeData;
  selected?: boolean;
}

const TextNode: React.FC<TextNodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`
        relative bg-white border-2 rounded-lg shadow-md min-w-[200px] max-w-[250px]
        ${selected ? "border-blue-500" : "border-gray-300"}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400"
      />

      <div className="p-3">
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          Send Message
        </div>
        <div className="text-sm text-gray-800 leading-relaxed text-ellipsis overflow-hidden">
          {data.message || "Click to add message..."}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400"
      />
    </div>
  );
};

export default TextNode;
