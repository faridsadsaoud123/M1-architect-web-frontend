import { Edit,Trash } from "lucide-react"
import { useState } from "react"
import { Table } from "../../../components/Table"
import {
  type Parcours,
  useCreateParcours,
  useListParcours,
  useUpdateParcours,
  useDeleteParcours
} from "../hooks/useParcoursProvider"
import { ParcoursModalForm,PartialParcours } from "../components/ParcoursModalForm"

export const ParcoursPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<{
    create?: boolean
    edit?: boolean
    parcours?: Parcours
  }>({
    create: false,
    edit: false
  })

  const { mutate: createParcours } = useCreateParcours()
  const { mutate: updateParcours } = useUpdateParcours()
  const {mutate:deleteParcours} = useDeleteParcours()
  const { data } = useListParcours()

  const handleCreate = (parcours: PartialParcours) => {
    createParcours(
      {
        nomParcours: parcours.nomParcours,
        anneeFormation: parcours.anneeFormation,
      },
      {
        onSuccess: () => {
          setModalOpen({})
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
        },
      }
    )
  }
  const handleDelete = (id: string) => {
    if(confirm("Etes-vous sur de supprimer le parcours")){

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
    // if(parcours.nomParcours===""||!parcours.nomParcours){
    //   alert("Nom de parcours ne peut pas etre vc")
    // }
    if (modalOpen.create) {
      handleCreate(parcours)
    } else if (modalOpen.edit) {
      handleUpdate(modalOpen.parcours?.id!, parcours)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between">
        <div className=" text-2xl border-b-2">Liste des parcours</div>
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
                  <button  onClick={() => setModalOpen({ edit: true, parcours })}>
                  <Edit color="green"/>
                </button>
                <button onClick={() => handleDelete(parcours.id)}>
                  <Trash color="red"/>
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
        onClose={() => setModalOpen({})}
        onSubmit={handleSubmit}
        initialValue={modalOpen.parcours}
      />
    </>
  )
}
