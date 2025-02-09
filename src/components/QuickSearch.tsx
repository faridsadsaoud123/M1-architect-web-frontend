import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useListParcours } from "../pages/parcours/hooks/useParcoursProvider"
import { useListUes } from "../pages/ues/hooks.tsx/useUesProvider"
import { useListEtudiant } from "../pages/Etudiant/hooks/useEtudiantProvider"
interface QuickSearchBarProps {
  onSearch: (query: string) => void
  onSelect: (action: string) => void
}

const QuickSearch: React.FC<QuickSearchBarProps> = ({ onSearch, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { data: parcoursList } = useListParcours()
  const { data: uesList } = useListUes()
  const { data: etudiantsList } = useListEtudiant()
  const actions = [
    { id: "go-to-parcours-list", label: "Aller à la liste des parcours" },
    { id: "create-parcours", label: "Créer un parcours" },
    { id: "go-to-ues", label: "Accéder aux UEs" },
    { id: "create-ues", label: "Créer une UE" },
    { id: "go-to-etudiants", label: "Accéder aux etudiants" },
    { id: "create-etudiant", label: "Créer un etudiant" },
    ...(parcoursList?.map((parcours) => ({
      id: `edit-parcours-${parcours.id}`,
      label: `Modifier ${parcours.nomParcours}`,
      parcoursId: parcours.id,
    })) || []),
    ...(uesList?.map((ue) => ({
      id: `edit-ue-${ue.id}`,
      label: `Modifier ${ue.intitule}`,
      uesId: ue.id,
    })) || []),
    ...(etudiantsList?.map((etud) => ({
      id: `edit-etudiant-${etud.id}`,
      label: `Modifier ${etud.nom}`,
      etudiantId: etud.id,
    })) || []),
  ]

  const filteredActions = actions
    .filter((action) =>
      action.label.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5)

  const handleSelect = (actionId: string) => {
    if (actionId === "create-parcours") {
      navigate("/parcours", { state: { openCreateModal: true } })
    } else if (actionId.startsWith("edit-parcours-")) {
      const parcoursId = actionId.replace("edit-parcours-", "")
      navigate("/parcours", { state: { openEditModal: true, parcoursId } })
    } else if (actionId === "create-ue") {
      navigate("/ues", { state: { openCreateModal: true } })
    } else if (actionId.startsWith("edit-ue-")) {
      const ueId = actionId.replace("edit-ue-", "")
      navigate("/ues", { state: { openEditModal: true, ueId } })
    } else if (actionId === "create-etudiant") {
      navigate("/etudiants", { state: { openCreateModal: true } })
    } else if (actionId.startsWith("edit-etudiant-")) {
      const etudiantId = actionId.replace("edit-etudiant-", "")
      navigate("/etudiants", { state: { openEditModal: true, etudiantId } })
    } else {
      onSelect(actionId)
    }
    setIsOpen(false)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      setIsOpen(true)
    }

    if (isOpen) {
      if (e.key === "Escape") {
        setIsOpen(false)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(
          (prevIndex) => (prevIndex + 1) % filteredActions.length
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(
          (prevIndex) =>
            (prevIndex - 1 + filteredActions.length) % filteredActions.length
        )
      } else if (e.key === "Enter") {
        e.preventDefault()
        handleSelect(filteredActions[selectedIndex].id)
      }
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, selectedIndex, filteredActions])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="quick-search-bar fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-96">
        <input
          ref={inputRef}
          type="text"
          placeholder="Rechercher une action..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ul className="mt-2 flex flex-col gap-1">
          {filteredActions.map((action, index) => (
            <li
              key={action.id}
              className={`p-2 rounded-md cursor-pointer ${
                index === selectedIndex
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(action.id)}
            >
              {action.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default QuickSearch
