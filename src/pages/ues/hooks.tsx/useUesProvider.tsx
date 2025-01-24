import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export type Ue = {
  id: string
  numeroUe: string
  intitule: string
}

const LOCAL_STORAGE_KEY = "uesData"

// Helper pour obtenir les données depuis le localStorage
const getUesFromLocalStorage = (): Ue[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

// Helper pour sauvegarder les données dans le localStorage
const setUesToLocalStorage = (ues: Ue[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ues))
}

// Initialisation des données dans le localStorage si absent
if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
  setUesToLocalStorage([
    { id: "1", numeroUe: "1", intitule: "BD2" },
    { id: "2", numeroUe: "2", intitule: "WEB2" },
    { id: "3", numeroUe: "3", intitule: "GL2" },
  ])
}

// Hook pour la création d'une UE
export const useCreateUe = () => {
  type Input = { numeroUe: string; intitule: string }
  const queryClient = useQueryClient()

  const createUe = async ({ numeroUe, intitule }: Input): Promise<Ue> => {
    const newUe: Ue = {
      id: Date.now().toString(),
      numeroUe,
      intitule,
    }
    return newUe
  }

  return useMutation<Ue, Error, Input>({
    mutationFn: createUe,
    onMutate: async (newUe) => {
      await queryClient.cancelQueries({queryKey: ["ue"],})

      const previousUes = queryClient.getQueryData<Ue[]>(["ue",])

      const optimisticUe = { id: Date.now().toString(), ...newUe }
      queryClient.setQueryData<Ue[]>(["ue"], (old) => {
        setUesToLocalStorage([...(old || []), optimisticUe])
        return [...(old || []), optimisticUe]
      })

      return { previousUes }
    },
  })
}

// Hook pour la récupération de la liste des UEs
export const useListUes = () => {
  const fetchUes = async (): Promise<Ue[]> => {
    return getUesFromLocalStorage()
  }
  return useQuery<Ue[], Error>({queryKey: ["ue"], queryFn :fetchUes})
}

// Hook pour la mise à jour d'une UE
export const useUpdateUes = () => {
  type Input = { id: string; numeroUe?: string; intitule: string }
  const queryClient = useQueryClient()

  const updateUe = async ({ id, numeroUe, intitule }: Input): Promise<Ue> => {
    const currentData = getUesFromLocalStorage()
    const updatedData = currentData.map((ue) =>
      ue.id === id
        ? { ...ue, numeroUe: numeroUe || ue.numeroUe, intitule }
        : ue
    )
    setUesToLocalStorage(updatedData)
    return updatedData.find((ue) => ue.id === id)!
  }

  return useMutation<Ue, Error, Input>({
    mutationFn: updateUe,
    onMutate: async (updatedUe) => {
      

      const previousUes = queryClient.getQueryData<Ue[]>(["ue"])

      queryClient.setQueryData<Ue[]>(["ue"], (old) =>
        (old || []).map((ue) =>
          ue.id === updatedUe.id ? { ...ue, ...updatedUe } : ue
        )
      )

      return { previousUes }
    },
    
  })
}

// Hook pour la suppression d'une UE
export const useDeleteUes = () => {
  type Input = { id: string }
  const queryClient = useQueryClient()

  const deleteUe = async ({ id }: Input): Promise<void> => {
    const currentData = getUesFromLocalStorage()
    const updatedData = currentData.filter((ue) => ue.id !== id)
    setUesToLocalStorage(updatedData)
  }

  return useMutation<void, Error, Input>({
    mutationFn: deleteUe,
    onMutate: async (deletedUe) => {

      const previousUes = queryClient.getQueryData<Ue[]>(["ue"])

      queryClient.setQueryData<Ue[]>(["ue"], (old) =>
        (old || []).filter((ue) => ue.id !== deletedUe.id)
      )

      return { previousUes }
    },
    
  })
}
