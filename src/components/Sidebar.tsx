import { Link } from "react-router-dom"

export const Sidebar: React.FC = () => {
  return (
    <div className="fixed h-screen w-64 bg-blue-900 text-white ">
      <div className="text-center py-10 text-4xl font-bold">
        UPJV
      </div>
      <ul className="space-y-2">
        <li className="px-5 py-4  hover:bg-white hover:text-blue-900">
          <Link to="/" className="block">
            Accueil
          </Link>
        </li>
        <li className="px-5 py-4  hover:bg-white hover:text-blue-900">
          <Link to="/parcours" className="block">
            Parcours
          </Link>
        </li>
        <li className="px-5 py-4  hover:bg-white hover:text-blue-900">
          <Link to="/ues" className="block">
            Unités d'enseignement
          </Link>
        </li>
        <li className="px-5 py-4  hover:bg-white hover:text-blue-900">
          <Link to="/etudiants" className="block">
            Etudiants
          </Link>
        </li>
      </ul>
    </div>
  )
}
