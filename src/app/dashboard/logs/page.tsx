'use client'

import { useState, useEffect, useCallback } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

import { Search, Filter, Download, RefreshCw, ChevronLeft, ChevronRight, Eye, Clock, User, Activity, Shield } from 'lucide-react'
import { useRBAC } from '@/hooks/use-rbac'

interface AuditLog {
  id: string
  userId: string | null
  action: string
  resource: string
  resourceId: string | null
  details: Record<string, unknown>
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  user?: {
    id: string
    name: string | null
    email: string
  } | null
}

interface ApiResponse {
  logs: AuditLog[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const dynamic = 'force-dynamic'

export default function LogsPage() {
  const { hasRole } = useRBAC()
  const canViewLogs = hasRole('admin')

  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [resourceFilter, setResourceFilter] = useState<string>('all')
  const [userFilter, setUserFilter] = useState<string>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [pagination, setPagination] = useState<ApiResponse['pagination'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Fetch logs from API with pagination and filters
  const fetchLogs = useCallback(async (page: number = currentPage) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', pageSize.toString())
      if (searchTerm) params.append('search', searchTerm)
      if (actionFilter !== 'all') params.append('action', actionFilter)
      if (resourceFilter !== 'all') params.append('resource', resourceFilter)
      if (userFilter !== 'all') params.append('userId', userFilter)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/logs?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch logs')
      }

      const data: ApiResponse = await response.json()
      setLogs(data.logs)
      setPagination(data.pagination)
      setCurrentPage(data.pagination.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchTerm, actionFilter, resourceFilter, userFilter, startDate, endDate])

  // Handle page changes
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      setCurrentPage(page)
      fetchLogs(page)
    }
  }

  // Handle page size changes
  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize)
    setPageSize(size)
    setCurrentPage(1)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setActionFilter('all')
    setResourceFilter('all')
    setUserFilter('all')
    setStartDate('')
    setEndDate('')
    setCurrentPage(1)
  }

  // Export logs (placeholder - would implement CSV/JSON export)
  const exportLogs = () => {
    // TODO: Implement export functionality
    console.log('Exporting logs...')
  }

  // View log details
  const viewLogDetails = (log: AuditLog) => {
    setSelectedLog(log)
    setShowDetails(true)
  }

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Get action badge variant
  const getActionBadgeVariant = (action: string) => {
    if (action.includes('create')) return 'default'
    if (action.includes('update')) return 'secondary'
    if (action.includes('delete')) return 'destructive'
    if (action.includes('login')) return 'outline'
    return 'outline'
  }

  // Get resource icon
  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'users': return User
      case 'system': return Activity
      default: return Activity
    }
  }

  if (!canViewLogs) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Zugriff verweigert</h3>
              <p className="text-muted-foreground text-center">
                Sie haben keine Berechtigung, Logs anzusehen. Wenden Sie sich an einen Administrator.
              </p>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Audit Logs</h1>
              <p className="text-muted-foreground">
                Überwachen Sie Systemaktivitäten und Benutzeraktionen
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => fetchLogs()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Aktualisieren
              </Button>
              <Button variant="outline" onClick={exportLogs}>
                <Download className="mr-2 h-4 w-4" />
                Exportieren
              </Button>
            </div>
          </div>

          {/* Filter Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="search">Suchen</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Aktion, Ressource, Benutzer..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Aktion</Label>
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alle Aktionen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Aktionen</SelectItem>
                      <SelectItem value="user_create">Benutzer erstellt</SelectItem>
                      <SelectItem value="user_update">Benutzer aktualisiert</SelectItem>
                      <SelectItem value="user_delete">Benutzer gelöscht</SelectItem>
                      <SelectItem value="user_login">Login</SelectItem>
                      <SelectItem value="user_logout">Logout</SelectItem>
                      <SelectItem value="bulk_user_delete">Massenlöschung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ressource</Label>
                  <Select value={resourceFilter} onValueChange={setResourceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alle Ressourcen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Ressourcen</SelectItem>
                      <SelectItem value="users">Benutzer</SelectItem>
                      <SelectItem value="subscriptions">Abonnements</SelectItem>
                      <SelectItem value="invoices">Rechnungen</SelectItem>
                      <SelectItem value="api_keys">API Keys</SelectItem>
                      <SelectItem value="system">System</SelectItem>
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
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="startDate">Von Datum</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Bis Datum</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter zurücksetzen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Log-Einträge</CardTitle>
              <CardDescription>
                {loading ? 'Lade Logs...' : `${pagination?.total || 0} Einträge gefunden • Seite ${pagination?.page || 1} von ${pagination?.totalPages || 1}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Logs werden geladen...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>Fehler beim Laden der Logs: {error}</p>
                    <Button onClick={() => fetchLogs()} variant="outline" className="mt-4">
                      Erneut versuchen
                    </Button>
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Keine Log-Einträge gefunden</p>
                  </div>
                ) : (
                  logs.map((log) => {
                    const ResourceIcon = getResourceIcon(log.resource)
                    const actionDisplay = log.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())

                    return (
                      <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <ResourceIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={getActionBadgeVariant(log.action)} className="text-xs">
                                {actionDisplay}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {log.resource}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {log.user ? (
                                <>
                                  <span className="font-medium">{log.user.name || log.user.email}</span>
                                  {log.resourceId && (
                                    <span className="ml-2">• ID: {log.resourceId}</span>
                                  )}
                                </>
                              ) : (
                                'Systemaktion'
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(log.createdAt).toLocaleString('de-DE')}
                              {log.ipAddress && (
                                <span className="ml-2">• IP: {log.ipAddress}</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewLogDetails(log)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Zeige {(pagination.page - 1) * pagination.limit + 1} bis {Math.min(pagination.page * pagination.limit, pagination.total)} von {pagination.total} Einträgen
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

          {/* Log Details Modal */}
          {showDetails && selectedLog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Log-Details</CardTitle>
                  <CardDescription>
                    Detaillierte Informationen zu diesem Log-Eintrag
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Aktion</Label>
                      <p className="text-sm font-medium">{selectedLog.action}</p>
                    </div>
                    <div>
                      <Label>Ressource</Label>
                      <p className="text-sm font-medium">{selectedLog.resource}</p>
                    </div>
                    <div>
                      <Label>Zeitstempel</Label>
                      <p className="text-sm">{new Date(selectedLog.createdAt).toLocaleString('de-DE')}</p>
                    </div>
                    <div>
                      <Label>Benutzer</Label>
                      <p className="text-sm">
                        {selectedLog.user ? (selectedLog.user.name || selectedLog.user.email) : 'System'}
                      </p>
                    </div>
                    {selectedLog.resourceId && (
                      <div>
                        <Label>Ressource-ID</Label>
                        <p className="text-sm font-mono">{selectedLog.resourceId}</p>
                      </div>
                    )}
                    {selectedLog.ipAddress && (
                      <div>
                        <Label>IP-Adresse</Label>
                        <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                      </div>
                    )}
                  </div>
                  {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                    <div>
                      <Label>Zusätzliche Details</Label>
                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                        {JSON.stringify(selectedLog.details, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedLog.userAgent && (
                    <div>
                      <Label>User Agent</Label>
                      <p className="text-xs bg-muted p-2 rounded break-all">{selectedLog.userAgent}</p>
                    </div>
                  )}
                </CardContent>
                <div className="flex justify-end p-4 border-t">
                  <Button onClick={() => setShowDetails(false)}>Schließen</Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}