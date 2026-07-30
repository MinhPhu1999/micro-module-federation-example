# Phase 4: Todo App

> Master spec: `prompt-todo.md` (không sửa)
>
> Điều kiện: Phase 1 + 2 + 3 đã hoàn thành và verify OK.
>
> Mục tiêu: Xây dựng todo app với CRUD, Table, Search, Pagination, TanStack Query.

---

## 1. Files cần tạo / sửa

```
apps/todo/src/
│
├── types/
│   └── shared.d.ts              (type stubs cho shared/ MF imports — cần cho TypeScript)
│
├── pages/
│   └── TodoList.tsx             (main page: named export + default export)
│
├── components/
│   ├── TodoTable.tsx            (table component)
│   ├── TodoFilters.tsx          (search input + filter by completed)
│   ├── CreateTodoModal.tsx      (modal form tạo todo)
│   └── EditTodoModal.tsx        (modal form sửa todo, hiển thị completed_at)
│
├── App.tsx                      (standalone mode)
├── main.tsx                     (giữ nguyên)

Sửa:
  apps/todo/vite.config.ts       (thêm exposes + remotes.shared + shared deps)
  apps/todo/package.json         (thêm i18next + react-i18next)
```

---

## 2. Rules từ Master cần tuân thủ

### Todo App (master:440-540)
- Danh sách Todo: Table, Search, Pagination
- Thêm Todo: Modal form
- Sửa Todo: Modal form, load dữ liệu hiện tại
- Xóa Todo: ConfirmDialog
- Refresh danh sách sau CRUD
- Toast success/error cho mọi operation
- **KHÔNG có Sort** (Backend không hỗ trợ)

### TanStack Query Patterns (master:792-830)
- Query keys theo domain: `todoKeys.all`, `todoKeys.lists()`, `todoKeys.list(params)`, `todoKeys.detail(id)`
- useQuery cho GET list + GET by id
- useMutation cho create/update/delete
- invalidateQueries sau mutation để refresh danh sách

### Form Standard (master:216-270)
- RHF + Zod + shared components
- Schemas: `createTodoSchema`, `updateTodoSchema` từ shared/schemas
- Disable submit khi invalid / loading
- Validation constraints: title max 160, description max 2000

### Todo Validation (master:466-540, 253-270)
- Thêm: Title required max 160, description optional max 2000
- Sửa: Load title + description + completed hiện tại
- Xóa: ConfirmDialog "Bạn có chắc muốn xóa?"

### API Query Params (master:457-460)
- `?pageSize=10&pageNumber=1&completed=true&search=keyword`
- Query params: `pageNumber`/`pageSize`, Response meta: `page`/`limit`
- Search: case-insensitive, tìm trong title + description

### Toast (master:274-305)
- `useToast()` từ shared
- Create success → toast
- Update success → toast
- Delete success → toast
- Error → toast với error code message

### Coding Convention (master:769-830)
- PascalCase files
- Named export
- Import order: react → tanstack → shared → internal

### Tailwind prefix (master:718-778)
- Prefix `todo-`
- Shared components dùng `sh-`

### Module Federation (master:614-619)
- Expose: `./TodoPage`

### State Management (master:792-830)
- Dùng TanStack Query cho server state
- QueryClientProvider ở App.tsx

---

## 3. Spec chi tiết

### 3.1 TanStack Query Keys & Hooks (defined in shared app, Phase 2)

These hooks are defined in `shared/hooks/` (Phase 2). Import them directly:

```ts
import { useTodos, todoKeys } from 'shared/useTodos'
import { useCreateTodo } from 'shared/useCreateTodo'
import { useUpdateTodo } from 'shared/useUpdateTodo'
import { useDeleteTodo } from 'shared/useDeleteTodo'
```

### 3.2 TodoList Page

**File:** `pages/TodoList.tsx`

**Expose name:** `./TodoPage`

