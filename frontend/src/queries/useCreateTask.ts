import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface Task {
  title: string
  due_date?: string | null
  description?: string | null
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Task) => {
      const { data } = await axios.post(
        'http://localhost:8000/api/tasks/',
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
