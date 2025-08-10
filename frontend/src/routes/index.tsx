import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material'
import { useTasks } from '@/queries/useTasks'
import { useCreateTask } from '@/queries/useCreateTask'

interface Todo {
  id: number
  text: string
  done: boolean
}

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { data: tasks = [] } = useTasks()
  const { mutate: createTask } = useCreateTask()
  const todos: Array<Todo> = tasks.map((task) => ({
    id: task.id,
    done: task.done,
    text: task.title,
  }))
  const [newTodoText, setNewTodoText] = useState('')

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return
    createTask({
      title: newTodoText,
    })
    setNewTodoText('')
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          label="New todo"
          variant="outlined"
          fullWidth
          size="small"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddTodo()
            }
          }}
        />
        <Button variant="contained" onClick={handleAddTodo}>
          Add
        </Button>
      </Box>

      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id} disablePadding>
            <Checkbox checked={todo.done} />
            <ListItemText
              primary={todo.text}
              sx={{
                textDecoration: todo.done ? 'line-through' : 'none',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
