import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false })
    },
  })
}
