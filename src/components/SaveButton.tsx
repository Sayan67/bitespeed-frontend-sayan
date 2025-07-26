import React from "react";

interface SaveButtonProps {
  canSave: boolean;
  onSave: () => void;
  saveStatus: "idle" | "saving" | "success" | "error";
}

const SaveButton: React.FC<SaveButtonProps> = ({
  canSave,
  onSave,
  saveStatus,
}) => {
  const isLoading = saveStatus === "saving";

  const handleSave = () => {
    if (canSave && !isLoading) {
      onSave();
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={!canSave || isLoading}
      className={`
        px-4 py-2 text-sm font-medium rounded-md border transition-colors cursor-pointer
        ${
          canSave && !isLoading
            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
        }
        ${isLoading ? "opacity-75" : ""}
      `}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Saving...
        </div>
      ) : (
        "Save Flow"
      )}
    </button>
  );
};

export default SaveButton;
