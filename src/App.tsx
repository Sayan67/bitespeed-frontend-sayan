import './App.css'
import { useState, useCallback } from 'react'
import { ReactFlowProvider } from 'reactflow'
import FlowBuilder from './components/FlowBuilder'
import SaveButton from './components/SaveButton'

function App() {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveFunction, setSaveFunction] = useState<(() => boolean) | null>(null);

  const handleSaveStatusChange = useCallback((_canSaveFlow: boolean, saveFn: () => boolean) => {
    setSaveFunction(() => saveFn);
  }, []);

  const handleSave = useCallback(() => {
    if (!saveFunction) return;
    
    setSaveStatus('saving');
    
    // Simulate save operation
    setTimeout(() => {
      const saveResult = saveFunction();
      
      if (saveResult) {
        setSaveStatus('success');
        // Reset status after 2 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      } else {
        // Save failed due to validation
        setSaveStatus('idle');
      }
    }, 500);
  }, [saveFunction]);

  return (
    <div className="flex flex-col h-screen w-screen">
      <header className="bg-white p-4 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 m-0">Chatbot Flow Builder</h1>
          <div className="flex items-center gap-3">
            {saveStatus === 'success' && (
              <span className="text-sm text-green-600 font-medium">
                Flow saved successfully!
              </span>
            )}
            <SaveButton canSave={true} onSave={handleSave} saveStatus={saveStatus} />
          </div>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-gray-100 relative">
          <ReactFlowProvider>
            <FlowBuilder onSaveStatusChange={handleSaveStatusChange} />
          </ReactFlowProvider>
        </div>
      </main>
    </div>
  )
}

export default App
