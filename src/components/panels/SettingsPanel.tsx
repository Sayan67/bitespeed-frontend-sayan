import React, { useState, useCallback, useEffect } from "react";
import type { Node } from "reactflow";

interface TextNodeData {
  message: string;
}

interface SettingsPanelProps {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, data: Partial<TextNodeData>) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  selectedNode,
  onNodeUpdate,
  onClose,
}) => {
  const [message, setMessage] = useState(selectedNode?.data?.message || "");

  // Update message state when selectedNode changes
  useEffect(() => {
    if (selectedNode?.data?.message !== undefined) {
      setMessage(selectedNode.data.message);
    }
  }, [selectedNode]);

  const handleMessageChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newMessage = event.target.value;
      setMessage(newMessage);

      if (selectedNode) {
        onNodeUpdate(selectedNode.id, { message: newMessage });
      }
    },
    [selectedNode, onNodeUpdate],
  );

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">
          Message Settings
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
          aria-label="Close settings"
        >
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="message-text"
            className="block text-xs font-medium text-gray-700 mb-2"
          >
            Text
          </label>
          <textarea
            id="message-text"
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter message text..."
            className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={5}
          />
        </div>

        <div className="text-xs text-gray-500">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Text Message</span>
          </div>
          <div>Node ID: {selectedNode.id}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
