'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Search, 
  BookOpen, 
  CheckSquare, 
  Download, 
  Bookmark, 
  Calendar, 
  Bell, 
  Building, 
  Shield,
  Clock,
  AlertTriangle,
  TrendingUp,
  Star,
  Filter,
  Eye,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'

// Hardcoded data for customer panel
const customerProfile = {
  id: '1',
  companyName: 'Standard Bank Botswana',
  businessType: 'banking',
  services: ['deposit-taking', 'lending', 'foreign-exchange'],
  registrationNumber: 'BW-BANK-001',
  complianceOfficer: 'Sarah Mokone',
  email: 'compliance@standardbank.co.bw',
  phone: '+267 71234567',
  address: 'Plot 1234, Main Mall, Gaborone',
  preferredAuthorities: ['BOB', 'FIA']
}

const availableDocuments = [
  {
    id: '1',
    title: 'Banking Act 2020',
    description: 'The primary legislation governing banking operations in Botswana',
    type: 'ACT',
    category: 'banking',
    authority: { name: 'Bank of Botswana', code: 'BOB' },
    effectiveDate: '2020-01-01',
    version: '1.0',
    tags: ['banking', 'legislation', 'prudential'],
    isBookmarked: true,
    lastViewed: '2024-01-15',
    relevanceScore: 95,
    fileSize: '2.1 MB',
    pageCount: 156
  },
  {
    id: '2',
    title: 'Anti-Money Laundering Guidelines 2023',
    description: 'Comprehensive guidelines for preventing money laundering and terrorist financing',
    type: 'GUIDELINE',
    category: 'aml-cft',
    authority: { name: 'Financial Intelligence Agency', code: 'FIA' },
    effectiveDate: '2023-06-01',
    version: '2.1',
    tags: ['AML', 'CTF', 'compliance', 'reporting'],
    isBookmarked: false,
    lastViewed: null,
    relevanceScore: 88,
    fileSize: '1.5 MB',
    pageCount: 89
  },
  {
    id: '3',
    title: 'Bank Capital Requirements Directive 2024',
    description: 'Updated capital adequacy requirements for banks',
    type: 'DIRECTIVE',
    category: 'prudential',
    authority: { name: 'Bank of Botswana', code: 'BOB' },
    effectiveDate: '2024-01-01',
    version: '1.0',
    tags: ['capital', 'prudential', 'basel'],
    isBookmarked: true,
    lastViewed: '2024-02-10',
    relevanceScore: 92,
    fileSize: '896 KB',
    pageCount: 45
  },
  {
    id: '4',
    title: 'Customer Due Diligence Form',
    description: 'Standard form for customer identification and verification',
    type: 'FORM',
    category: 'aml-cft',
    authority: { name: 'Financial Intelligence Agency', code: 'FIA' },
    effectiveDate: '2023-09-01',
    version: '3.2',
    tags: ['CDD', 'KYC', 'form'],
    isBookmarked: false,
    lastViewed: '2024-01-20',
    relevanceScore: 75,
    fileSize: '128 KB',
    pageCount: 8
  },
  {
    id: '5',
    title: 'Insurance Industry Regulations 2022',
    description: 'Regulations governing the insurance industry in Botswana',
    type: 'REGULATION',
    category: 'insurance',
    authority: { name: 'NBFIRA', code: 'NBFIRA' },
    effectiveDate: '2022-04-01',
    version: '1.3',
    tags: ['insurance', 'regulation', 'solvency'],
    isBookmarked: false,
    lastViewed: null,
    relevanceScore: 65,
    fileSize: '1.8 MB',
    pageCount: 112
  },
  {
    id: '6',
    title: 'Pension Fund Circular 2024/01',
    description: 'Guidance on pension fund investment limits and restrictions',
    type: 'CIRCULAR',
    category: 'pension',
    authority: { name: 'NBFIRA', code: 'NBFIRA' },
    effectiveDate: '2024-02-01',
    version: '1.0',
    tags: ['pension', 'investment', 'limits'],
    isBookmarked: true,
    lastViewed: '2024-02-15',
    relevanceScore: 70,
    fileSize: '512 KB',
    pageCount: 24
  }
]

