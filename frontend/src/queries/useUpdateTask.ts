import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface Task {
  id: number
  done: boolean
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Task) => {
      const { data } = await axios.patch(
        `http://localhost:8000/api/tasks/${payload.id}/`,
        payload,
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      })
    },
  })
}