**Layout:**
```
+------------------------------------------+
|  Danh sách công việc    [+ Thêm]         |
+------------------------------------------+
|  [Search...]    [Tất cả/Làm xong/Chưa]   |
+------------------------------------------+
|  STT | Tiêu đề | Trạng thái | Hành động |
|  ----+---------+------------+----------- |
|  1   | Học...  | Hoàn thành | [Sửa][Xoá] |
|  2   | Làm...  | Chưa       | [Sửa][Xoá] |
+------------------------------------------+
|  < 1 2 3 ... >         10 / 50 công việc |
+------------------------------------------+
```

**Code structure:**

```tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useAuth } from 'shared/AuthContext'
import { useTodos } from 'shared/useTodos'
import { useDeleteTodo } from 'shared/useDeleteTodo'
import { useToast } from 'shared/ToastContext'
import { Spinner } from 'shared/Spinner'
import { EmptyState } from 'shared/EmptyState'
import { ErrorState } from 'shared/ErrorState'
import { Button } from 'shared/Button'
import { Pagination } from 'shared/Pagination'
import { ConfirmDialog } from 'shared/ConfirmDialog'
import { Skeleton } from 'shared/Skeleton'
import { TodoTable } from '../components/TodoTable'
import { TodoFilters } from '../components/TodoFilters'
import { CreateTodoModal } from '../components/CreateTodoModal'
import { EditTodoModal } from '../components/EditTodoModal'

export const TodoListPage = () => {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const deleteMutation = useDeleteTodo()

  // State
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [completed, setCompleted] = useState<boolean | undefined>()
  const [createOpen, setCreateOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  // Query
  const { data, isLoading, isError, error, refetch } = useTodos({
    pageNumber: page,
    pageSize,
    search: search || undefined,
    completed,
  })

  // Auth guard (standalone)
  if (authLoading) return <Spinner />
  if (!isAuthenticated) {
    navigate('/login', { replace: true })
    return null
  }

  if (isError) {
    return <ErrorState title={t('common.error')} message={(error as Error)?.message} onRetry={refetch} />
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget)
      toast.success(t('todo.delete_success'))
      setDeleteTarget(null)
    } catch (err) {
      const e = err as { displayMessage?: string }
      toast.error(e.displayMessage || t('todo.delete_failed'))
    }
  }

  return (
    <div className="todo-p-6 todo-max-w-6xl todo-mx-auto">
      <div className="todo-flex todo-justify-between todo-items-center todo-mb-6">
        <h1 className="todo-text-2xl todo-font-bold">{t('todo.page_title')}</h1>
        <Button onClick={() => setCreateOpen(true)}>{t('common.add')}</Button>
      </div>

      <TodoFilters search={search} onSearchChange={setSearch} completed={completed} onCompletedChange={setCompleted} />

      {isLoading ? (
        <Skeleton variant="rect" className="todo-h-64" />
      ) : data && data.todos.length > 0 ? (
        <>
          <TodoTable
            todos={data.todos}
            onEdit={(id) => setEditingTodo(id)}
            onDelete={(id) => setDeleteTarget(id)}
          />
          <Pagination
            page={data.meta.page}
            limit={data.meta.limit}
            total={data.meta.total}
            totalPages={data.meta.total_pages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState
          title={t('todo.empty_title')}
          description={search ? t('todo.empty_search') : t('todo.empty_create_hint')}
          // Shared EmptyState nhận action dạng { label, onClick }, không phải ReactNode
          action={search ? undefined : { label: t('todo.create'), onClick: () => setCreateOpen(true) }}
        />
      )}

      <CreateTodoModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditTodoModal todoId={editingTodo} onClose={() => setEditingTodo(null)} />
      <ConfirmDialog
        // Shared ConfirmDialog dùng isOpen, không phải open, và không có prop isLoading
        isOpen={!!deleteTarget}
        title={t('todo.delete_title')}
        message={t('todo.delete_confirm')}
        confirmLabel={t('common.delete')}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
```

