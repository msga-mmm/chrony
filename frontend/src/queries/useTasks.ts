import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface Task {
  id: number
  title: string
  created_at: string
  done: boolean
  due_date: string | null
}

interface UseTasksParams {
  done?: boolean | null
}

export function useTasks(params?: UseTasksParams) {
  return useQuery<Task[]>({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:8000/api/tasks/', {
        params,
      })
      return data
    },
  })
}
