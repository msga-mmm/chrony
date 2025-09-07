import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      })
    },
  })
}