### 3.3 TodoTable Component

```tsx
import { useTranslation } from 'react-i18next'
import { Table } from 'shared/Table'
import { Button } from 'shared/Button'
import { formatDate } from 'shared/formatDate'
import type { Todo } from 'shared/types'

interface TodoTableProps {
  todos: Todo[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const TodoTable = ({ todos, onEdit, onDelete }: TodoTableProps) => {
  const { t } = useTranslation()

  const columns = [
    { key: 'title', header: t('todo.title') },
    {
      key: 'completed',
      header: t('todo.status'),
      render: (todo: Todo) => (
        <span className={`todo-px-2 todo-py-1 todo-rounded todo-text-xs ${
          todo.completed ? 'todo-bg-green-100 todo-text-green-800' : 'todo-bg-yellow-100 todo-text-yellow-800'
        }`}>
          {todo.completed ? t('todo.completed') : t('todo.incomplete')}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: t('todo.created_at'),
      render: (todo: Todo) => formatDate(todo.created_at),
    },
    {
      key: 'actions',
      header: t('todo.actions'),
      render: (todo: Todo) => (
        <div className="todo-flex todo-gap-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(todo.id)}>{t('common.edit')}</Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(todo.id)}>{t('common.delete')}</Button>
        </div>
      ),
    },
  ]

  return <Table columns={columns} data={todos} />
}
```

### 3.4 TodoFilters Component

```tsx
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'shared/useDebounce'
import { Input } from 'shared/Input'
import { Select } from 'shared/Select'

interface TodoFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  completed: boolean | undefined
  onCompletedChange: (value: boolean | undefined) => void
}

export const TodoFilters = ({ search, onSearchChange, completed, onCompletedChange }: TodoFiltersProps) => {
  const { t } = useTranslation()
  const [localSearch, setLocalSearch] = useState(search)
  const debouncedSearch = useDebounce(localSearch, 300)

  useEffect(() => {
    onSearchChange(debouncedSearch)
  }, [debouncedSearch, onSearchChange])

  const statusOptions = [
    { value: 'all', label: t('todo.filter_all') },
    { value: 'false', label: t('todo.filter_incomplete') },
    { value: 'true', label: t('todo.filter_completed') },
  ]

  return (
    <div className="todo-flex todo-gap-4 todo-mb-4">
      <Input
        placeholder={t('todo.search_placeholder')}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="todo-flex-1"
      />
      <Select
        value={completed === undefined ? 'all' : String(completed)}
        onChange={(e) => {
          const val = e.target.value
          onCompletedChange(val === 'all' ? undefined : val === 'true')
        }}
        options={statusOptions}
      />
    </div>
  )
}
```

### 3.5 CreateTodoModal Component

```tsx
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTodo } from 'shared/useCreateTodo'
import { useToast } from 'shared/ToastContext'
import { Modal } from 'shared/Modal'
import { Input } from 'shared/Input'
import { TextArea } from 'shared/TextArea'
import { Button } from 'shared/Button'
import { createTodoSchema } from 'shared/schemas'
import type { CreateTodoForm } from 'shared/types'

interface CreateTodoModalProps {
  open: boolean
  onClose: () => void
}

export const CreateTodoModal = ({ open, onClose }: CreateTodoModalProps) => {
  const { t } = useTranslation()
  const toast = useToast()
  const createMutation = useCreateTodo()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateTodoForm>({
    resolver: zodResolver(createTodoSchema),
  })

  const onSubmit = async (data: CreateTodoForm) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success(t('todo.create_success'))
      reset()
      onClose()
    } catch (err) {
      const e = err as { displayMessage?: string }
      toast.error(e.displayMessage || t('todo.create_failed'))
    }
  }

  return (
    // Shared Modal dùng isOpen, không phải open
    <Modal isOpen={open} onClose={onClose} title={t('todo.create_title')}>
      <form onSubmit={handleSubmit(onSubmit)} className="todo-space-y-4">
        <Input label={t('todo.title')} {...register('title')} error={errors.title?.message} />
        <TextArea label={t('todo.description')} {...register('description')} error={errors.description?.message} />
        <div className="todo-flex todo-justify-end todo-gap-3">
          <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" isLoading={isSubmitting}>{t('common.create')}</Button>
        </div>
      </form>
    </Modal>
  )
}
```

