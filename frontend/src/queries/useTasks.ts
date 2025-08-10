import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface Task {
  id: number
  title: string
  created_at: string
  done: boolean
}

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:8000/api/tasks/')
      return data
    },
  })
}
