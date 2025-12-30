import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  type SelectChangeEvent,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs, { Dayjs } from 'dayjs'
import { useTasks, type Task } from '@/queries/useTasks'
import { useCreateTask } from '@/queries/useCreateTask'
import { useUpdateTask } from '@/queries/useUpdateTask'
import { useDeleteTask } from '@/queries/useDeleteTask'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'not-completed'>(
    'all',
  )
  const [dueStatusFilter, setDueStatusFilter] = useState<
    'all' | 'past-due' | 'upcoming'
  >('all')

  const isCompletedFilter =
    filter === 'completed' ? true : filter === 'not-completed' ? false : null

  const isPastDueFilter =
    dueStatusFilter === 'past-due'
      ? true
      : dueStatusFilter === 'upcoming'
        ? false
        : undefined

  const { data: tasks = [] } = useTasks({
    done: isCompletedFilter,
    isPastDue: isPastDueFilter,
  })
  const { mutate: createTask } = useCreateTask()
  const { mutate: updateTask } = useUpdateTask()
  const { mutate: deleteTask } = useDeleteTask()
  const [newTodoText, setNewTodoText] = useState('')
  const [newTodoDueDate, setNewTodoDueDate] = useState<Dayjs | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDueDate, setEditDueDate] = useState<Dayjs | null>(null)

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

  const handleEditOpen = (task: Task) => {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDueDate(task.due_date ? dayjs(task.due_date) : null)
  }

  const handleEditClose = () => {
    setEditingTask(null)
    setEditTitle('')
    setEditDueDate(null)
  }

  const handleEditSave = () => {
    if (!editingTask) return
    const trimmedTitle = editTitle.trim()
    if (!trimmedTitle) return
    updateTask({
      id: editingTask.id,
      title: trimmedTitle,
      due_date: editDueDate ? editDueDate.toISOString() : null,
    })
    handleEditClose()
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
        <InputLabel id="filter-select-label">Status Filter</InputLabel>
        <Select
          labelId="filter-select-label"
          value={filter}
          label="Status Filter"
          onChange={handleFilterChange}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="not-completed">Not Completed</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ mb: 2, minWidth: 120, ml: 2 }}>
        <InputLabel id="due-status-filter-select-label">
          Due Date Filter
        </InputLabel>
        <Select
          labelId="due-status-filter-select-label"
          value={dueStatusFilter}
          label="Due Date Filter"
          onChange={(event) =>
            setDueStatusFilter(
              event.target.value as 'all' | 'past-due' | 'upcoming',
            )
          }
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="past-due">Past Due</MenuItem>
          <MenuItem value="upcoming">Upcoming</MenuItem>
        </Select>
      </FormControl>

      <List>
        {tasks.map((task) => {
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
                    color: task.is_past_due ? 'red' : undefined,
                  },
                }}
              />
              <IconButton
                aria-label="edit"
                onClick={() => handleEditOpen(task)}
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => deleteTask(task.id)}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          )
        })}
      </List>

      <Dialog open={Boolean(editingTask)} onClose={handleEditClose} fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              label="Task title"
              variant="outlined"
              size="small"
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Due Date (Optional)"
                value={editDueDate}
                onChange={(newValue) => setEditDueDate(newValue)}
                slotProps={{
                  textField: { size: 'small', fullWidth: true },
                }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditSave}
            disabled={!editTitle.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
