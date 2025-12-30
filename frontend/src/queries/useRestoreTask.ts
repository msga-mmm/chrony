import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useRestoreTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: number) => {
      await axios.post(`http://localhost:8000/api/tasks/${taskId}/restore/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
    },
  });
}
