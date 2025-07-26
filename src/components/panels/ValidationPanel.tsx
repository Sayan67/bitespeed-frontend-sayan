import React from "react";
import type { ValidationError } from "../../utils/flowValidation";

interface ValidationPanelProps {
  errors: ValidationError[];
  onNodeHighlight?: (nodeId: string) => void;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({
  errors,
  onNodeHighlight,
}) => {
  if (errors.length === 0) {
    return (
      <div className="p-1 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-700 font-medium">
            Flow is valid
          </span>
        </div>
      </div>
    );
  }

  const errorCount = errors.filter((e) => e.type === "error").length;
  const warningCount = errors.filter((e) => e.type === "warning").length;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 text-xs">
        {errorCount > 0 && (
          <span className="text-red-600">
            {errorCount} error{errorCount > 1 ? "s" : ""}
          </span>
        )}
        {warningCount > 0 && (
          <span className="text-yellow-600">
            {warningCount} warning{warningCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="space-y-1 max-h-32 overflow-y-auto">
        {errors.map((error, index) => (
          <div
            key={index}
            className={`p-2 rounded text-xs border ${
              error.type === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-yellow-50 border-yellow-200 text-yellow-700"
            } ${error.nodeId && onNodeHighlight ? "cursor-pointer hover:opacity-80" : ""}`}
            onClick={() => error.nodeId && onNodeHighlight?.(error.nodeId)}
          >
            <div className="flex items-start gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${
                  error.type === "error" ? "bg-red-500" : "bg-yellow-500"
                }`}
              />
              <span>{error.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidationPanel;
