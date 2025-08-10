import { createFileRoute } from '@tanstack/react-router'
import { Checkbox, List, ListItem, ListItemText } from '@mui/material';
import { useTasks } from '@/queries/useTasks';


interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { data: tasks = [] } = useTasks()

  const todos: Array<Todo> = tasks.map(task => ({
    id: task.id,
    done: false,
    text: task.title
  }))

  return (
    <List>
      {todos.map((todo) => (
        <ListItem key={todo.id} disablePadding>
          <Checkbox checked={todo.done} />
          <ListItemText primary={todo.text} />
        </ListItem>
      ))}
    </List>
  )
}
