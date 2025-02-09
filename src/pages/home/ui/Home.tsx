import React from "react"
import QuickSearch from "../../../components/QuickSearch"
import { useNavigate } from "react-router-dom"
export const Home: React.FC = () => {
  const navigate = useNavigate()
  const handleSearch = (query: string) => {
    console.log("Recherche:", query)
  }

  const handleSelect = (action: string) => {
    switch (action) {
      case "go-to-parcours-list":
        navigate("/parcours")
        break
      case "create-parcours":
        navigate("/parcours", { state: { openCreateModal: true } })
        break
      case "modifier-parcours":
        navigate("/parcours", { state: { openModifiyModal: true } })
        break
      case "go-to-ues":
        navigate("/ues")
        break
      case "create-ues":
        navigate("/ues", { state: { openCreateModal: true } })
        break
      default:
        break
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Barre de recherche rapide */}
      <QuickSearch onSearch={handleSearch} onSelect={handleSelect} />

      {/* Contenu principal */}
      <h1 className="text-3xl py-20">Bienvenue dans la page d'accueil</h1>
    </div>
  )
}
