import './App.css'
import FlowBuilder from './components/FlowBuilder'

function App() {
  return (
    <div className="flex flex-col h-screen w-screen">
      <header className="bg-gray-50 p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 m-0">Chatbot Flow Builder</h1>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-gray-100 relative">
          <FlowBuilder />
        </div>
      </main>
    </div>
  )
}

export default App
