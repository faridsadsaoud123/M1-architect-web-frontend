import { useEffect, useState } from "react"
import { Modal,Input,InputSelect } from "../../../components";
import { Parcours } from "../hooks/useParcoursProvider";


export type PartialParcours = Omit<Parcours, "id"> | Parcours

type Props = {
  isOpen: boolean
  onSubmit: (parcours: PartialParcours) => void
  onClose: () => void
  id?: string
  initialValue?: PartialParcours
}

export const ParcoursModalForm: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  id,
  initialValue,
}) => {
  const [form, setForm] = useState<PartialParcours>(
    initialValue ?? { anneeFormation: 1, nomParcours: "" }
  )

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue)
    }
  }, [initialValue])

  return (
		 <Modal
      isOpen={isOpen}
      onClose={() => {
        setForm({ anneeFormation: 1, nomParcours: "" })
        onClose()
      }}
    >
      <h2 className="text-xl font-bold mb-4 ">Ajouter un parcours</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit({
            id,
            nomParcours: form.nomParcours,
            anneeFormation: form.anneeFormation,
          })
        }}
      >
        <Input
          id="name"
          label="Nom du parcours"
          value={form.nomParcours}
          onChange={(e) => {
            setForm((prevForm) => ({
              ...prevForm,
              nomParcours: e.target.value,
            }))
          }}
        />
        <InputSelect
          id="year"
          label="Année"
          options={[
            { value: "1", label: "1ère année" },
            { value: "2", label: "2ème année" },
          ]}
          value={form.anneeFormation}
          onChange={(value) =>
            setForm((prevForm) => ({
              ...prevForm,
              anneeFormation: parseInt(value),
            }))
          }
        />
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-500 p-2 rounded-lg text-white"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </Modal>
  )
}
