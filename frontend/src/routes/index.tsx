import { createFileRoute } from '@tanstack/react-router'
import { List, ListItem, ListItemText, Checkbox } from '@mui/material';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const todos: Todo[] = [
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Finish report', done: true },
  { id: 3, text: 'Book flight', done: false },
];

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
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
