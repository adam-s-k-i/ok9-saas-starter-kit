'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { useRBAC } from '@/hooks/use-rbac'
import { logAuditEvent } from '@/lib/audit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, UserPlus, MoreHorizontal, Edit, Trash2, Shield, User, Loader2, ChevronLeft, ChevronRight, X, Users } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export const dynamic = 'force-dynamic'

interface User {
  id: string
  name: string | null
  email: string
  role: 'admin' | 'user' | 'moderator'
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  lastLogin?: string | null
  updatedAt: string
  stats: {
    totalInvoices: number
    totalApiKeys: number
    subscriptionStatus: string | null
    subscriptionEnd: string | null
  }
}

interface ApiResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function UsersPage() {
  const { canCreateUsers, canEditUser, canDeleteUser, canViewUsers } = useRBAC()

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<ApiResponse['pagination'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create user dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState({
    email: '',
    name: '',
    role: 'user' as 'admin' | 'moderator' | 'user',
    status: 'active' as 'active' | 'inactive' | 'pending'
  })
  const [createError, setCreateError] = useState<string | null>(null)

  // Edit user dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    role: 'user' as 'admin' | 'moderator' | 'user',
    status: 'active' as 'active' | 'inactive' | 'pending'
  })
  const [editError, setEditError] = useState<string | null>(null)

  // Delete user dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Bulk operations state
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<'delete' | 'activate' | 'deactivate' | null>(null)
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false)
  const [performingBulkAction, setPerformingBulkAction] = useState(false)
  const [bulkError, setBulkError] = useState<string | null>(null)

  // Fetch users from API with pagination
  const fetchUsers = useCallback(async (page: number = currentPage) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', pageSize.toString())
      if (searchTerm) params.append('search', searchTerm)
      if (roleFilter !== 'all') params.append('role', roleFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/users?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data: ApiResponse = await response.json()
      setUsers(data.users)
      setPagination(data.pagination)
      setCurrentPage(data.pagination.page)
      // Clear selections when data is refreshed
      setSelectedUsers(new Set())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchTerm, roleFilter, statusFilter])

  // Handle page changes
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      setCurrentPage(page)
      fetchUsers(page)
    }
  }

  // Handle page size changes
  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize)
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
    setSelectedUsers(new Set()) // Clear selections when changing page size
  }

  // Bulk selection handlers
  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers)
    if (checked) {
      newSelected.add(userId)
    } else {
      newSelected.delete(userId)
    }
    setSelectedUsers(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(users.map(user => user.id)))
    } else {
      setSelectedUsers(new Set())
    }
  }

  const isAllSelected = users.length > 0 && selectedUsers.size === users.length
  const isSomeSelected = selectedUsers.size > 0

  // Bulk action handlers
  const openBulkDialog = (action: 'delete' | 'activate' | 'deactivate') => {
    setBulkAction(action)
    setBulkDialogOpen(true)
  }

  const performBulkAction = async () => {
    if (!bulkAction || selectedUsers.size === 0) return

    try {
      setPerformingBulkAction(true)
      setBulkError(null)

      const userIds = Array.from(selectedUsers)

      if (bulkAction === 'delete') {
        // Check permissions - only admins can bulk delete
        if (!canDeleteUser('')) {
          throw new Error('Keine Berechtigung für Massenlöschung')
        }

        // Delete users one by one (could be optimized with batch operations)
        for (const userId of userIds) {
          const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Fehler beim Löschen von Benutzer ${userId}`)
          }
        }

        // Log bulk delete audit event
        await logAuditEvent({
          action: 'bulk_user_delete',
          resource: 'users',
          details: {
            userIds,
            count: userIds.length,
          },
        })
      } else if (bulkAction === 'activate' || bulkAction === 'deactivate') {
        const newStatus = bulkAction === 'activate' ? 'active' : 'inactive'

        // Check permissions - moderators and admins can change status
        if (!canEditUser('', 'user')) {
          throw new Error('Keine Berechtigung für Statusänderungen')
        }

        // Update users one by one
        for (const userId of userIds) {
          const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Fehler beim Aktualisieren von Benutzer ${userId}`)
          }
        }

        // Log bulk status change audit event
        await logAuditEvent({
          action: bulkAction === 'activate' ? 'bulk_user_activate' : 'bulk_user_deactivate',
          resource: 'users',
          details: {
            userIds,
            count: userIds.length,
            newStatus,
          },
        })
      }

      // Clear selections and close dialog
      setSelectedUsers(new Set())
      setBulkDialogOpen(false)
      setBulkAction(null)

      // Refresh user list
      await fetchUsers()

    } catch (err) {
      setBulkError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setPerformingBulkAction(false)
    }
  }

  // Create new user
  const createUser = async () => {
    if (!createForm.email.trim()) {
      setCreateError('Email ist erforderlich')
      return
    }

    try {
      setCreating(true)
      setCreateError(null)

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create user')
      }

      // Reset form and close dialog
      setCreateForm({
        email: '',
        name: '',
        role: 'user',
        status: 'active'
      })
      setCreateDialogOpen(false)

      // Refresh user list
      await fetchUsers()
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setCreating(false)
    }
  }

  // Open edit dialog with user data
  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setEditForm({
      name: user.name || '',
      role: user.role,
      status: user.status
    })
    setEditDialogOpen(true)
  }

  // Update user
  const updateUser = async () => {
    if (!editingUser) return

    try {
      setEditing(true)
      setEditError(null)

      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user')
      }

      // Close dialog and refresh user list
      setEditDialogOpen(false)
      setEditingUser(null)
      await fetchUsers()
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setEditing(false)
    }
  }

  // Open delete confirmation dialog
  const openDeleteDialog = (user: User) => {
    setDeletingUser(user)
    setDeleteDialogOpen(true)
  }

  // Delete user
  const deleteUser = async () => {
    if (!deletingUser) return

    try {
      setDeleting(true)
      setDeleteError(null)

      const response = await fetch(`/api/users/${deletingUser.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete user')
      }

      // Close dialog and refresh user list
      setDeleteDialogOpen(false)
      setDeletingUser(null)
      await fetchUsers()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Calculate stats from pagination data
  const stats = useMemo(() => {
    if (!pagination) return { total: 0, active: 0, admins: 0, moderators: 0 }

    // For accurate stats, we'd need to fetch aggregate data from API
    // For now, calculate from current page users (not perfect but better than nothing)
    const active = users.filter(u => u.status === 'active').length
    const admins = users.filter(u => u.role === 'admin').length
    const moderators = users.filter(u => u.role === 'moderator').length

    return {
      total: pagination.total,
      active: Math.round((active / users.length) * pagination.total), // Estimate based on current page
      admins: Math.round((admins / users.length) * pagination.total),
      moderators: Math.round((moderators / users.length) * pagination.total)
    }
  }, [users, pagination])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Benutzerverwaltung</h1>
              <p className="text-muted-foreground">
                Verwalten Sie Benutzerkonten, Rollen und Berechtigungen
              </p>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                {canCreateUsers && (
                  <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Neuen Benutzer erstellen
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Neuen Benutzer erstellen</DialogTitle>
                  <DialogDescription>
                    Erstellen Sie einen neuen Benutzerkonto mit den erforderlichen Informationen.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="benutzer@example.com"
                      className="col-span-3"
                      value={createForm.email}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Max Mustermann (optional)"
                      className="col-span-3"
                      value={createForm.name}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Rolle
                    </Label>
                    <Select value={createForm.role} onValueChange={(value: 'admin' | 'moderator' | 'user') => setCreateForm(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select value={createForm.status} onValueChange={(value: 'active' | 'inactive' | 'pending') => setCreateForm(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Aktiv</SelectItem>
                        <SelectItem value="inactive">Inaktiv</SelectItem>
                        <SelectItem value="pending">Ausstehend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {createError && (
                    <div className="col-span-4 text-sm text-destructive bg-destructive/10 p-2 rounded">
                      {createError}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={createUser} disabled={creating}>
                    {creating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Erstelle...
                      </>
                    ) : (
                      'Erstellen'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Such- und Filterbereich */}
          {canViewUsers && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="search">Benutzer suchen</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Name oder Email suchen..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Rolle</Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Rollen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Rollen</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Status</SelectItem>
                        <SelectItem value="active">Aktiv</SelectItem>
                        <SelectItem value="inactive">Inaktiv</SelectItem>
                        <SelectItem value="pending">Ausstehend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Pro Seite</Label>
                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bulk Actions Toolbar */}
          {isSomeSelected && (
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-medium">
                      {selectedUsers.size} Benutzer ausgewählt
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {canEditUser('', 'user') && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openBulkDialog('activate')}
                          className="gap-2"
                        >
                          <User className="h-4 w-4" />
                          Aktivieren
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openBulkDialog('deactivate')}
                          className="gap-2"
                        >
                          <User className="h-4 w-4" />
                          Deaktivieren
                        </Button>
                      </>
                    )}
                    {canDeleteUser('') && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openBulkDialog('delete')}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Löschen
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUsers(new Set())}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Abbrechen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benutzertabelle */}
          {canViewUsers ? (
            <Card>
              <CardHeader>
                <CardTitle>Benutzerliste</CardTitle>
                <CardDescription>
                  {loading ? 'Lade Benutzer...' : `${pagination?.total || 0} Benutzer gefunden • Seite ${pagination?.page || 1} von ${pagination?.totalPages || 1}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Table Header with Select All */}
                {!loading && !error && users.length > 0 && (
                  <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium">Alle auswählen</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedUsers.size} von {users.length} ausgewählt
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">Benutzer werden geladen...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-destructive">
                      <p>Fehler beim Laden der Benutzer: {error}</p>
                      <Button onClick={() => fetchUsers()} variant="outline" className="mt-4">
                        Erneut versuchen
                      </Button>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Keine Benutzer gefunden</p>
                    </div>
                  ) : (
                    users.map((user) => {
                      const displayRole = user.role === 'admin' ? 'Admin' : user.role === 'moderator' ? 'Moderator' : 'User'
                      const displayStatus = user.status === 'active' ? 'Aktiv' : user.status === 'inactive' ? 'Inaktiv' : 'Ausstehend'
                      const isSelected = selectedUsers.has(user.id)

                      return (
                        <div key={user.id} className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${isSelected ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'}`}>
                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Avatar>
                              <AvatarFallback>
                                {user.name
                                  ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                                  : user.email[0].toUpperCase()
                                }
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">
                                {user.name || 'Unbenannter Benutzer'}
                              </p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground">
                                Registriert am {new Date(user.createdAt).toLocaleDateString('de-DE')}
                                {user.lastLogin && ` • Letzter Login: ${new Date(user.lastLogin).toLocaleDateString('de-DE')}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant={displayRole === 'Admin' ? 'default' : displayRole === 'Moderator' ? 'secondary' : 'outline'} className="gap-1">
                              {displayRole === 'Admin' && <Shield className="h-3 w-3" />}
                              {displayRole}
                            </Badge>
                            <Badge
                              variant={displayStatus === 'Aktiv' ? 'default' : displayStatus === 'Inaktiv' ? 'secondary' : 'outline'}
                              className={
                                displayStatus === 'Aktiv'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                  : displayStatus === 'Inaktiv'
                                  ? 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                              }
                            >
                              {displayStatus}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {canEditUser(user.id, user.role) && (
                                  <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(user)}>
                                    <Edit className="h-4 w-4" />
                                    Bearbeiten
                                  </DropdownMenuItem>
                                )}
                                {canDeleteUser(user.id) && (
                                  <DropdownMenuItem className="gap-2 text-destructive" onClick={() => openDeleteDialog(user)}>
                                    <Trash2 className="h-4 w-4" />
                                    Löschen
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Zeige {((pagination.page - 1) * pagination.limit) + 1} bis {Math.min(pagination.page * pagination.limit, pagination.total)} von {pagination.total} Benutzern
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Vorherige
                      </Button>

                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.page - 2)) + i
                          if (pageNum > pagination.totalPages) return null

                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === pagination.page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        Nächste
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Zugriff verweigert</h3>
                <p className="text-muted-foreground text-center">
                  Sie haben keine Berechtigung, Benutzer anzusehen. Wenden Sie sich an einen Administrator.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Benutzerstatistiken */}
          {canViewUsers && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gesamtbenutzer</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    Registrierte Benutzer
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aktive Benutzer</CardTitle>
                  <User className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% Aktivitätsrate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Administratoren</CardTitle>
                  <Shield className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.admins}</div>
                  <p className="text-xs text-muted-foreground">
                    Admin-Berechtigungen
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Moderatoren</CardTitle>
                  <User className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.moderators}</div>
                  <p className="text-xs text-muted-foreground">
                    Moderationsrechte
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Edit User Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Benutzer bearbeiten</DialogTitle>
                <DialogDescription>
                  Aktualisieren Sie die Informationen für {editingUser?.email}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <div className="col-span-3 p-2 bg-muted rounded text-sm">
                    {editingUser?.email}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    placeholder="Max Mustermann"
                    className="col-span-3"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Rolle
                  </Label>
                  <Select value={editForm.role} onValueChange={(value: 'admin' | 'moderator' | 'user') => setEditForm(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select value={editForm.status} onValueChange={(value: 'active' | 'inactive' | 'pending') => setEditForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktiv</SelectItem>
                      <SelectItem value="inactive">Inaktiv</SelectItem>
                      <SelectItem value="pending">Ausstehend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editError && (
                  <div className="col-span-4 text-sm text-destructive bg-destructive/10 p-2 rounded">
                    {editError}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={updateUser} disabled={editing}>
                  {editing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Speichere...
                    </>
                  ) : (
                    'Speichern'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete User Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Benutzer löschen</DialogTitle>
                <DialogDescription>
                  Sind Sie sicher, dass Sie den Benutzer <strong>{deletingUser?.name || deletingUser?.email}</strong> löschen möchten?
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </DialogDescription>
              </DialogHeader>
              {deleteError && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                  {deleteError}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button variant="destructive" onClick={deleteUser} disabled={deleting}>
                  {deleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Lösche...
                    </>
                  ) : (
                    'Löschen'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Bulk Action Confirmation Dialog */}
          <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {bulkAction === 'delete' && 'Mehrere Benutzer löschen'}
                  {bulkAction === 'activate' && 'Benutzer aktivieren'}
                  {bulkAction === 'deactivate' && 'Benutzer deaktivieren'}
                </DialogTitle>
                <DialogDescription>
                  {bulkAction === 'delete' && (
                    <>
                      Sind Sie sicher, dass Sie <strong>{selectedUsers.size} Benutzer</strong> löschen möchten?
                      Diese Aktion kann nicht rückgängig gemacht werden.
                    </>
                  )}
                  {bulkAction === 'activate' && (
                    <>
                      Sind Sie sicher, dass Sie <strong>{selectedUsers.size} Benutzer</strong> aktivieren möchten?
                      Diese Benutzer können sich dann wieder anmelden.
                    </>
                  )}
                  {bulkAction === 'deactivate' && (
                    <>
                      Sind Sie sicher, dass Sie <strong>{selectedUsers.size} Benutzer</strong> deaktivieren möchten?
                      Diese Benutzer können sich dann nicht mehr anmelden.
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
              {bulkError && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                  {bulkError}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button
                  variant={bulkAction === 'delete' ? 'destructive' : 'default'}
                  onClick={performBulkAction}
                  disabled={performingBulkAction}
                >
                  {performingBulkAction ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {bulkAction === 'delete' && 'Lösche...'}
                      {bulkAction === 'activate' && 'Aktiviere...'}
                      {bulkAction === 'deactivate' && 'Deaktiviere...'}
                    </>
                  ) : (
                    <>
                      {bulkAction === 'delete' && `Löschen (${selectedUsers.size})`}
                      {bulkAction === 'activate' && `Aktivieren (${selectedUsers.size})`}
                      {bulkAction === 'deactivate' && `Deaktivieren (${selectedUsers.size})`}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthGuard>
  )
}