import LeftPanel from './components/LeftPanel'
import CenterCanvas from './components/CenterCanvas'
import RightPanel from './components/RightPanel'
import BottomBar from './components/BottomBar'

export default function App() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <CenterCanvas />
        <RightPanel />
      </div>
      <BottomBar />
    </div>
  )
}
