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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs, { Dayjs } from 'dayjs'
import { useTasks } from '@/queries/useTasks'
import { useCreateTask } from '@/queries/useCreateTask'
import { useUpdateTask } from '@/queries/useUpdateTask'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const now = new Date()
  const [filter, setFilter] = useState<'all' | 'completed' | 'not-completed'>(
    'all',
  )
  const isCompletedFilter =
    filter === 'completed' ? true : filter === 'not-completed' ? false : null

  const { data: tasks = [] } = useTasks({ done: isCompletedFilter })
  const { mutate: createTask } = useCreateTask()
  const { mutate: updateTask } = useUpdateTask()
  const [newTodoText, setNewTodoText] = useState('')
  const [newTodoDueDate, setNewTodoDueDate] = useState<Dayjs | null>(null)

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return
    createTask({
      title: newTodoText,
      due_date: newTodoDueDate ? newTodoDueDate.toISOString() : null,
    })
    setNewTodoText('')
    setNewTodoDueDate(null)
  }

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as 'all' | 'completed' | 'not-completed')
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Due Date (Optional)"
            value={newTodoDueDate}
            onChange={(newValue) => setNewTodoDueDate(newValue)}
            slotProps={{
              textField: { size: 'small', fullWidth: true },
            }}
          />
        </LocalizationProvider>
        <Button variant="contained" onClick={handleAddTodo}>
          Add
        </Button>
      </Box>

      <FormControl size="small" sx={{ mb: 2, minWidth: 120 }}>
        <InputLabel id="filter-select-label">Filter</InputLabel>
        <Select
          labelId="filter-select-label"
          value={filter}
          label="Filter"
          onChange={handleFilterChange}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="not-completed">Not Completed</MenuItem>
        </Select>
      </FormControl>

      <List>
        {tasks.map((task) => {
          const isPastDueDate = dayjs(now).isAfter(task.due_date)

          return (
            <ListItem key={task.id} disablePadding>
              <Checkbox
                checked={task.done}
                onChange={(event) => {
                  const checked = event.target.checked
                  updateTask({
                    id: task.id,
                    done: checked,
                  })
                }}
              />
              <ListItemText
                primary={task.title}
                secondary={
                  task.due_date
                    ? `Due: ${dayjs(task.due_date).format('YYYY-MM-DD HH:mm')}`
                    : null
                }
                sx={{
                  textDecoration: task.done ? 'line-through' : 'none',
                }}
                slotProps={{
                  secondary: {
                    color: isPastDueDate ? 'red' : undefined,
                  },
                }}
              />
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}
