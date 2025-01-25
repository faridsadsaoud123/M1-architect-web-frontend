import { Edit,Trash } from "lucide-react"
import { useState } from "react"
import { Table } from "../../../components/Table"
import {
  type Etudiant,
  useCreateEtudiant,
  useListEtudiant,
  useUpdateEtudiant,
  useDeleteEtudiant
} from "../hooks/useEtudiantProvider"
import { EtudiantModalForm,PartialEtudiant } from "../components/EtudiantModalForm"


export const EtudiantPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<{
    create?: boolean
    edit?: boolean
    etudiant?: Etudiant
  }>({
    create: false,
    edit: false
  })

  const { mutate: createEtudiant } = useCreateEtudiant()
  const { mutate: updateEtudiant } = useUpdateEtudiant()
  const {mutate:deleteEtudiant} = useDeleteEtudiant()
  const { data } = useListEtudiant()

  const handleCreate = (etudiant: PartialEtudiant) => {
    createEtudiant(
      {
        numEtud: etudiant.numEtud,
        nom: etudiant.nom,
        prenom:etudiant.prenom,
        email:etudiant.email,
      },
      {
        onSuccess: () => {
          setModalOpen({})
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
        prenom:etudiant.prenom,
        email:etudiant.email
      },
      {
        onSuccess: () => {
          setModalOpen({})
        },
      }
    )
  }
  const handleDelete = (id: string) => {
    if(confirm("Etes-vous sur de supprimer l'etudiant")){

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
        <div className="flex justify-end">
          <button
            onClick={() => setModalOpen({ create: true })}
            className="bg-blue-900 p-2 rounded-lg text-white hover:bg-orange-500"
          >
            Ajouter un etudiant
          </button>
        </div>
        <Table
          data={data}
          columns={[
            { key: "numEtud", label: "Numéro d'etudiant" },
            { key: "nom", label: "Nom" },
            {key:"prenom",label:"Prenom"},
            {key:"email",label:"Email"},
            {
              key: "actions",
              label: "Actions",
              render: (etudiant) => (
                <span>
                  <button  onClick={() => setModalOpen({ edit: true, etudiant })}>
                  <Edit />
                </button>
                <button onClick={() => handleDelete(etudiant.id)}>
                  <Trash/>
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
        onClose={() => setModalOpen({})}
        onSubmit={handleSubmit}
        initialValue={modalOpen.etudiant}
      />
    </>
  )
}
