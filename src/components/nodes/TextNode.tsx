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
        relative bg-white border-2 rounded-lg shadow-lg min-w-[200px] max-w-[250px] transition-all duration-200
        ${selected ? "border-blue-500 shadow-blue-100 shadow-xl" : "border-gray-300 hover:shadow-xl hover:border-gray-400"}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-500 border-2 border-white hover:bg-blue-500 transition-colors"
      />

      <div className="p-3">
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
          <span className="font-medium">Send Message</span>
        </div>
        <div className="text-sm text-gray-800 leading-relaxed">
          {data.message || "Click to add message..."}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-500 border-2 border-white hover:bg-blue-500 transition-colors"
      />
    </div>
  );
};

export default TextNode;
