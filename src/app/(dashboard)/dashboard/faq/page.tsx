'use client'

import { useState } from 'react'
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Building, 
  Shield, 
  HelpCircle,
  Star,
  Clock,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Hardcoded FAQ data
const faqCategories = [
  {
    id: 'general',
    name: 'General',
    icon: HelpCircle,
    color: 'bg-blue-100 text-blue-800',
    description: 'General questions about the portal and regulatory compliance'
  },
  {
    id: 'banking',
    name: 'Banking',
    icon: Building,
    color: 'bg-green-100 text-green-800',
    description: 'Banking regulations and licensing requirements'
  },
  {
    id: 'aml-cft',
    name: 'AML/CFT',
    icon: Shield,
    color: 'bg-red-100 text-red-800',
    description: 'Anti-money laundering and counter-terrorist financing'
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: FileText,
    color: 'bg-purple-100 text-purple-800',
    description: 'Insurance industry regulations and compliance'
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: AlertCircle,
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Technical support and portal usage'
  }
]

const faqData = [
  // General FAQs
  {
    id: '1',
    question: 'How can I access regulatory documents and updates?',
    answer: 'All regulatory documents are available through this portal. You can browse by authority, document type, or use the search function. Subscribe to notifications to receive updates when new documents are published. Documents are organized by regulatory authority (BOB, NBFIRA, FIA) and can be filtered by category, type, and effective date.',
    category: 'general',
    authority: 'All',
    priority: 'HIGH',
    tags: ['documents', 'access', 'portal', 'notifications'],
    isPopular: true,
    lastUpdated: '2024-03-10',
    relatedDocs: ['Portal User Guide', 'Document Access Policy']
  },
  {
    id: '2',
    question: 'What is the difference between regulations, guidelines, and directives?',
    answer: 'Regulations are legally binding rules that must be followed. Guidelines provide best practice recommendations and interpretation of regulations. Directives are specific instructions issued by regulatory authorities that typically have legal force. Acts are primary legislation passed by Parliament, while circulars provide operational guidance and updates.',
    category: 'general',
    authority: 'All',
    priority: 'MEDIUM',
    tags: ['regulations', 'guidelines', 'directives', 'compliance'],
    isPopular: true,
    lastUpdated: '2024-02-15',
    relatedDocs: ['Regulatory Framework Overview']
  },
  {
    id: '3',
    question: 'How often are regulatory documents updated?',
    answer: 'Regulatory documents are updated on various schedules: Acts are amended through parliamentary process (infrequently), Regulations are updated annually or as needed, Guidelines are reviewed every 2-3 years or when regulations change, Circulars and directives are issued as needed (monthly to quarterly). Subscribe to notifications to stay informed of all updates.',
    category: 'general',
    authority: 'All',
    priority: 'MEDIUM',
    tags: ['updates', 'schedule', 'notifications'],
    isPopular: false,
    lastUpdated: '2024-01-20',
    relatedDocs: ['Update Schedule', 'Notification Settings Guide']
  },

  // Banking FAQs
  {
    id: '4',
    question: 'What are the minimum capital requirements for starting a bank in Botswana?',
    answer: 'The minimum paid-up capital for a commercial bank in Botswana is P100 million. For specialized banks, the requirement may vary: Merchant banks require P50 million minimum, Savings and credit institutions require P25 million minimum. These requirements ensure that banks have adequate capital to support their operations and protect depositors. Additional capital buffers may be required based on the bank\'s risk profile.',
    category: 'banking',
    authority: 'BOB',
    priority: 'HIGH',
    tags: ['capital', 'banking-license', 'requirements', 'BOB'],
    isPopular: true,
    lastUpdated: '2024-03-01',
    relatedDocs: ['Banking Act 2020', 'Capital Requirements Directive']
  },
  {
    id: '5',
    question: 'What is the application process for a banking license?',
    answer: 'The banking license application process involves: 1) Submit application with required documentation to BOB, 2) Pay application fee of P50,000, 3) BOB conducts fit and proper assessment of directors and management, 4) Site inspection and systems review, 5) Public notice period (30 days), 6) BOB board approval, 7) License issuance with conditions. The process typically takes 6-12 months. Detailed requirements are outlined in the Banking Act 2020.',
    category: 'banking',
    authority: 'BOB',
    priority: 'HIGH',
    tags: ['license', 'application', 'process', 'BOB'],
    isPopular: true,
    lastUpdated: '2024-02-28',
    relatedDocs: ['Banking License Application Form', 'Fit and Proper Guidelines']
  },
  {
    id: '6',
    question: 'What are the capital adequacy ratio requirements?',
    answer: 'Banks in Botswana must maintain minimum capital adequacy ratios: Total Capital Ratio: 15% (higher than Basel III minimum of 10.5%), Tier 1 Capital Ratio: 12.5%, Common Equity Tier 1 Ratio: 10%. These ratios are calculated monthly and reported quarterly to BOB. Banks falling below these ratios face regulatory action including restrictions on dividend payments and business expansion.',
    category: 'banking',
    authority: 'BOB',
    priority: 'HIGH',
    tags: ['capital-adequacy', 'ratios', 'basel', 'BOB'],
    isPopular: true,
    lastUpdated: '2024-03-05',
    relatedDocs: ['Capital Adequacy Guidelines', 'Basel III Implementation']
  },

  // AML/CFT FAQs
  {
    id: '7',
    question: 'How often should suspicious transaction reports be filed?',
    answer: 'Suspicious transaction reports (STRs) should be filed immediately upon detection, but no later than 3 business days after the suspicion arises. Financial institutions must maintain proper documentation and follow up procedures. STRs should be filed even if the transaction has not been completed. There is no minimum threshold amount for filing STRs.',
    category: 'aml-cft',
    authority: 'FIA',
    priority: 'HIGH',
    tags: ['STR', 'reporting', 'compliance', 'FIA'],
    isPopular: true,
    lastUpdated: '2024-03-08',
    relatedDocs: ['STR Filing Guidelines', 'AML Compliance Manual']
  },
  {
    id: '8',
    question: 'What are the customer due diligence requirements?',
    answer: 'Customer Due Diligence (CDD) requires: 1) Verify customer identity using reliable documents, 2) Identify beneficial owners (25%+ ownership), 3) Understand the purpose and nature of business relationship, 4) Conduct ongoing monitoring, 5) Enhanced due diligence for high-risk customers. CDD must be completed before establishing business relationships or conducting transactions above P15,000.',
    category: 'aml-cft',
    authority: 'FIA',
    priority: 'HIGH',
    tags: ['CDD', 'KYC', 'customer-identification', 'FIA'],
    isPopular: true,
    lastUpdated: '2024-02-20',
    relatedDocs: ['CDD Guidelines', 'Customer Identification Form']
  },
  {
    id: '9',
    question: 'What training is required for AML/CFT compliance?',
    answer: 'All staff handling customer transactions must receive AML/CFT training: Initial training within 30 days of employment, Annual refresher training, Specialized training for compliance officers and senior management. Training must cover current laws, internal procedures, red flag indicators, and reporting requirements. Records of training must be maintained for 5 years.',
    category: 'aml-cft',
    authority: 'FIA',
    priority: 'MEDIUM',
    tags: ['training', 'staff', 'compliance-officer', 'FIA'],
    isPopular: false,
    lastUpdated: '2024-01-15',
    relatedDocs: ['AML Training Requirements', 'Training Record Template']
  },
  {
    id: '10',
    question: 'What are the record keeping requirements for AML compliance?',
    answer: 'Financial institutions must maintain records for: Customer identification records: 5 years after relationship ends, Transaction records: 5 years after transaction, Correspondence: 5 years, STR records: 5 years after filing, Training records: 5 years. Records must be readily available to FIA and other competent authorities upon request.',
    category: 'aml-cft',
    authority: 'FIA',
    priority: 'MEDIUM',
    tags: ['records', 'retention', 'documentation', 'FIA'],
    isPopular: false,
    lastUpdated: '2024-01-30',
    relatedDocs: ['Record Keeping Guidelines', 'Data Retention Policy']
  },

  // Insurance FAQs
  {
    id: '11',
    question: 'What is the solvency ratio requirement for insurance companies?',
    answer: 'Insurance companies must maintain a minimum solvency ratio of 150% at all times. This means that admissible assets must be at least 1.5 times the required solvency margin. Companies falling below 120% must submit a recovery plan, and those below 100% face immediate regulatory intervention. Solvency ratios are calculated and reported quarterly to NBFIRA.',
    category: 'insurance',
    authority: 'NBFIRA',
    priority: 'HIGH',
    tags: ['solvency', 'capital', 'requirements', 'NBFIRA'],
    isPopular: true,
    lastUpdated: '2024-02-25',
    relatedDocs: ['Insurance Regulations 2022', 'Solvency Requirements Guide']
  },
  {
    id: '12',
    question: 'What are the licensing requirements for insurance companies?',
    answer: 'Insurance company licensing requires: Minimum paid-up capital (P25 million for long-term, P15 million for short-term), Fit and proper directors and management, Approved actuary and auditor, Business plan and financial projections, Proof of reinsurance arrangements. The application fee is P25,000 and the process takes 4-8 months.',
    category: 'insurance',
    authority: 'NBFIRA',
    priority: 'HIGH',
    tags: ['license', 'insurance', 'capital', 'NBFIRA'],
    isPopular: true,
    lastUpdated: '2024-03-02',
    relatedDocs: ['Insurance License Application', 'Licensing Guidelines']
  },

  // Technical FAQs
  {
    id: '13',
    question: 'How do I reset my portal password?',
    answer: 'To reset your password: 1) Go to login page and click "Forgot Password", 2) Enter your registered email address, 3) Check your email for reset link (check spam folder), 4) Click the link and create a new password, 5) New password must be at least 8 characters with uppercase, lowercase, numbers, and special characters. If you don\'t receive the email within 10 minutes, contact technical support.',
    category: 'technical',
    authority: 'Portal Support',
    priority: 'MEDIUM',
    tags: ['password', 'reset', 'login', 'support'],
    isPopular: true,
    lastUpdated: '2024-03-12',
    relatedDocs: ['User Account Guide', 'Password Policy']
  },
  {
    id: '14',
    question: 'Why can\'t I download certain documents?',
    answer: 'Document download issues may be due to: Browser settings blocking downloads, Insufficient user permissions, Large file size causing timeout, Network connectivity issues. Try: Check popup blockers, Use latest browser version, Contact your IT administrator for permission issues, Try downloading during off-peak hours for large files.',
    category: 'technical',
    authority: 'Portal Support',
    priority: 'LOW',
    tags: ['download', 'documents', 'browser', 'support'],
    isPopular: false,
    lastUpdated: '2024-02-18',
    relatedDocs: ['Browser Compatibility Guide', 'Download Troubleshooting']
  },
  {
    id: '15',
    question: 'How do I set up email notifications for regulatory updates?',
    answer: 'To set up notifications: 1) Login to your account, 2) Go to Settings > Notifications, 3) Select authorities you want updates from, 4) Choose document types and categories, 5) Select frequency (immediate, daily, weekly), 6) Verify your email address, 7) Save settings. You can modify these settings anytime.',
    category: 'technical',
    authority: 'Portal Support',
    priority: 'MEDIUM',
    tags: ['notifications', 'email', 'settings', 'updates'],
    isPopular: true,
    lastUpdated: '2024-03-01',
    relatedDocs: ['Notification Settings Guide', 'Email Preferences']
  }
]

