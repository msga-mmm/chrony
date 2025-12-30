import { createFileRoute } from '@tanstack/react-router';
import { useTasks } from '../queries/useTasks'; // Changed from useDeletedTasks
import { useRestoreTask } from '../queries/useRestoreTask';

export const Route = createFileRoute('/deleted-tasks')({
  component: DeletedTasksComponent,
});

function DeletedTasksComponent() {
  const { data: deletedTasks, isLoading, isError } = useTasks({ deleted: true }); // Changed to useTasks with deleted: true
  const { mutate: restoreTask } = useRestoreTask();

  if (isLoading) {
    return <div>Loading deleted tasks...</div>;
  }

  if (isError) {
    return <div>Error loading deleted tasks.</div>;
  }

  const handleRestore = (taskId: number) => {
    restoreTask(taskId);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Deleted Tasks</h1>
      {deletedTasks && deletedTasks.length > 0 ? (
        <ul className="space-y-2">
          {deletedTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between bg-white shadow-sm rounded-md p-3"
            >
              <span className="text-lg text-gray-800 line-through">
                {task.title}
              </span>
              <button
                onClick={() => handleRestore(task.id)}
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Restore
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No deleted tasks found.</p>
      )}
    </div>
  );
}
