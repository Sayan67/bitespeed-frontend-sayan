import { MessageCircleMore } from "lucide-react";
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
        ${selected ? "border-blue-500 shadow-blue-100 shadow-xl" : "border-gray-300 hover:shadow-xl hover:border-gray-400 overflow-hidden"}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-500 border-2 border-white hover:bg-blue-500 transition-colors"
      />

      <div className="">
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-2 bg-green-200 p-2 justify-between">
          <MessageCircleMore size={14} />
          <span className="font-medium text-black">Send Message</span>
          <img
            src="/icons/whatsapp.png"
            alt="Send Message"
            className="w-[14px]"
          />
        </div>
        <div className="text-sm text-gray-800 leading-relaxed p-3">
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
