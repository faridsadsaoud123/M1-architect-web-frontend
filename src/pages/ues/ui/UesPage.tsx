import { Edit,Trash } from "lucide-react"
import { useState } from "react"
import { Table } from "../../../components/Table"
import { type Ue,
    useCreateUe,
    useDeleteUes,
    useListUes, 
    useUpdateUes
 } from "../hooks.tsx/useUesProvider"
 import { PartialUe , UeModalForm } from "../components/UesModalForm"

export const UesPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<{
    create?: boolean
    edit?: boolean
    ue?: Ue
    delete?: boolean
  }>({
    create: false,
    edit: false,
    delete: false,
  })

  const { mutate: createUe } = useCreateUe()
  const { mutate: updateUe } = useUpdateUes()
  const {mutate:deleteUe} = useDeleteUes()
  const { data } = useListUes()

  const handleCreate = (ue: PartialUe) => {
    createUe(
      {
        numeroUe: ue.numeroUe,
        intitule: ue.intitule,
      },
      {
        onSuccess: () => {
          setModalOpen({})
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
        },
      }
    )
  }
  const handleDelete = (id: string) => {
    confirm("Etes-vous sur de supprimer");
    deleteUe(
      { id },
      {
        onSuccess: () => {
          setModalOpen({})
        },
      }
    )
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
        <div className="flex justify-end">
          <button
            onClick={() => setModalOpen({ create: true })}
            className="bg-blue-900 p-2 rounded-lg text-white"
          >
            Ajouter une ue
          </button>
        </div>
        <Table
          data={data}
          columns={[
            { key: "intitule", label: "Intitule" },
            { key: "numeroUe", label: "Numero Ue" },
            {
              key: "actions",
              label: "Actions",
              render: (ue) => (
                <span>
                  <button onClick={() => setModalOpen({ edit: true, ue })}>
                  <Edit />
                </button>
                <button onClick={() => handleDelete(ue.id)}>
                  <Trash/>
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
        onClose={() => setModalOpen({})}
        onSubmit={handleSubmit}
        initialValue={modalOpen.ue}
      />
    </>
  )
}
