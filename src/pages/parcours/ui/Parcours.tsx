import { Edit, Trash } from "lucide-react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Table } from "../../../components/Table"
import {
  type Parcours,
  useCreateParcours,
  useListParcours,
  useUpdateParcours,
  useDeleteParcours,
} from "../hooks/useParcoursProvider"
import {
  ParcoursModalForm,
  PartialParcours,
} from "../components/ParcoursModalForm"
import QuickSearch from "../../../components/QuickSearch"
export const ParcoursPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<{
    create?: boolean
    edit?: boolean
    parcours?: Parcours
  }>({
    create: false,
    edit: false,
  })

  const location = useLocation()
  const navigate = useNavigate()

  const { mutate: createParcours } = useCreateParcours()
  const { mutate: updateParcours } = useUpdateParcours()
  const { mutate: deleteParcours } = useDeleteParcours()
  const { data } = useListParcours()

  // Gestion de l'ouverture des modaux via l'état de navigation
  const handleSearch = (query: string) => {
    console.log("Recherche:", query)
  }

  const handleSelect = (action: string) => {
    switch (action) {
      case "go-to-parcours-list":
        navigate("/parcours")
        break
      case "go-to-ues":
        navigate("/ues")
        break
      case "go-to-etudiants":
        navigate("/etudiants")
      default:
        break
    }
  }
  useEffect(() => {
    const state = location.state as {
      openCreateModal?: boolean
      openEditModal?: boolean
      parcoursId?: string
    }
    if (state?.openCreateModal) {
      setModalOpen({ create: true })
    } else if (state?.openEditModal && state.parcoursId) {
      const parcours = data?.find((p) => p.id === state.parcoursId)
      if (parcours) {
        setModalOpen({ edit: true, parcours })
      }
    }
  }, [location.state, data])

  const handleCreate = (parcours: PartialParcours) => {
    createParcours(
      {
        nomParcours: parcours.nomParcours,
        anneeFormation: parcours.anneeFormation,
      },
      {
        onSuccess: () => {
          setModalOpen({})
          navigate("/parcours", { state: {} }) // Réinitialiser l'état de navigation
        },
      }
    )
  }

  const handleUpdate = (id: string, parcours: PartialParcours) => {
    updateParcours(
      {
        id,
        nomParcours: parcours.nomParcours,
        anneeFormation: parcours.anneeFormation,
      },
      {
        onSuccess: () => {
          setModalOpen({})
          navigate("/parcours", { state: {} }) // Réinitialiser l'état de navigation
        },
      }
    )
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de supprimer le parcours ?")) {
      deleteParcours(
        { id },
        {
          onSuccess: () => {
            setModalOpen({})
          },
        }
      )
    }
  }

  const handleSubmit = (parcours: PartialParcours) => {
    if (modalOpen.create) {
      handleCreate(parcours)
    } else if (modalOpen.edit) {
      handleUpdate(modalOpen.parcours?.id!, parcours)
    }
  }

  return (
    <>
      <QuickSearch onSearch={handleSearch} onSelect={handleSelect} />
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="text-2xl border-b-2">Liste des parcours</div>
          <button
            onClick={() => setModalOpen({ create: true })}
            className="bg-blue-900 px-5 py-2 rounded-lg text-white hover:bg-orange-500"
          >
            Ajouter un parcours
          </button>
        </div>
        <Table
          data={data}
          columns={[
            { key: "nomParcours", label: "Nom" },
            { key: "anneeFormation", label: "Année" },
            {
              key: "actions",
              label: "Actions",
              render: (parcours) => (
                <span>
                  <button
                    onClick={() => setModalOpen({ edit: true, parcours })}
                  >
                    <Edit color="green" />
                  </button>
                  <button onClick={() => handleDelete(parcours.id)}>
                    <Trash color="red" />
                  </button>
                </span>
              ),
            },
          ]}
        />
      </div>
      <ParcoursModalForm
        id={modalOpen.parcours?.id}
        isOpen={modalOpen.edit ?? modalOpen.create ?? false}
        onClose={() => {
          setModalOpen({})
          navigate("/parcours", { state: {} }) // Réinitialiser l'état de navigation
        }}
        onSubmit={handleSubmit}
        initialValue={modalOpen.parcours}
      />
    </>
  )
}
