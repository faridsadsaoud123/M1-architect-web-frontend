import { useEffect, useState } from "react";
import { Input } from "../../../components";
import { Ue } from "../hooks.tsx/useUesProvider";
import { z, type ZodFormattedError } from "zod";
import { ModalBody } from "../../../components/modalV2/ModalBody";
import { ModalV2 } from "../../../components/modalV2/modalV2";
import { ModalFooter } from "../../../components/modalV2/ModalFooter";
import { ModalTitle } from "../../../components/modalV2/ModalTitle";


export type PartialUe = Omit<Ue, "id"> | Ue;

type Props = {
  isOpen: boolean;
  onSubmit: (Ue: PartialUe) => void;
  onClose: () => void;
  id?: string;
  initialValue?: PartialUe;
};

export const UeModalForm: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  id,
  initialValue,
}) => {
  const [form, setForm] = useState<PartialUe>(
    initialValue ?? { numeroUe: "1", intitule: "" }
  );

  const [errors, setErrors] = useState<ZodFormattedError<PartialUe>>();

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue);
    }
  }, [initialValue]);

  // Fonction de validation avec Zod
  const validateForm = (ue: PartialUe) => {
    const schema = z.object({
      intitule: z
        .string()
        .min(1, { message: "Le nom de l'UE est requis" }),
      numeroUe: z
        .string()
        .regex(/^\d+$/, { message: "Le numéro d'UE doit être un nombre valide" })
        .min(1, { message: "Le numéro d'UE est requis" }),
    });

    const result = schema.safeParse(ue);

    if (!result.success) {
      setErrors(result.error.format());
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
        numeroUe: form.numeroUe,
        intitule: form.intitule,
      });
      onClose(); // Fermer le modal après une validation réussie
    }
  };
  const handleClose = () => {
    onClose();
  };
  return (
    <ModalV2
      isOpen={isOpen}
      onClose={() => {
        setForm({ numeroUe: "1", intitule: "" });
        setErrors(undefined); // Réinitialiser les erreurs en fermant le modal
        onClose();
      }}
    >
      <ModalTitle title="Ajouter une UE" />
      <form onSubmit={handleSubmit}>
        <ModalBody>
          {/* Champ Nom */}
          <div className="mb-4">
            <Input
              id="intitule"
              label="Nom de l'UE"
              value={form.intitule}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  intitule: e.target.value,
                }))
              }
            />
            {errors?.intitule && (
              <p className="text-red-500 text-sm">{errors.intitule._errors[0]}</p>
            )}
          </div>

          {/* Champ Numéro */}
          <div className="mb-4">
            <Input
              id="numeroUe"
              label="Numéro de l'UE"
              value={form.numeroUe}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  numeroUe: e.target.value,
                }))
              }
            />
            {errors?.numeroUe && (
              <p className="text-red-500 text-sm">{errors.numeroUe._errors[0]}</p>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
        <button className="bg-red-500 px-5 rounded-lg text-white hover:bg-red-600"
      onClick={handleClose}>
            Annuler
        </button>
          <button
            type="submit"
            className="bg-blue-500 p-2 rounded-lg text-white hover:bg-blue-600"
          >
            Enregistrer
          </button>
        </ModalFooter>
      </form>
    </ModalV2>
  );
};
