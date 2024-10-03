import { Outlet } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"

function App() {
  return (
    <>
      <Sidebar />
      <div className="ml-64 p-4">
        <Outlet />
      </div>
    </>
  )
}

export default App