const complianceChecklist = [
  {
    id: '1',
    title: 'Banking License Compliance',
    description: 'Ensure compliance with banking license requirements',
    authority: 'BOB',
    priority: 'HIGH',
    status: 'completed',
    dueDate: '2024-03-31',
    completedDate: '2024-03-15',
    tasks: [
      { id: '1', title: 'Submit annual compliance report', completed: true },
      { id: '2', title: 'Update capital adequacy calculations', completed: true },
      { id: '3', title: 'Review risk management framework', completed: true }
    ]
  },
  {
    id: '2',
    title: 'AML/CFT Compliance Program',
    description: 'Maintain comprehensive anti-money laundering program',
    authority: 'FIA',
    priority: 'HIGH',
    status: 'in-progress',
    dueDate: '2024-04-15',
    completedDate: null,
    tasks: [
      { id: '4', title: 'Update AML policies and procedures', completed: true },
      { id: '5', title: 'Conduct staff training on new guidelines', completed: false },
      { id: '6', title: 'Submit quarterly STR statistics', completed: false }
    ]
  },
  {
    id: '3',
    title: 'Customer Due Diligence Review',
    description: 'Annual review of customer identification procedures',
    authority: 'FIA',
    priority: 'MEDIUM',
    status: 'pending',
    dueDate: '2024-05-30',
    completedDate: null,
    tasks: [
      { id: '7', title: 'Review CDD procedures manual', completed: false },
      { id: '8', title: 'Update customer risk assessment criteria', completed: false },
      { id: '9', title: 'Test CDD system controls', completed: false }
    ]
  },
  {
    id: '4',
    title: 'Capital Adequacy Assessment',
    description: 'Quarterly assessment of capital adequacy ratios',
    authority: 'BOB',
    priority: 'HIGH',
    status: 'in-progress',
    dueDate: '2024-04-30',
    completedDate: null,
    tasks: [
      { id: '10', title: 'Calculate risk-weighted assets', completed: true },
      { id: '11', title: 'Assess tier 1 capital ratio', completed: false },
      { id: '12', title: 'Submit capital adequacy report', completed: false }
    ]
  }
]

const recentActivity = [
  {
    id: '1',
    type: 'document_viewed',
    title: 'Viewed Banking Act 2020',
    description: 'Accessed section on capital requirements',
    timestamp: '2024-03-10T14:30:00Z',
    icon: Eye
  },
  {
    id: '2',
    type: 'document_downloaded',
    title: 'Downloaded AML Guidelines',
    description: 'Full document PDF downloaded',
    timestamp: '2024-03-09T09:15:00Z',
    icon: Download
  },
  {
    id: '3',
    type: 'compliance_updated',
    title: 'Updated Banking License Compliance',
    description: 'Marked capital adequacy task as complete',
    timestamp: '2024-03-08T16:45:00Z',
    icon: CheckSquare
  },
  {
    id: '4',
    type: 'bookmark_added',
    title: 'Bookmarked Capital Requirements Directive',
    description: 'Added to compliance bookmarks',
    timestamp: '2024-03-07T11:20:00Z',
    icon: Bookmark
  },
  {
    id: '5',
    type: 'task_completed',
    title: 'Completed Risk Management Review',
    description: 'Marked risk management framework review as complete',
    timestamp: '2024-03-06T13:45:00Z',
    icon: CheckSquare
  },
  {
    id: '6',
    type: 'document_viewed',
    title: 'Viewed Pension Fund Circular',
    description: 'Reviewed investment limit guidelines',
    timestamp: '2024-03-05T10:30:00Z',
    icon: Eye
  }
]

