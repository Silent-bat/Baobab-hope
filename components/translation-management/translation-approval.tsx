'use client'

// Translation approval workflow component with review and approval system

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  User, 
  Calendar,
  Filter,
  Search,
  ThumbsUp,
  ThumbsDown,
  Eye,
  History,
  AlertCircle,
  FileText
} from 'lucide-react'

interface ApprovalRequest {
  id: string
  language: string
  languageName: string
  key: string
  oldValue: string | null
  newValue: string
  author: string
  authorName: string
  submittedAt: Date
  status: 'pending' | 'approved' | 'rejected' | 'needs-revision'
  reviewer?: string
  reviewerName?: string
  reviewedAt?: Date
  comments: ApprovalComment[]
  priority: 'low' | 'medium' | 'high'
  category: 'new' | 'update' | 'delete'
}

interface ApprovalComment {
  id: string
  author: string
  authorName: string
  content: string
  createdAt: Date
  type: 'comment' | 'approval' | 'rejection' | 'revision-request'
}

interface TranslationApprovalProps {
  pendingApprovals: number
  onApprovalComplete: () => void
}

interface ApprovalState {
  requests: ApprovalRequest[]
  selectedRequest: string | null
  filterStatus: 'all' | 'pending' | 'approved' | 'rejected' | 'needs-revision'
  filterLanguage: string
  searchQuery: string
  isLoading: boolean
}

// Mock data for demonstration
const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: '1',
    language: 'fr',
    languageName: 'French',
    key: 'home.hero.title',
    oldValue: 'Empowering Communities, Growing Futures',
    newValue: 'Autonomiser les Communautés, Cultiver l\'Avenir',
    author: 'translator1',
    authorName: 'Marie Dubois',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'pending',
    comments: [
      {
        id: '1',
        author: 'translator1',
        authorName: 'Marie Dubois',
        content: 'Updated the French translation to better reflect the empowerment aspect.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: 'comment'
      }
    ],
    priority: 'high',
    category: 'update'
  },
  {
    id: '2',
    language: 'es',
    languageName: 'Spanish',
    key: 'nav.donate',
    oldValue: null,
    newValue: 'Donar',
    author: 'translator2',
    authorName: 'Carlos Rodriguez',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'pending',
    comments: [],
    priority: 'medium',
    category: 'new'
  },
  {
    id: '3',
    language: 'de',
    languageName: 'German',
    key: 'about.mission.text',
    oldValue: 'To nurture sustainable growth...',
    newValue: 'Nachhaltiges Wachstum in Gemeinden fördern...',
    author: 'translator3',
    authorName: 'Hans Mueller',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'approved',
    reviewer: 'reviewer1',
    reviewerName: 'Sarah Chen',
    reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    comments: [
      {
        id: '2',
        author: 'reviewer1',
        authorName: 'Sarah Chen',
        content: 'Excellent translation that captures the mission statement well.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        type: 'approval'
      }
    ],
    priority: 'high',
    category: 'update'
  }
]

