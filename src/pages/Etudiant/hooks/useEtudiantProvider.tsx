import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
export type Etudiant = {
  id: string
  numEtud: string
  nom: string
  prenom: string
  email: string
}

const LOCAL_STORAGE_KEY = "etudiantsData"

const getEtudiantFromLocalStorage = (): Etudiant[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

const setEtudiantToLocalStorage = (etudiant: Etudiant[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(etudiant))
}

if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
  setEtudiantToLocalStorage([
    {
      id: "1",
      numEtud: "122235",
      nom: "farid",
      prenom: "sad",
      email: "fsadfar@gmail.com",
    },
    {
      id: "2",
      numEtud: "122236",
      nom: "john",
      prenom: "john",
      email: "john@gmail.com",
    },
    {
      id: "3",
      numEtud: "122237",
      nom: "lucas",
      prenom: "lucas",
      email: "lucas@gmail.com",
    },
  ])
}

export const useCreateEtudiant = () => {
  type Input = {
    numEtud: string
    nom: string
    prenom: string
    email: string
  }

  const queryClient = useQueryClient()

  const createEtudiant = async ({
    numEtud,
    nom,
    prenom,
    email,
  }: Input): Promise<Etudiant> => {
    const newEtudiant: Etudiant = {
      id: Date.now().toString(),
      numEtud,
      nom,
      prenom,
      email,
    }

    return newEtudiant
  }

  return useMutation<Etudiant, Error, Input>({
    mutationFn: createEtudiant,
    onMutate: async (newEtudiant) => {
      await queryClient.cancelQueries({
        queryKey: ["etudiant"],
      })

      const previousEtudiant = queryClient.getQueryData<Etudiant[]>([
        "etudiant",
      ])

      const optimisticEtudiant = {
        id: Date.now().toString(),
        ...newEtudiant,
      }
      queryClient.setQueryData<Etudiant[]>(["etudiant"], (old) => {
        setEtudiantToLocalStorage([...(old || []), optimisticEtudiant])
        return [...(old || []), optimisticEtudiant]
      })

      return { previousEtudiant }
    },
  })
}

export const useListEtudiant = () => {
  const fetchEtudiant = async (): Promise<Etudiant[]> => {
    return getEtudiantFromLocalStorage()
  }

  return useQuery<Etudiant[], Error>({
    queryKey: ["etudiant"],
    queryFn: fetchEtudiant,
  })
}

export const useUpdateEtudiant = () => {
  type Input = {
    id: string
    numEtud?: string
    nom: string
    prenom: string
    email: string
  }

  const queryClient = useQueryClient()

  const updateEtudiant = async ({
    id,
    numEtud,
    nom,
    prenom,
    email,
  }: Input): Promise<Etudiant> => {
    const currentData = getEtudiantFromLocalStorage()
    const updatedData = currentData.map((etudiant) =>
      etudiant.id === id
        ? {
            ...etudiant,
            numEtud: numEtud || etudiant.numEtud,
            nom: nom || etudiant.nom,
            prenom: prenom || etudiant.prenom,
            email: email || etudiant.email,
          }
        : etudiant
    )

    return updatedData.find((etudiant) => etudiant.id === id)!
  }

  return useMutation<Etudiant, Error, Input>({
    mutationFn: updateEtudiant,
    onMutate: async (updatedEtudiant) => {
      const previousEtudiant = queryClient.getQueryData<Etudiant[]>([
        "etudiant",
      ])

      queryClient.setQueryData<Etudiant[]>(["etudiant"], (old) => {
        setEtudiantToLocalStorage(
          (old || []).map((etudiant) =>
            etudiant.id === updatedEtudiant.id
              ? { ...etudiant, ...updatedEtudiant }
              : etudiant
          )
        )

        return (old || []).map((etudiant) =>
          etudiant.id === updatedEtudiant.id
            ? { ...etudiant, ...updatedEtudiant }
            : etudiant
        )
      })

      return { previousEtudiant }
    },
  })
}

export const useDeleteEtudiant = () => {
  type Input = {
    id: string
  }

  const deleteEtudiant = async ({ id }: Input): Promise<{ id: string }> => {
    const currentData = getEtudiantFromLocalStorage()
    setEtudiantToLocalStorage(currentData.filter((p) => p.id !== id))

    return { id }
  }

  const queryClient = useQueryClient()

  return useMutation<{ id: string }, Error, Input>({
    mutationFn: deleteEtudiant,
    onMutate: ({ id }) => {
      queryClient.setQueryData<Etudiant[]>(["etudiant"], (old) => {
        if (!old) return []
        return old.filter((p) => p.id !== id)
      })
    },
  })
}
