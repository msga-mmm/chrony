import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface TaskUpdate {
  id: number
  title?: string
  due_date?: string | null
  done?: boolean
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: TaskUpdate) => {
      const { data } = await axios.patch(
        `http://localhost:8000/api/tasks/${payload.id}/`,
        payload,
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
        exact: false,
      })
    },
  })
}
