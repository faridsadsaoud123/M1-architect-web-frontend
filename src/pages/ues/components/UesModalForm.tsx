import { useEffect, useState } from "react"
import { Modal,Input,InputSelect } from "../../../components";
import { Ue } from "../hooks.tsx/useUesProvider";
import { z, type ZodFormattedError } from "zod";


export type PartialUe = Omit<Ue, "id"> | Ue

type Props = {
  isOpen: boolean
  onSubmit: (Ue: PartialUe) => void
  onClose: () => void
  id?: string
  initialValue?: PartialUe
}

export const UeModalForm: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  id,
  initialValue,
}) => {
  const [form, setForm] = useState<PartialUe>(
    initialValue ?? { numeroUe: "1", intitule: "" }
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
        setForm({ numeroUe: "1",intitule: "" })
        onClose()
      }}
    >
      <h2 className="text-xl font-bold mb-4">Ajouter une ue</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit({
            id,
            numeroUe: form.numeroUe,
            intitule: form.intitule,
          })
        }}
      >
        <Input
          id="name"
          label="Nom du ue"
          value={form.intitule}
          onChange={(e) => {
            setForm((prevForm) => ({
              ...prevForm,
              intitule: e.target.value,
            }))
          }}
        />
        <Input
          id="numero"
          label="Numero du ue"
          value={form.numeroUe}
          onChange={(e) => {
            setForm((prevForm) => ({
              ...prevForm,
              numeroUe: e.target.value,
            }))
          }}
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
