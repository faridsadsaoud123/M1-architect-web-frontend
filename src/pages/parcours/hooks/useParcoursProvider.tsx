import { Input } from "../../../components"
//const API_URL = import.meta.env.VITE_API_URL

import { useMutation,useQuery, useQueryClient } from "@tanstack/react-query"

export type Parcours = {
  id: string
  nomParcours: string
  anneeFormation: number
}

const LOCAL_STORAGE_KEY = "parcoursData"

const getParcoursFromLocalStorage = (): Parcours[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

const setParcoursToLocalStorage = (parcours: Parcours[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parcours))
}

if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
  setParcoursToLocalStorage([
    {
      id: "1",
      nomParcours: "Informatique",
      anneeFormation: 1,
    },
    {
      id: "2",
      nomParcours: "Miage",
      anneeFormation: 2,
    },
    {
      id: "3",
      nomParcours: "Maths",
      anneeFormation: 3,
    },
  ])
}

export const useCreateParcours = () => {
  type Input = {
    nomParcours: string
    anneeFormation: number
  }

  const queryClient = useQueryClient()

  const createParcours = async ({
    nomParcours,
    anneeFormation,
  }: Input): Promise<Parcours> => {
    const newParcours: Parcours = {
      id: Date.now().toString(),
      nomParcours,
      anneeFormation,
    }

    return newParcours
  }

  return useMutation<Parcours, Error, Input>({
    mutationFn: createParcours,
    onMutate: async (newParcours) => {
      await queryClient.cancelQueries({
        queryKey: ["parcours"],
      })

      const previousParcours = queryClient.getQueryData<Parcours[]>([
        "parcours",
      ])

      const optimisticParcours = {
        id: Date.now().toString(),
        ...newParcours,
      }
      queryClient.setQueryData<Parcours[]>(["parcours"], (old) => {
        setParcoursToLocalStorage([...(old || []), optimisticParcours])
        return [...(old || []), optimisticParcours]
      })

      return { previousParcours }
    },
  })
}

export const useListParcours = () => {
  const fetchParcours = async (): Promise<Parcours[]> => {
    return getParcoursFromLocalStorage()
  }

  return useQuery<Parcours[], Error>({
    queryKey: ["parcours"],
    queryFn: fetchParcours,
  })
}

export const useUpdateParcours = () => {
  type Input = {
    id: string
    nomParcours?: string
    anneeFormation: number
  }

  const queryClient = useQueryClient()

  const updateParcours = async ({
    id,
    nomParcours,
    anneeFormation,
  }: Input): Promise<Parcours> => {
    const currentData = getParcoursFromLocalStorage()
    const updatedData = currentData.map((parcours) =>
      parcours.id === id
        ? {
            ...parcours,
            nomParcours: nomParcours || parcours.nomParcours,
            anneeFormation,
          }
        : parcours
    )

    return updatedData.find((parcours) => parcours.id === id)!
  }

  return useMutation<Parcours, Error, Input>({
    mutationFn: updateParcours,
    onMutate: async (updatedParcours) => {
      const previousParcours = queryClient.getQueryData<Parcours[]>([
        "parcours",
      ])

      queryClient.setQueryData<Parcours[]>(["parcours"], (old) => {
        setParcoursToLocalStorage(
          (old || []).map((parcours) =>
            parcours.id === updatedParcours.id
              ? { ...parcours, ...updatedParcours }
              : parcours
          )
        )

        return (old || []).map((parcours) =>
          parcours.id === updatedParcours.id
            ? { ...parcours, ...updatedParcours }
            : parcours
        )
      })

      return { previousParcours }
    },
  })
}

export const useDeleteParcours = () => {
  type Input = {
    id: string
  }

  const deleteParcours = async ({ id }: Input): Promise<{ id: string }> => {
    const currentData = getParcoursFromLocalStorage()
    setParcoursToLocalStorage(currentData.filter((p) => p.id !== id))

    return { id }
  }

  const queryClient = useQueryClient()

  return useMutation<{ id: string }, Error, Input>({
    mutationFn: deleteParcours,
    onMutate: ({ id }) => {
      queryClient.setQueryData<Parcours[]>(["parcours"], (old) => {
        if (!old) return []
        return old.filter((p) => p.id !== id)
      })
    },
  })
}
