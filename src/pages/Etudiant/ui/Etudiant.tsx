import { Edit, Trash } from "lucide-react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Table } from "../../../components/Table"
import {
  type Etudiant,
  useCreateEtudiant,
  useListEtudiant,
  useUpdateEtudiant,
  useDeleteEtudiant,
} from "../hooks/useEtudiantProvider"
import {
  EtudiantModalForm,
  PartialEtudiant,
} from "../components/EtudiantModalForm"

export const EtudiantPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<{
    create?: boolean
    edit?: boolean
    etudiant?: Etudiant
  }>({
    create: false,
    edit: false,
  })

  const location = useLocation()
  const navigate = useNavigate()

  const { mutate: createEtudiant } = useCreateEtudiant()
  const { mutate: updateEtudiant } = useUpdateEtudiant()
  const { mutate: deleteEtudiant } = useDeleteEtudiant()
  const { data } = useListEtudiant()

  useEffect(() => {
    const state = location.state as {
      openCreateModal?: boolean
      openEditModal?: boolean
      etudiantId?: string
    }
    if (state?.openCreateModal) {
      setModalOpen({ create: true })
    } else if (state?.openEditModal && state.etudiantId) {
      const etudiant = data?.find((e) => e.id === state.etudiantId)
      if (etudiant) {
        setModalOpen({ edit: true, etudiant })
      }
    }
  }, [location.state, data])

  const handleCreate = (etudiant: PartialEtudiant) => {
    createEtudiant(
      {
        numEtud: etudiant.numEtud,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
      },
      {
        onSuccess: () => {
          setModalOpen({})
          navigate("/etudiants", { state: {} }) // Réinitialiser l'état de navigation
        },
      }
    )
  }

  const handleUpdate = (id: string, etudiant: PartialEtudiant) => {
    updateEtudiant(
      {
        id,
        numEtud: etudiant.numEtud,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
      },
      {
        onSuccess: () => {
          setModalOpen({})
          navigate("/etudiants", { state: {} }) // Réinitialiser l'état de navigation
        },
      }
    )
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de supprimer l'étudiant ?")) {
      deleteEtudiant(
        { id },
        {
          onSuccess: () => {
            setModalOpen({})
          },
        }
      )
    }
  }

  const handleSubmit = (etudiant: PartialEtudiant) => {
    if (modalOpen.create) {
      handleCreate(etudiant)
    } else if (modalOpen.edit) {
      handleUpdate(modalOpen.etudiant?.id!, etudiant)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="text-2xl border-b-2">Liste des étudiants</div>
          <button
            onClick={() => setModalOpen({ create: true })}
            className="bg-blue-900 px-5 py-2 rounded-lg text-white hover:bg-orange-500"
          >
            Ajouter un étudiant
          </button>
        </div>
        <Table
          data={data}
          columns={[
            { key: "numEtud", label: "Numéro d'étudiant" },
            { key: "nom", label: "Nom" },
            { key: "prenom", label: "Prénom" },
            { key: "email", label: "Email" },
            {
              key: "actions",
              label: "Actions",
              render: (etudiant) => (
                <span>
                  <button
                    onClick={() => setModalOpen({ edit: true, etudiant })}
                  >
                    <Edit color="green" />
                  </button>
                  <button onClick={() => handleDelete(etudiant.id)}>
                    <Trash color="red" />
                  </button>
                </span>
              ),
            },
          ]}
        />
      </div>
      <EtudiantModalForm
        id={modalOpen.etudiant?.id}
        isOpen={modalOpen.edit ?? modalOpen.create ?? false}
        onClose={() => {
          setModalOpen({})
          navigate("/etudiants", { state: {} }) // Réinitialiser l'état de navigation
        }}
        onSubmit={handleSubmit}
        initialValue={modalOpen.etudiant}
      />
    </>
  )
}