const upcomingDeadlines = [
  {
    id: '1',
    title: 'AML Training Completion',
    authority: 'FIA',
    dueDate: '2024-04-15',
    daysRemaining: 25,
    priority: 'HIGH',
    type: 'training'
  },
  {
    id: '2',
    title: 'Quarterly Risk Report',
    authority: 'BOB',
    dueDate: '2024-04-30',
    daysRemaining: 40,
    priority: 'MEDIUM',
    type: 'report'
  },
  {
    id: '3',
    title: 'CDD Procedure Review',
    authority: 'FIA',
    dueDate: '2024-05-30',
    daysRemaining: 70,
    priority: 'MEDIUM',
    type: 'review'
  },
  {
    id: '4',
    title: 'Capital Adequacy Assessment',
    authority: 'BOB',
    dueDate: '2024-04-30',
    daysRemaining: 40,
    priority: 'HIGH',
    type: 'assessment'
  }
]

export default function CustomerPanel() {
  const [documents, setDocuments] = useState(availableDocuments)
  const [checklist, setChecklist] = useState(complianceChecklist)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAuthority, setSelectedAuthority] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [loading, setLoading] = useState(true)

  const authorities = ['BOB', 'FIA', 'NBFIRA']
  const documentTypes = ['ACT', 'REGULATION', 'GUIDELINE', 'DIRECTIVE', 'FORM', 'CIRCULAR']
  const categories = ['banking', 'aml-cft', 'prudential', 'insurance', 'pension']

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const toggleBookmark = (docId: string) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === docId ? { ...doc, isBookmarked: !doc.isBookmarked } : doc
      )
    )
  }

  const toggleTaskComplete = (checklistId: string, taskId: string) => {
    setChecklist(list => 
      list.map(item => 
        item.id === checklistId 
          ? {
              ...item,
              tasks: item.tasks.map(task => 
                task.id === taskId ? { ...task, completed: !task.completed } : task
              )
            }
          : item
      )
    )
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesAuthority = selectedAuthority === 'all' || doc.authority.code === selectedAuthority
    const matchesType = selectedType === 'all' || doc.type === selectedType
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesBookmark = !showBookmarkedOnly || doc.isBookmarked

    return matchesSearch && matchesAuthority && matchesType && matchesCategory && matchesBookmark
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'ACT': 'bg-red-100 text-red-800',
      'REGULATION': 'bg-blue-100 text-blue-800',
      'GUIDELINE': 'bg-yellow-100 text-yellow-800',
      'DIRECTIVE': 'bg-purple-100 text-purple-800',
      'FORM': 'bg-pink-100 text-pink-800',
      'CIRCULAR': 'bg-indigo-100 text-indigo-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getCompletionPercentage = (item: any) => {
    const completed = item.tasks.filter((task: any) => task.completed).length
    return Math.round((completed / item.tasks.length) * 100)
  }

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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
          <p className="text-gray-600">Welcome back, {customerProfile.complianceOfficer}</p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {customerProfile.companyName}
            </Badge>
            <Badge variant="secondary">
              {customerProfile.businessType.charAt(0).toUpperCase() + customerProfile.businessType.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <p className="text-xs text-muted-foreground">Overall compliance score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requirements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checklist.length}</div>
            <p className="text-xs text-muted-foreground">Compliance requirements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{upcomingDeadlines.length}</div>
            <p className="text-xs text-muted-foreground">Next 90 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Accessed</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines Alert */}
      {upcomingDeadlines.filter(d => d.daysRemaining <= 30).length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {upcomingDeadlines.filter(d => d.daysRemaining <= 30).length} upcoming deadlines in the next 30 days.
            <Button variant="link" className="p-0 h-auto ml-2">View details</Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest compliance actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.slice(0, 4).map(activity => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Progress</CardTitle>
                <CardDescription>Current status of your requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checklist.map(item => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.title}</span>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <Progress value={getCompletionPercentage(item)} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {item.tasks.filter(t => t.completed).length} of {item.tasks.length} tasks completed
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Frequently used documents and forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {documents.filter(doc => doc.isBookmarked || doc.lastViewed).slice(0, 4).map(doc => (
                  <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getDocumentTypeColor(doc.type)}>
                        {doc.type}
                      </Badge>
                      {doc.isBookmarked && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">{doc.title}</h4>
                    <p className="text-xs text-gray-500">{doc.authority.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Document Library</CardTitle>
              <CardDescription>Search and access regulatory documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
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
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Authorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Authorities</SelectItem>
                    {authorities.map(auth => (
                      <SelectItem key={auth} value={auth}>{auth}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="bookmarked"
                    checked={showBookmarkedOnly}
                    onCheckedChange={checked => setShowBookmarkedOnly(checked === true)}
                  />
                  <label htmlFor="bookmarked" className="text-sm">Bookmarked only</label>
                </div>
              </div>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map(doc => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={getDocumentTypeColor(doc.type)}>
                          {doc.type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(doc.id)}
                          className="p-1 h-auto"
                        >
                          <Star 
                            className={`h-4 w-4 ${doc.isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-400'}`}
                          />
                        </Button>
                      </div>
                      
                      <h4 className="font-medium text-sm mb-2 line-clamp-2">{doc.title}</h4>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{doc.description}</p>
                      
                      <div className="space-y-2 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>Authority:</span>
                          <span>{doc.authority.code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>{doc.fileSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Relevance:</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{doc.relevanceScore}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredDocuments.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No documents found</p>
                  <p className="text-sm text-gray-400">Try adjusting your filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4">
            {checklist.map(item => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Authority: {item.authority}</span>
                    <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                    <span>Progress: {getCompletionPercentage(item)}%</span>
                  </div>
                  <Progress value={getCompletionPercentage(item)} className="h-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {item.tasks.map(task => (
                      <div key={task.id} className="flex items-center space-x-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskComplete(item.id, task.id)}
                        />
                        <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </span>
                        {task.completed && (
                          <Badge variant="outline" className="text-green-600">
                            Complete
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Deadlines Tab */}
        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Important compliance deadlines to track</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map(deadline => (
                  <div key={deadline.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{deadline.title}</h4>
                      <p className="text-sm text-gray-500">{deadline.authority}</p>
                      <p className="text-xs text-gray-400">Due: {new Date(deadline.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getPriorityColor(deadline.priority)}>
                        {deadline.priority}
                      </Badge>
                      <p className="text-sm font-medium mt-1">
                        {deadline.daysRemaining} days
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Your recent compliance and document activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map(activity => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{activity.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                          </div>
                          <div className="text-right text-xs text-gray-400 flex-shrink-0 ml-4">
                            <div>{new Date(activity.timestamp).toLocaleDateString()}</div>
                            <div>{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Load More Button */}
              <div className="text-center mt-6">
                <Button variant="outline">
                  Load More Activity
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Documents Viewed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">12</div>
                <p className="text-xs text-muted-foreground">This week</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+25% from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">8</div>
                <p className="text-xs text-muted-foreground">This week</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+12% from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">5</div>
                <p className="text-xs text-muted-foreground">This week</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-gray-500">Same as last week</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Recent Notifications</DialogTitle>
              <DialogDescription>
                Stay updated with the latest regulatory changes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-1 rounded">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New AML Guidelines Published</p>
                    <p className="text-xs text-gray-500">FIA has published updated guidelines for 2024</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-50 p-1 rounded">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Deadline Reminder</p>
                    <p className="text-xs text-gray-500">AML Training due in 15 days</p>
                    <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-green-50 p-1 rounded">
                    <CheckSquare className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Compliance Task Completed</p>
                    <p className="text-xs text-gray-500">Capital adequacy report submitted successfully</p>
                    <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm">
                Mark All Read
              </Button>
              <Button size="sm">
                View All
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="lg" className="rounded-full shadow-lg">
          <Search className="h-5 w-5 mr-2" />
          Quick Search
        </Button>
      </div>
    </div>
  )
}