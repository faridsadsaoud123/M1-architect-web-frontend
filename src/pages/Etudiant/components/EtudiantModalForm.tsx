import { useEffect, useState } from "react";
import { Modal, Input, InputSelect } from "../../../components";
import { z, type ZodFormattedError } from "zod";
import { Etudiant } from "../../Etudiant/hooks/useEtudiantProvider";
export type PartialEtudiant = Omit<Etudiant, "id"> | Etudiant;

type Props = {
  isOpen: boolean;
  onSubmit: (etudiant: PartialEtudiant) => void;
  onClose: () => void;
  id?: string;
  initialValue?: PartialEtudiant;
};

export const EtudiantModalForm: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  id,
  initialValue,
}) => {
  const [form, setForm] = useState<PartialEtudiant>(
    initialValue ?? { numEtud: "1", nom: "" ,prenom:"",email:""}
  );

  const [errors, setErrors] = useState<ZodFormattedError<PartialEtudiant>>();

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue);
    }
  }, [initialValue]);

  // Fonction de validation avec Zod
  const validateForm = (etudiant: PartialEtudiant) => {
    const schema = z.object({
      numEtud: z
        .string().length(8,{message:"le numero etudiant doit etre compose de 8 chiffres"}),
      nom: z
        .string()
        .min(1,{message:"le nom de l'etudiant est requis"}),
        prenom:z
        .string()
        .min(1,{message:"le prenom de l'etudiant est requis"}),
        email:z
        .string()
        .email({message:"L'adresse email est invalide"}),
    });

    const isValidInput = schema.safeParse(etudiant);

    if (!isValidInput.success) {
      setErrors(isValidInput.error.format());
      return false;
    } else {
      setErrors(undefined);
      return true;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm(form)) {
      onSubmit({
        id,
        numEtud: form.numEtud,
        nom: form.nom,
        prenom:form.prenom,
        email:form.email,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setForm({ numEtud: "1", nom: "",prenom:"",email:"" });
        onClose();
      }}
    >
      <h2 className="text-xl font-bold mb-4">Ajouter un etudiant</h2>
      <form onSubmit={handleSubmit}>
        {/* Champ numEtud */}
        <div className="mb-4">
          <Input
            id="numEtud"
            label="Numéro de l'etudiant"
            value={form.numEtud}
            onChange={(e) => {
              setForm((prevForm) => ({
                ...prevForm,
                numEtud: e.target.value,
              }));
            }}
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
            id="name"
            label="Nom"
            value={form.nom}
            onChange={(e) => {
              setForm((prevForm) => ({
                ...prevForm,
                nom: e.target.value,
              }));
            }}
          />
          {errors?.nom && (
            <p className="text-red-500 text-sm">
              {errors.nom._errors[0]}
            </p>
          )}
        </div>
 {/* Champ prenom */}
        <div className="mb-4">
          <Input
            id="prenom"
            label="Prenom"
            value={form.prenom}
            onChange={(e) => {
              setForm((prevForm) => ({
                ...prevForm,
                prenom: e.target.value,
              }));
            }}
          />
          {errors?.prenom && (
            <p className="text-red-500 text-sm">
              {errors.prenom._errors[0]}
            </p>
          )}
        </div>
        {/* Champ email */}
        <div className="mb-4">
          <Input
            id="email"
            label="Email"
            value={form.email}
            onChange={(e) => {
              setForm((prevForm) => ({
                ...prevForm,
                email: e.target.value,
              }));
            }}
          />
          {errors?.email && (
            <p className="text-red-500 text-sm">
              {errors.email._errors[0]}
            </p>
          )}
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-500 p-2 rounded-lg text-white hover:bg-blue-600"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </Modal>
  );
};
