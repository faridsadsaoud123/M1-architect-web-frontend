import { useEffect, useState } from "react";
import { Input, InputSelect } from "../../../components";
import { Parcours } from "../hooks/useParcoursProvider";
import { z, type ZodFormattedError } from "zod";
import { ModalBody } from "../../../components/modalV2/ModalBody";
import { ModalV2 } from "../../../components/modalV2/modalV2";
import { ModalFooter } from "../../../components/modalV2/ModalFooter";
import { ModalTitle } from "../../../components/modalV2/ModalTitle";

export type PartialParcours = Omit<Parcours, "id"> | Parcours;

type Props = {
  isOpen: boolean;
  onSubmit: (parcours: PartialParcours) => void;
  onClose: () => void;
  id?: string;
  initialValue?: PartialParcours;
};

export const ParcoursModalForm: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  id,
  initialValue,
}) => {
  const [form, setForm] = useState<PartialParcours>(
    initialValue ?? { anneeFormation: 1, nomParcours: "" }
  );
  const [errors, setErrors] = useState<ZodFormattedError<PartialParcours>>();

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue);
    }
  }, [initialValue]);

  // Fonction de validation avec Zod
  const validateForm = (parcours: PartialParcours) => {
    const schema = z.object({
      nomParcours: z
        .string()
        .min(1, { message: "Le nom du parcours est requis" }),
      anneeFormation: z
        .number()
        .int({ message: "L'année de formation doit être un nombre entier" })
        .min(1, { message: "L'année de formation doit être au moins 1" })
        .max(2, { message: "L'année de formation doit être au maximum 2" }),
    });

    const isValidInput = schema.safeParse(parcours);

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
        nomParcours: form.nomParcours,
        anneeFormation: form.anneeFormation,
      });
    }
  };

  return (
    <ModalV2
      isOpen={isOpen}
      onClose={() => {
        setForm({ anneeFormation: 1, nomParcours: "" });
        onClose();
      }}
    >
      <ModalTitle title="Ajouter un parcours" />
      <form onSubmit={handleSubmit}>
        <ModalBody>
          {/* Champ Nom */}
          <div className="mb-4">
            <Input
              id="name"
              label="Nom du parcours"
              value={form.nomParcours}
              onChange={(e) => {
                setForm((prevForm) => ({
                  ...prevForm,
                  nomParcours: e.target.value,
                }));
              }}
            />
            {errors?.nomParcours && (
              <p className="text-red-500 text-sm">
                {errors.nomParcours._errors[0]}
              </p>
            )}
          </div>

          {/* Champ Année */}
          <div className="mb-4">
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
            {errors?.anneeFormation && (
              <p className="text-red-500 text-sm">
                {errors.anneeFormation._errors[0]}
              </p>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
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