### 3.6 EditTodoModal Component

```tsx
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { todoApi } from 'shared/todoApi'
import { useUpdateTodo } from 'shared/useUpdateTodo'
import { todoKeys } from 'shared/useTodos'
import { useToast } from 'shared/ToastContext'
import { Modal } from 'shared/Modal'
import { Input } from 'shared/Input'
import { TextArea } from 'shared/TextArea'
import { Checkbox } from 'shared/Checkbox'
import { Button } from 'shared/Button'
import { Spinner } from 'shared/Spinner'
import { ErrorState } from 'shared/ErrorState'
import { formatDate } from 'shared/formatDate'
import { updateTodoSchema } from 'shared/schemas'
import type { UpdateTodoForm, Todo } from 'shared/types'

interface EditTodoModalProps {
  todoId: string | null
  onClose: () => void
}

export const EditTodoModal = ({ todoId, onClose }: EditTodoModalProps) => {
  const { t } = useTranslation()
  const toast = useToast()
  const updateMutation = useUpdateTodo()
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<UpdateTodoForm>({
    resolver: zodResolver(updateTodoSchema),
  })

  const { data: todoData, isLoading, isError } = useQuery({
    queryKey: todoKeys.detail(todoId!),
    queryFn: async () => {
      const { data } = await todoApi.getById(todoId!)
      return data.data as Todo
    },
    enabled: !!todoId,
  })

  useEffect(() => {
    if (todoData) {
      reset({
        title: todoData.title,
        description: todoData.description,
        completed: todoData.completed,
      })
    }
  }, [todoData, reset])

  const onSubmit = async (data: UpdateTodoForm) => {
    if (!todoId) return
    try {
      await updateMutation.mutateAsync({ id: todoId, data })
      toast.success(t('todo.update_success'))
      onClose()
    } catch (err) {
      const e = err as { displayMessage?: string }
      toast.error(e.displayMessage || t('todo.update_failed'))
    }
  }

  return (
    // Shared Modal dùng isOpen, không phải open; Checkbox dùng Controller để quản lý checked
    <Modal isOpen={!!todoId} onClose={onClose} title={t('todo.edit_title')}>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState title={t('todo.edit_load_error')} onRetry={() => reset()} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="todo-space-y-4">
          <Input label={t('todo.title')} {...register('title')} error={errors.title?.message} />
          <TextArea label={t('todo.description')} {...register('description')} error={errors.description?.message} />
          <Controller
            name="completed"
            control={control}
            render={({ field }) => (
              <Checkbox
                label={t('todo.completed')}
                checked={field.value ?? false}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
          {todoData?.completed && todoData?.completed_at && (
            <p className="todo-text-sm todo-text-gray-500">
              {t('todo.completed_at')}: {formatDate(todoData.completed_at)}
            </p>
          )}
          <div className="todo-flex todo-justify-end todo-gap-3">
            <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="submit" isLoading={isSubmitting}>{t('common.save')}</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
```

### 3.7 App.tsx (Standalone Mode)

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Spinner } from 'shared/Spinner'
import { AuthProvider, useAuth } from 'shared/AuthContext'
import { ToastProvider } from 'shared/ToastContext'
import { TodoListPage } from './pages/TodoList'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
})

