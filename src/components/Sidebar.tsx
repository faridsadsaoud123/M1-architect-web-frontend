import { Link } from "react-router-dom"

export const Sidebar: React.FC = () => {
  return (
    <div className="fixed h-screen w-64 bg-gray-800 text-white">
      <div className="p-4 text-xl font-bold">UPJV</div>
      <ul className="space-y-2">
        <li className="p-2 hover:bg-gray-700">
          <Link to="/" className="block">
            Accueil
          </Link>
        </li>
        <li className="p-2 hover:bg-gray-700">
          <Link to="/parcours" className="block">
            Parcours
          </Link>
        </li>
      </ul>
    </div>
  )
}
