'use client'

import { useState, useEffect } from 'react'
import { Plus, Upload, FileText, Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Hardcoded data
const hardcodedDocuments = [
  {
    id: '1',
    title: 'Banking Act 2020',
    description: 'The primary legislation governing banking operations in Botswana',
    type: 'ACT',
    category: 'banking',
    subcategory: 'primary-legislation',
    tags: ['banking', 'legislation', 'BOB', 'prudential'],
    authority: {
      id: 'bob',
      name: 'Bank of Botswana',
      code: 'BOB'
    },
    version: '1.0',
    effectiveDate: '2020-01-01',
    fileUrl: '/documents/banking-act-2020.pdf',
    requirements: [
      { id: '1', title: 'Banking License Application' },
      { id: '2', title: 'Capital Adequacy Compliance' }
    ],
    updatedAt: '2024-01-15T10:30:00Z',
    createdAt: '2020-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Anti-Money Laundering Guidelines 2023',
    description: 'Comprehensive guidelines for preventing money laundering and terrorist financing',
    type: 'GUIDELINE',
    category: 'aml-cft',
    subcategory: 'prevention',
    tags: ['AML', 'CTF', 'compliance', 'FIA', 'reporting'],
    authority: {
      id: 'fia',
      name: 'Financial Intelligence Agency',
      code: 'FIA'
    },
    version: '2.1',
    effectiveDate: '2023-06-01',
    fileUrl: '/documents/aml-guidelines-2023.pdf',
    requirements: [
      { id: '3', title: 'AML/CFT Compliance Program' },
      { id: '4', title: 'Suspicious Transaction Reporting' }
    ],
    updatedAt: '2024-02-10T14:20:00Z',
    createdAt: '2023-06-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Insurance Industry Regulations 2022',
    description: 'Regulations governing the insurance industry in Botswana',
    type: 'REGULATION',
    category: 'insurance',
    subcategory: 'industry-regulation',
    tags: ['insurance', 'regulation', 'NBFIRA', 'solvency'],
    authority: {
      id: 'nbfira',
      name: 'Non-Bank Financial Institutions Regulatory Authority',
      code: 'NBFIRA'
    },
    version: '1.3',
    effectiveDate: '2022-04-01',
    fileUrl: '/documents/insurance-regulations-2022.pdf',
    requirements: [
      { id: '5', title: 'Insurance License Application' },
      { id: '6', title: 'Solvency Requirements' }
    ],
    updatedAt: '2024-01-20T09:15:00Z',
    createdAt: '2022-04-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'Bank Capital Requirements Directive 2024',
    description: 'Updated capital adequacy requirements for banks',
    type: 'DIRECTIVE',
    category: 'prudential',
    subcategory: 'capital-adequacy',
    tags: ['capital', 'prudential', 'BOB', 'basel'],
    authority: {
      id: 'bob',
      name: 'Bank of Botswana',
      code: 'BOB'
    },
    version: '1.0',
    effectiveDate: '2024-01-01',
    fileUrl: '/documents/capital-requirements-2024.pdf',
    requirements: [
      { id: '7', title: 'Capital Adequacy Assessment' },
      { id: '8', title: 'Risk Management Framework' }
    ],
    updatedAt: '2024-03-05T16:45:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    title: 'Customer Due Diligence Form',
    description: 'Standard form for customer identification and verification',
    type: 'FORM',
    category: 'aml-cft',
    subcategory: 'customer-identification',
    tags: ['CDD', 'KYC', 'form', 'FIA'],
    authority: {
      id: 'fia',
      name: 'Financial Intelligence Agency',
      code: 'FIA'
    },
    version: '3.2',
    effectiveDate: '2023-09-01',
    fileUrl: '/documents/cdd-form-2023.pdf',
    requirements: [
      { id: '9', title: 'Customer Identification Process' }
    ],
    updatedAt: '2024-02-28T11:30:00Z',
    createdAt: '2023-09-01T00:00:00Z'
  },
  {
    id: '6',
    title: 'Pension Fund Circular 2024/01',
    description: 'Guidance on pension fund investment limits and restrictions',
    type: 'CIRCULAR',
    category: 'pension',
    subcategory: 'investment-guidelines',
    tags: ['pension', 'investment', 'NBFIRA', 'limits'],
    authority: {
      id: 'nbfira',
      name: 'Non-Bank Financial Institutions Regulatory Authority',
      code: 'NBFIRA'
    },
    version: '1.0',
    effectiveDate: '2024-02-01',
    fileUrl: '/documents/pension-circular-2024-01.pdf',
    requirements: [
      { id: '10', title: 'Investment Portfolio Compliance' }
    ],
    updatedAt: '2024-02-01T08:00:00Z',
    createdAt: '2024-02-01T08:00:00Z'
  }
]

const hardcodedAuthorities = [
  {
    id: 'bob',
    name: 'Bank of Botswana',
    code: 'BOB'
  },
  {
    id: 'nbfira',
    name: 'Non-Bank Financial Institutions Regulatory Authority',
    code: 'NBFIRA'
  },
  {
    id: 'fia',
    name: 'Financial Intelligence Agency',
    code: 'FIA'
  }
]

const hardcodedStats = {
  totalDocuments: hardcodedDocuments.length,
  totalRequirements: hardcodedDocuments.reduce((sum, doc) => sum + doc.requirements.length, 0),
  recentUploads: 3,
  documentsByType: [
    { type: 'ACT', count: 1 },
    { type: 'REGULATION', count: 1 },
    { type: 'GUIDELINE', count: 1 },
    { type: 'DIRECTIVE', count: 1 },
    { type: 'FORM', count: 1 },
    { type: 'CIRCULAR', count: 1 }
  ],
  documentsByAuthority: [
    { authority: 'Bank of Botswana', count: 2 },
    { authority: 'NBFIRA', count: 2 },
    { authority: 'Financial Intelligence Agency', count: 2 }
  ]
}

export default function AdminPanel() {
  const [documents, setDocuments] = useState(hardcodedDocuments)
  const [authorities, setAuthorities] = useState(hardcodedAuthorities)
  const [stats, setStats] = useState(hardcodedStats)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAuthority, setSelectedAuthority] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showDocumentForm, setShowDocumentForm] = useState(false)
  const [showRequirementForm, setShowRequirementForm] = useState(false)
  const [editingDocument, setEditingDocument] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const documentTypes = [
    'ACT', 'REGULATION', 'POLICY', 'GUIDELINE', 'DIRECTIVE', 'FORM', 'CIRCULAR', 'ANNOUNCEMENT'
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setDocuments(docs => docs.filter(doc => doc.id !== id))
      setError(null)
      
      // Update stats
      const newDocuments = documents.filter(doc => doc.id !== id)
      setStats(prevStats => ({
        ...prevStats,
        totalDocuments: newDocuments.length,
        totalRequirements: newDocuments.reduce((sum, doc) => sum + doc.requirements.length, 0)
      }))
      
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Failed to delete document')
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesAuthority = selectedAuthority === 'all' || doc.authority.id === selectedAuthority
    const matchesType = selectedType === 'all' || doc.type === selectedType

    return matchesSearch && matchesAuthority && matchesType
  })

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'ACT': 'bg-red-100 text-red-800',
      'REGULATION': 'bg-blue-100 text-blue-800',
      'POLICY': 'bg-green-100 text-green-800',
      'GUIDELINE': 'bg-yellow-100 text-yellow-800',
      'DIRECTIVE': 'bg-purple-100 text-purple-800',
      'FORM': 'bg-pink-100 text-pink-800',
      'CIRCULAR': 'bg-indigo-100 text-indigo-800',
      'ANNOUNCEMENT': 'bg-orange-100 text-orange-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  // Mock form components
  const DocumentForm = ({ authorities, onSuccess, onCancel }: any) => (
    <div className="p-4 space-y-4">
                    <DocumentForm
                authorities={authorities}
                onSuccess={() => {
                  setShowDocumentForm(false)
                  //fetchData()
                }}
                onCancel={() => setShowDocumentForm(false)}
              />
      <div className="flex gap-2">
        <Button onClick={() => onSuccess()} className="w-full">
          Save Document
        </Button>
        <Button variant="outline" onClick={() => onCancel()} className="w-full">
          Cancel
        </Button>
      </div>
    </div>
  )

  const RequirementForm = ({ documents, onSuccess, onCancel }: any) => (
    <div className="p-4 space-y-4">
      <RequirementForm
        documents={documents}
        onSuccess={() => {
          setShowRequirementForm(false)
          // fetchData()
        }}
        onCancel={() => setShowRequirementForm(false)}
      />
      <div className="flex gap-2">
        <Button onClick={() => onSuccess()} className="w-full">
          Save Requirement
        </Button>
        <Button variant="outline" onClick={() => onCancel()} className="w-full">
          Cancel
        </Button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-gray-600">Manage regulatory documents and requirements</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showDocumentForm} onOpenChange={setShowDocumentForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Document</DialogTitle>
                <DialogDescription>
                  Upload a new regulatory document with requirements
                </DialogDescription>
              </DialogHeader>
              <DocumentForm
                authorities={authorities}
                onSuccess={() => {
                  setShowDocumentForm(false)
                  setError(null)
                }}
                onCancel={() => setShowDocumentForm(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showRequirementForm} onOpenChange={setShowRequirementForm}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Compliance Requirement</DialogTitle>
                <DialogDescription>
                  Create a new compliance requirement for existing documents
                </DialogDescription>
              </DialogHeader>
              <RequirementForm
                documents={documents}
                onSuccess={() => {
                  setShowRequirementForm(false)
                  setError(null)
                }}
                onCancel={() => setShowRequirementForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requirements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequirements}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentUploads}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authorities</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{authorities.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>Search and filter regulatory documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedAuthority} onValueChange={setSelectedAuthority}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Authorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Authorities</SelectItem>
                    {authorities.map(auth => (
                      <SelectItem key={auth.id} value={auth.id}>
                        {auth.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Authority</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Requirements</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map(doc => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doc.title}</div>
                          {doc.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {doc.description}
                            </div>
                          )}
                          {doc.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {doc.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {doc.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{doc.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDocumentTypeColor(doc.type)}>
                          {doc.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{doc.authority.name}</div>
                          <div className="text-gray-500">{doc.authority.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{doc.category}</div>
                          {doc.subcategory && (
                            <div className="text-gray-500">{doc.subcategory}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {doc.requirements.length} requirements
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingDocument(doc)
                              setShowDocumentForm(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredDocuments.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No documents found</p>
                  <p className="text-sm text-gray-400">
                    {searchQuery || selectedAuthority !== 'all' || selectedType !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Start by adding your first document'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Requirements</CardTitle>
              <CardDescription>Manage business compliance requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hardcodedDocuments.flatMap(doc => doc.requirements).map(req => (
                  <Card key={req.id} className="p-4">
                    <h4 className="font-medium mb-2">{req.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Documents by Type</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.documentsByType.map(item => (
                  <div key={item.type} className="flex justify-between items-center py-2">
                    <Badge className={getDocumentTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents by Authority</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.documentsByAuthority.map(item => (
                  <div key={item.authority} className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium">{item.authority}</span>
                    <Badge variant="outline">{item.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}