function ProtectedTodoPage() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <Spinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <TodoListPage />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/todos" element={<ProtectedTodoPage />} />
              <Route path="*" element={<Navigate to="/todos" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
```

### 3.8 Vite Config + Package.json: Update `apps/todo/vite.config.ts` + `apps/todo/package.json`

**Vite config** — thêm exposes cho TodoPage, thêm `shared` remote (cần cho `shared/` imports), thêm shared deps:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'todo',
      filename: 'remoteEntry.js',
      exposes: {
        './TodoPage': './src/pages/TodoList.tsx',
      },
      remotes: {
        shared: 'shared@http://localhost:3004/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router', 'axios', 'react-hook-form', 'zod', '@tanstack/react-query', 'i18next', 'react-i18next'],
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 3002,
    proxy: { '/api': 'http://localhost:8080' },
  },
})
```

**Package.json** — thêm `i18next` + `react-i18next` (cần cho `useTranslation` trong standalone mode):

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.0.0",
    "@module-federation/vite": "^1.20.0",
    "axios": "^1.7.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",
    "@tanstack/react-query": "^5.50.0",
    "i18next": "^24.0.0",
    "react-i18next": "^15.0.0"
  }
}
```

### 3.9 Type Stubs for `shared/` imports

Cần file `src/types/shared.d.ts` với type stubs cho tất cả shared modules dùng trong todo app (Table, Modal, ConfirmDialog, EmptyState, các hooks, schemas, types...). Xem file thực tế để biết chi tiết.

Mỗi page/component có **dual export**: `export const` (cho MF expose) + `export default` (cho `React.lazy()` trong standalone mode).

### 3.10 Lưu ý về khác biệt giữa spec và thực tế

| Shared component | Spec dùng | Thực tế cần dùng |
|------------------|-----------|------------------|
| Modal | `open` prop | `isOpen` prop |
| ConfirmDialog | `open` + `isLoading` | `isOpen` (không có isLoading) |
| EmptyState | `action` là ReactNode | `action` là `{ label, onClick }` |
| Checkbox | `{...register('completed')}` | Dùng `Controller` vì RHF register không set `checked` |

---

## 4. Verify Checklist

### API
- [ ] `GET /api/v1/todos` trả về danh sách (cần backend chạy)
- [ ] `GET /api/v1/todos?search=từ khóa` tìm đúng
- [ ] `GET /api/v1/todos?completed=true` filter đúng
- [ ] `GET /api/v1/todos?pageSize=5&pageNumber=2` pagination đúng
- [ ] `POST /api/v1/todos` tạo todo thành công
- [ ] `PATCH /api/v1/todos/:id` update thành công
- [ ] `DELETE /api/v1/todos/:id` xóa thành công

### UI & Flow
- [ ] `pnpm dev` — todo app chạy ở port 3002
- [ ] TodoList hiển thị Table với dữ liệu từ backend
- [ ] Search: gõ → debounce 300ms → fetch → cập nhật table
- [ ] Filter completed: Tất cả / Chưa / Hoàn thành
- [ ] Pagination: click trang → fetch → cập nhật
- [ ] Loading state: skeleton trong table
- [ ] Empty state: "Chưa có công việc nào" khi không có data
- [ ] Error state: "Lỗi" + nút Thử lại
- [ ] Click "+ Thêm" → mở Modal CreateTodo
- [ ] Create form: title bắt buộc, description optional
- [ ] Title > 160 ký tự → error "không được quá 160 ký tự"
- [ ] Create thành công → toast → đóng modal → refresh list
- [ ] Create thất bại → toast error
- [ ] Click "Sửa" → mở Modal EditTodo với dữ liệu hiện tại
- [ ] Edit form: title, description, completed pre-filled
- [ ] Edit form: hiển thị completed_at nếu completed=true
- [ ] Update thành công → toast → đóng modal → refresh list
- [ ] Click "Xóa" → mở ConfirmDialog
- [ ] Confirm xóa → toast → refresh list
- [ ] Cancel xóa → đóng dialog, không xóa

### Module Federation
- [ ] http://localhost:3002/remoteEntry.js trả về manifest với `./TodoPage`
- [ ] `pnpm build` todo app không lỗi TypeScript
- [ ] Tailwind prefix `todo-` hoạt động