const popularQuestions = faqData.filter(faq => faq.isPopular)

const contactInfo = [
  {
    authority: 'Bank of Botswana (BOB)',
    phone: '+267 360 6000',
    email: 'info@bob.bw',
    website: 'https://www.bankofbotswana.bw',
    address: 'Private Bag 154, Gaborone',
    hours: 'Monday-Friday 8:00-17:00'
  },
  {
    authority: 'NBFIRA',
    phone: '+267 318 1380',
    email: 'info@nbfira.org.bw',
    website: 'https://www.nbfira.org.bw',
    address: 'Plot 74654, Prime Plaza Extension 9, Gaborone',
    hours: 'Monday-Friday 8:00-17:00'
  },
  {
    authority: 'Financial Intelligence Agency (FIA)',
    phone: '+267 318 0774',
    email: 'info@fia.gov.bw',
    website: 'https://www.fia.gov.bw',
    address: 'Plot 2374, Extension 15, Gaborone',
    hours: 'Monday-Friday 8:00-16:30'
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedAuthority, setSelectedAuthority] = useState('all')
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const authorities = ['All', 'BOB', 'NBFIRA', 'FIA', 'Portal Support']

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesAuthority = selectedAuthority === 'all' || 
                            selectedAuthority === 'All' || 
                            faq.authority === selectedAuthority

    return matchesSearch && matchesCategory && matchesAuthority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryInfo = (categoryId: string) => {
    return faqCategories.find(cat => cat.id === categoryId) || faqCategories[0]
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions about Botswana's financial regulatory requirements
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="all">All Categories</option>
              {faqCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedAuthority}
              onChange={(e) => setSelectedAuthority(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              {authorities.map(authority => (
                <option key={authority} value={authority}>
                  {authority}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{faqData.length}</div>
            <p className="text-sm text-gray-600">Total FAQs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{popularQuestions.length}</div>
            <p className="text-sm text-gray-600">Popular Questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{faqCategories.length}</div>
            <p className="text-sm text-gray-600">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <p className="text-sm text-gray-600">Authorities</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all-faqs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all-faqs">All FAQs</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* All FAQs Tab */}
        <TabsContent value="all-faqs" className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No FAQs found matching your search criteria</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your search terms or filters</p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {filteredFAQs.map((faq) => {
                const categoryInfo = getCategoryInfo(faq.category)
                const CategoryIcon = categoryInfo.icon
                
                return (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg">
                    <Card>
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-start gap-4 text-left">
                          <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                            <CategoryIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={categoryInfo.color} variant="secondary">
                                {categoryInfo.name}
                              </Badge>
                              <Badge variant="outline">
                                {faq.authority}
                              </Badge>
                              <Badge className={getPriorityColor(faq.priority)}>
                                {faq.priority}
                              </Badge>
                              {faq.isPopular && (
                                <Badge variant="outline" className="text-yellow-600">
                                  <Star className="h-3 w-3 mr-1 fill-current" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4">
                          <div className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </div>
                          
                          {faq.tags.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Tags:</p>
                              <div className="flex flex-wrap gap-1">
                                {faq.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {faq.relatedDocs && faq.relatedDocs.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Related Documents:</p>
                              <div className="space-y-1">
                                {faq.relatedDocs.map(doc => (
                                  <div key={doc} className="flex items-center gap-2 text-sm text-blue-600">
                                    <FileText className="h-3 w-3" />
                                    <span className="hover:underline cursor-pointer">{doc}</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t">
                            <span>Last updated: {new Date(faq.lastUpdated).toLocaleDateString()}</span>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>ID: {faq.id}</span>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}
        </TabsContent>

        {/* Popular FAQs Tab */}
        <TabsContent value="popular" className="space-y-4">
          <Alert>
            <Star className="h-4 w-4" />
            <AlertDescription>
              These are the most frequently asked questions by users of the portal.
            </AlertDescription>
          </Alert>

          <Accordion type="multiple" className="space-y-4">
            {popularQuestions.map((faq) => {
              const categoryInfo = getCategoryInfo(faq.category)
              const CategoryIcon = categoryInfo.icon
              
              return (
                <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg">
                  <Card>
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-start gap-4 text-left">
                        <div className="bg-yellow-50 p-2 rounded-lg flex-shrink-0">
                          <Star className="h-5 w-5 text-yellow-600 fill-current" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={categoryInfo.color} variant="secondary">
                              {categoryInfo.name}
                            </Badge>
                            <Badge variant="outline">
                              {faq.authority}
                            </Badge>
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Popular
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              )
            })}
          </Accordion>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqCategories.map((category) => {
              const Icon = category.icon
              const categoryFAQs = faqData.filter(faq => faq.category === category.id)
              
              return (
                <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <Icon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <Badge className={category.color} variant="secondary">
                          {categoryFAQs.length} FAQs
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <div className="space-y-2">
                      {categoryFAQs.slice(0, 3).map(faq => (
                        <div key={faq.id} className="text-sm text-blue-600 hover:underline cursor-pointer">
                          • {faq.question}
                        </div>
                      ))}
                      {categoryFAQs.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{categoryFAQs.length - 3} more questions
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>
              Can't find what you're looking for? Contact the relevant regulatory authority directly.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactInfo.map((contact) => (
              <Card key={contact.authority}>
                <CardHeader>
                  <CardTitle className="text-lg">{contact.authority}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                      {contact.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                    <a 
                      href={contact.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-sm">{contact.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{contact.hours}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Portal Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Portal Technical Support
              </CardTitle>
              <CardDescription>
                For technical issues with the Financial Regulatory Portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Contact Information</h4>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                      support@regulatory-portal.gov.bw
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">+267 123 4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Monday-Friday 8:00-17:00</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Common Issues</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Password reset and login issues</li>
                    <li>• Document download problems</li>
                    <li>• Account access and permissions</li>
                    <li>• Browser compatibility issues</li>
                    <li>• Notification setup and preferences</li>
                  </ul>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  When contacting support, please include your account email, browser type, and a detailed description of the issue.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Submit Question Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit a New Question</CardTitle>
              <CardDescription>
                Can't find the answer you're looking for? Submit your question and we'll add it to our FAQ.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="">Select a category</option>
                    {faqCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Question</label>
                  <textarea 
                    className="w-full px-3 py-2 border rounded-md h-24 resize-none"
                    placeholder="Enter your question here..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Email (optional)</label>
                  <Input 
                    type="email" 
                    placeholder="your.email@company.com"
                    className="w-full"
                  />
                </div>
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom CTA */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-4">
            Our comprehensive documentation and user guides cover detailed procedures and requirements.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Browse Documents
            </Button>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}