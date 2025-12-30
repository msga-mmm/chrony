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
  Typography,
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
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftDescription, setDraftDescription] = useState('')
  const [draftDueDate, setDraftDueDate] = useState<Dayjs | null>(null)

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as 'all' | 'completed' | 'not-completed')
  }

  const handleCreateOpen = () => {
    setDialogMode('create')
    setEditingTask(null)
    setDraftTitle('')
    setDraftDescription('')
    setDraftDueDate(null)
  }

  const handleEditOpen = (task: Task) => {
    setDialogMode('edit')
    setEditingTask(task)
    setDraftTitle(task.title)
    setDraftDescription(task.description ?? '')
    setDraftDueDate(task.due_date ? dayjs(task.due_date) : null)
  }

  const handleDialogClose = () => {
    setDialogMode(null)
    setEditingTask(null)
    setDraftTitle('')
    setDraftDescription('')
    setDraftDueDate(null)
  }

  const handleDialogSave = () => {
    const trimmedTitle = draftTitle.trim()
    if (!trimmedTitle) return

    const payload = {
      title: trimmedTitle,
      due_date: draftDueDate ? draftDueDate.toISOString() : null,
      description: draftDescription.trim() || null,
    }

    if (dialogMode === 'edit') {
      if (!editingTask) return
      updateTask({
        id: editingTask.id,
        ...payload,
      })
    } else {
      createTask(payload)
    }

    handleDialogClose()
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
          mb: 2,
        }}
      >
        <Button variant="contained" onClick={handleCreateOpen}>
          Add
        </Button>
        <FormControl size="small" sx={{ minWidth: 120 }}>
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

        <FormControl size="small" sx={{ minWidth: 120 }}>
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
      </Box>

      <List>
        {tasks.map((task) => {
          const secondary =
            task.description || task.due_date ? (
              <>
                {task.description ? (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'block' }}
                  >
                    {task.description}
                  </Typography>
                ) : null}
                {task.due_date ? (
                  <Typography
                    component="span"
                    variant="body2"
                    color={task.is_past_due ? 'error.main' : 'text.secondary'}
                    sx={{ display: 'block' }}
                  >
                    Due: {dayjs(task.due_date).format('YYYY-MM-DD HH:mm')}
                  </Typography>
                ) : null}
              </>
            ) : null

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
                secondary={secondary}
                sx={{
                  textDecoration: task.done ? 'line-through' : 'none',
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

      <Dialog open={dialogMode !== null} onClose={handleDialogClose} fullWidth>
        <DialogTitle>
          {dialogMode === 'edit' ? 'Edit Task' : 'New Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              label="Task title"
              variant="outlined"
              size="small"
              fullWidth
            />
            <TextField
              value={draftDescription}
              onChange={(event) => setDraftDescription(event.target.value)}
              label="Description (optional)"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              minRows={3}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Due Date (Optional)"
                value={draftDueDate}
                onChange={(newValue) => setDraftDueDate(newValue)}
                slotProps={{
                  textField: { size: 'small', fullWidth: true },
                }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleDialogSave}
            disabled={!draftTitle.trim()}
          >
            {dialogMode === 'edit' ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
