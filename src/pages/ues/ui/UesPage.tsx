import { Edit, Trash } from "lucide-react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Table } from "../../../components/Table"
import {
  type Ue,
  useCreateUe,
  useDeleteUes,
  useListUes,
  useUpdateUes,
} from "../hooks.tsx/useUesProvider"
import { PartialUe, UeModalForm } from "../components/UesModalForm"

export const UesPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<{
    create?: boolean
    edit?: boolean
    ue?: Ue
  }>({
    create: false,
    edit: false,
  })

  const location = useLocation()
  const navigate = useNavigate()

  const { mutate: createUe } = useCreateUe()
  const { mutate: updateUe } = useUpdateUes()
  const { mutate: deleteUe } = useDeleteUes()
  const { data } = useListUes()

  useEffect(() => {
    const state = location.state as {
      openCreateModal?: boolean
      openEditModal?: boolean
      ueId?: string
    }
    if (state?.openCreateModal) {
      setModalOpen({ create: true })
    } else if (state?.openEditModal && state.ueId) {
      const ue = data?.find((u) => u.id === state.ueId)
      if (ue) {
        setModalOpen({ edit: true, ue })
      }
    }
  }, [location.state, data])

  const handleCreate = (ue: PartialUe) => {
    createUe(
      {
        numeroUe: ue.numeroUe,
        intitule: ue.intitule,
      },
      {
        onSuccess: () => {
          setModalOpen({})
          navigate("/ues", { state: {} }) // Réinitialiser l'état de navigation
        },
      }
    )
  }

  const handleUpdate = (id: string, ue: PartialUe) => {
    updateUe(
      {
        id,
        numeroUe: ue.numeroUe,
        intitule: ue.intitule,
      },
      {
        onSuccess: () => {
          setModalOpen({})
          navigate("/ues", { state: {} }) // Réinitialiser l'état de navigation
        },
      }
    )
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de supprimer ?")) {
      deleteUe(
        { id },
        {
          onSuccess: () => {
            setModalOpen({})
          },
        }
      )
    }
  }

  const handleSubmit = (ue: PartialUe) => {
    if (modalOpen.create) {
      handleCreate(ue)
    } else if (modalOpen.edit) {
      handleUpdate(modalOpen.ue?.id!, ue)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="text-2xl border-b-2">Liste des UEs</div>
          <button
            onClick={() => setModalOpen({ create: true })}
            className="bg-blue-900 px-5 py-2 rounded-lg text-white hover:bg-orange-500"
          >
            Ajouter une UE
          </button>
        </div>
        <Table
          data={data}
          columns={[
            { key: "intitule", label: "Intitulé" },
            { key: "numeroUe", label: "Numéro UE" },
            {
              key: "actions",
              label: "Actions",
              render: (ue) => (
                <span>
                  <button onClick={() => setModalOpen({ edit: true, ue })}>
                    <Edit color="green" />
                  </button>
                  <button onClick={() => handleDelete(ue.id)}>
                    <Trash color="red" />
                  </button>
                </span>
              ),
            },
          ]}
        />
      </div>
      <UeModalForm
        id={modalOpen.ue?.id}
        isOpen={modalOpen.edit ?? modalOpen.create ?? false}
        onClose={() => {
          setModalOpen({})
          navigate("/ues", { state: {} }) // Réinitialiser l'état de navigation
        }}
        onSubmit={handleSubmit}
        initialValue={modalOpen.ue}
      />
    </>
  )
}