export function TranslationApproval({ pendingApprovals, onApprovalComplete }: TranslationApprovalProps) {
  const [approvalState, setApprovalState] = useState<ApprovalState>({
    requests: mockApprovalRequests,
    selectedRequest: null,
    filterStatus: 'all',
    filterLanguage: 'all',
    searchQuery: '',
    isLoading: false
  })

  const [newComment, setNewComment] = useState('')
  const [isSubmittingAction, setIsSubmittingAction] = useState(false)

  const handleApproval = async (requestId: string, action: 'approve' | 'reject' | 'request-revision', comment?: string) => {
    try {
      setIsSubmittingAction(true)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setApprovalState(prev => ({
        ...prev,
        requests: prev.requests.map(request => {
          if (request.id === requestId) {
            const newComment: ApprovalComment = {
              id: Date.now().toString(),
              author: 'current-user',
              authorName: 'Current User',
              content: comment || `${action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Requested revision'}`,
              createdAt: new Date(),
              type: action === 'approve' ? 'approval' : action === 'reject' ? 'rejection' : 'revision-request'
            }

            return {
              ...request,
              status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'needs-revision',
              reviewer: 'current-user',
              reviewerName: 'Current User',
              reviewedAt: new Date(),
              comments: [...request.comments, newComment]
            }
          }
          return request
        })
      }))

      setNewComment('')
      onApprovalComplete()
    } catch (error) {
      console.error('Failed to process approval:', error)
    } finally {
      setIsSubmittingAction(false)
    }
  }

  const addComment = async (requestId: string, content: string) => {
    if (!content.trim()) return

    try {
      const newComment: ApprovalComment = {
        id: Date.now().toString(),
        author: 'current-user',
        authorName: 'Current User',
        content: content.trim(),
        createdAt: new Date(),
        type: 'comment'
      }

      setApprovalState(prev => ({
        ...prev,
        requests: prev.requests.map(request =>
          request.id === requestId
            ? { ...request, comments: [...request.comments, newComment] }
            : request
        )
      }))

      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'approved': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      case 'needs-revision': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'needs-revision': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'new': return '+'
      case 'update': return '~'
      case 'delete': return '-'
      default: return '?'
    }
  }

  const filteredRequests = approvalState.requests.filter(request => {
    const matchesStatus = approvalState.filterStatus === 'all' || request.status === approvalState.filterStatus
    const matchesLanguage = approvalState.filterLanguage === 'all' || request.language === approvalState.filterLanguage
    const matchesSearch = approvalState.searchQuery === '' ||
                         request.key.toLowerCase().includes(approvalState.searchQuery.toLowerCase()) ||
                         request.newValue.toLowerCase().includes(approvalState.searchQuery.toLowerCase()) ||
                         request.authorName.toLowerCase().includes(approvalState.searchQuery.toLowerCase())
    
    return matchesStatus && matchesLanguage && matchesSearch
  })

  const selectedRequest = approvalState.requests.find(r => r.id === approvalState.selectedRequest)

  const pendingCount = approvalState.requests.filter(r => r.status === 'pending').length
  const approvedCount = approvalState.requests.filter(r => r.status === 'approved').length
  const rejectedCount = approvalState.requests.filter(r => r.status === 'rejected').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Translation Approval</h2>
          <p className="text-muted-foreground">
            Review and approve translation changes
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-yellow-50">
              <Clock className="h-3 w-3 mr-1" />
              {pendingCount} Pending
            </Badge>
            <Badge variant="outline" className="bg-green-50">
              <CheckCircle className="h-3 w-3 mr-1" />
              {approvedCount} Approved
            </Badge>
            <Badge variant="outline" className="bg-red-50">
              <XCircle className="h-3 w-3 mr-1" />
              {rejectedCount} Rejected
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Request List */}
        <div className="col-span-5">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Approval Requests</CardTitle>
                <Badge variant="outline">
                  {filteredRequests.length} of {approvalState.requests.length}
                </Badge>
              </div>
              
              {/* Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={approvalState.searchQuery}
                    onChange={(e) => setApprovalState(prev => ({ 
                      ...prev, 
                      searchQuery: e.target.value 
                    }))}
                    className="pl-8 pr-3 py-2 text-sm border rounded-md w-full"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Select 
                    value={approvalState.filterStatus} 
                    onValueChange={(value: any) => setApprovalState(prev => ({ 
                      ...prev, 
                      filterStatus: value 
                    }))}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="needs-revision">Needs Revision</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={approvalState.filterLanguage} 
                    onValueChange={(value: any) => setApprovalState(prev => ({ 
                      ...prev, 
                      filterLanguage: value 
                    }))}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 p-4">
                  {filteredRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`p-4 rounded-lg border-l-4 cursor-pointer transition-colors ${
                        getPriorityColor(request.priority)
                      } ${
                        approvalState.selectedRequest === request.id
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setApprovalState(prev => ({ 
                        ...prev, 
                        selectedRequest: request.id 
                      }))}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1 capitalize">{request.status.replace('-', ' ')}</span>
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {request.languageName}
                            </Badge>
                            <span className="text-xs font-mono bg-muted px-1 py-0.5 rounded">
                              {getCategoryIcon(request.category)}
                            </span>
                          </div>
                          
                          <div className="text-sm font-medium truncate mb-1">
                            {request.key}
                          </div>
                          
                          <div className="text-xs text-muted-foreground truncate mb-2">
                            {request.newValue}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>by {request.authorName}</span>
                            <span>{request.submittedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No approval requests match your criteria.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Request Details */}
        <div className="col-span-7">
          {selectedRequest ? (
            <div className="space-y-4">
              {/* Request Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <span>{selectedRequest.key}</span>
                        <Badge className={getStatusColor(selectedRequest.status)}>
                          {getStatusIcon(selectedRequest.status)}
                          <span className="ml-1 capitalize">{selectedRequest.status.replace('-', ' ')}</span>
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {selectedRequest.languageName} • {selectedRequest.category} • 
                        Priority: {selectedRequest.priority}
                      </CardDescription>
                    </div>
                    
                    {selectedRequest.status === 'pending' && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproval(selectedRequest.id, 'approve', newComment)}
                          disabled={isSubmittingAction}
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproval(selectedRequest.id, 'request-revision', newComment)}
                          disabled={isSubmittingAction}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Request Revision
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproval(selectedRequest.id, 'reject', newComment)}
                          disabled={isSubmittingAction}
                        >
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Translation Comparison */}
                    <div>
                      <Label className="text-sm font-medium">Translation Changes</Label>
                      <div className="mt-2 space-y-3">
                        {selectedRequest.oldValue && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="text-xs font-medium text-red-700 mb-1">Previous</div>
                            <div className="text-sm">{selectedRequest.oldValue}</div>
                          </div>
                        )}
                        
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="text-xs font-medium text-green-700 mb-1">
                            {selectedRequest.category === 'new' ? 'New' : 'Updated'}
                          </div>
                          <div className="text-sm">{selectedRequest.newValue}</div>
                        </div>
                      </div>
                    </div>

                    {/* Request Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">Submitted by</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {selectedRequest.authorName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{selectedRequest.authorName}</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">Submitted on</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{selectedRequest.submittedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {selectedRequest.reviewer && (
                        <>
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">Reviewed by</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {selectedRequest.reviewerName?.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span>{selectedRequest.reviewerName}</span>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">Reviewed on</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Calendar className="h-4 w-4" />
                              <span>{selectedRequest.reviewedAt?.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Comments ({selectedRequest.comments.length})</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Comments List */}
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-3">
                        {selectedRequest.comments.map((comment) => (
                          <div key={comment.id} className="flex space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {comment.authorName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium">{comment.authorName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {comment.type.replace('-', ' ')}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {comment.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {comment.content}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {selectedRequest.comments.length === 0 && (
                          <div className="text-center py-4 text-muted-foreground text-sm">
                            No comments yet
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    <Separator />

                    {/* Add Comment */}
                    <div className="space-y-3">
                      <Label htmlFor="new-comment">Add Comment</Label>
                      <Textarea
                        id="new-comment"
                        placeholder="Add your review comments..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <Button
                        onClick={() => addComment(selectedRequest.id, newComment)}
                        disabled={!newComment.trim()}
                        size="sm"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[500px]">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select an approval request to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}