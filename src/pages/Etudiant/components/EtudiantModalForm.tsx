import { useEffect, useState } from "react"
import { z, type ZodFormattedError } from "zod"
import { Etudiant } from "../../Etudiant/hooks/useEtudiantProvider"
import { ModalBody } from "../../../components/modalV2/ModalBody"
import { ModalV2 } from "../../../components/modalV2/modalV2"
import { ModalFooter } from "../../../components/modalV2/ModalFooter"
import { ModalTitle } from "../../../components/modalV2/ModalTitle"
import { Input } from "../../../components"
export type PartialEtudiant = Omit<Etudiant, "id"> | Etudiant

type Props = {
  isOpen: boolean
  onSubmit: (etudiant: PartialEtudiant) => void
  onClose: () => void
  id?: string
  initialValue?: PartialEtudiant
}

export const EtudiantModalForm: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  id,
  initialValue,
}) => {
  const [form, setForm] = useState<PartialEtudiant>(
    initialValue ?? { numEtud: "1", nom: "", prenom: "", email: "" }
  )

  const [errors, setErrors] = useState<ZodFormattedError<PartialEtudiant>>()

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue)
    }
  }, [initialValue])

  // Fonction de validation avec Zod
  const validateForm = (etudiant: PartialEtudiant) => {
    const schema = z.object({
      numEtud: z.string().length(8, {
        message: "Le numéro étudiant doit être composé de 8 chiffres",
      }),
      nom: z.string().min(1, { message: "Le nom de l'étudiant est requis" }),
      prenom: z
        .string()
        .min(1, { message: "Le prénom de l'étudiant est requis" }),
      email: z.string().email({ message: "L'adresse email est invalide" }),
    })

    const result = schema.safeParse(etudiant)

    if (!result.success) {
      setErrors(result.error.format())
      return false
    } else {
      setErrors(undefined)
      return true
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm(form)) {
      onSubmit({
        id,
        numEtud: form.numEtud,
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
      })
      onClose() // Fermer le modal après soumission
    }
  }

  const handleClose = () => {
    setForm({ numEtud: "1", nom: "", prenom: "", email: "" })
    setErrors(undefined)
    onClose()
  }

  return (
    <ModalV2 isOpen={isOpen} onClose={handleClose}>
      <div className="flex justify-between">
        <ModalTitle title="Ajouter un étudiant" />
      </div>

      <ModalBody>
        <form onSubmit={handleSubmit}>
          {/* Champ Numéro Étudiant */}
          <div className="mb-4">
            <Input
              id="numEtud"
              label="Numéro de l'étudiant"
              value={form.numEtud}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  numEtud: e.target.value,
                }))
              }
            />
            {errors?.numEtud && (
              <p className="text-red-500 text-sm">
                {errors.numEtud._errors[0]}
              </p>
            )}
          </div>

          {/* Champ Nom */}
          <div className="mb-4">
            <Input
              id="nom"
              label="Nom"
              value={form.nom}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  nom: e.target.value,
                }))
              }
            />
            {errors?.nom && (
              <p className="text-red-500 text-sm">{errors.nom._errors[0]}</p>
            )}
          </div>

          {/* Champ Prénom */}
          <div className="mb-4">
            <Input
              id="prenom"
              label="Prénom"
              value={form.prenom}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  prenom: e.target.value,
                }))
              }
            />
            {errors?.prenom && (
              <p className="text-red-500 text-sm">{errors.prenom._errors[0]}</p>
            )}
          </div>

          <div className="mb-4">
            <Input
              id="email"
              label="Email"
              value={form.email}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  email: e.target.value,
                }))
              }
            />
            {errors?.email && (
              <p className="text-red-500 text-sm">{errors.email._errors[0]}</p>
            )}
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <button
          className="bg-red-500 px-5 rounded-lg text-white hover:bg-red-600"
          onClick={handleClose}
        >
          Annuler
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 p-2 rounded-lg text-white hover:bg-blue-600"
        >
          Enregistrer
        </button>
      </ModalFooter>
    </ModalV2>
  )
}
