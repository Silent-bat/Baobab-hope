"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Globe,
  Calendar,
  FileText,
  ChevronDown
} from 'lucide-react'

interface Page {
  id: string
  title: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  language: string
  createdAt: string
  updatedAt: string
  createdBy: string
  publishedAt?: string
  metaTitle?: string
  metaDescription?: string
}

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([
    {
      id: '1',
      title: 'About Us',
      slug: 'about-us',
      status: 'PUBLISHED',
      language: 'en',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      createdBy: 'Admin User',
      publishedAt: '2024-01-20T14:45:00Z',
      metaTitle: 'About BAOBAB HOPE - Our Mission and Vision',
      metaDescription: 'Learn about BAOBAB HOPE\'s mission to create sustainable change in communities worldwide through education, healthcare, and environmental conservation.'
    },
    {
      id: '2',
      title: 'Contact Us',
      slug: 'contact',
      status: 'PUBLISHED',
      language: 'en',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-18T16:20:00Z',
      createdBy: 'Admin User',
      publishedAt: '2024-01-18T16:20:00Z',
      metaTitle: 'Contact BAOBAB HOPE - Get in Touch',
      metaDescription: 'Contact BAOBAB HOPE for partnerships, volunteer opportunities, or general inquiries. We\'re here to help create positive change together.'
    },
    {
      id: '3',
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      status: 'DRAFT',
      language: 'en',
      createdAt: '2024-01-25T11:00:00Z',
      updatedAt: '2024-01-25T11:00:00Z',
      createdBy: 'Legal Team',
      metaTitle: 'Privacy Policy - BAOBAB HOPE',
      metaDescription: 'Our privacy policy outlines how we collect, use, and protect your personal information when you interact with our website and services.'
    },
    {
      id: '4',
      title: 'Terms of Service',
      slug: 'terms-of-service',
      status: 'ARCHIVED',
      language: 'en',
      createdAt: '2024-01-05T08:30:00Z',
      updatedAt: '2024-01-25T10:15:00Z',
      createdBy: 'Legal Team',
      publishedAt: '2024-01-05T08:30:00Z'
    },
    {
      id: '5',
      title: 'À Propos de Nous',
      slug: 'a-propos',
      status: 'PUBLISHED',
      language: 'fr',
      createdAt: '2024-01-16T13:45:00Z',
      updatedAt: '2024-01-21T09:30:00Z',
      createdBy: 'Translation Team',
      publishedAt: '2024-01-21T09:30:00Z',
      metaTitle: 'À Propos de BAOBAB HOPE - Notre Mission',
      metaDescription: 'Découvrez la mission de BAOBAB HOPE pour créer un changement durable dans les communautés du monde entier.'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [languageFilter, setLanguageFilter] = useState<string>('ALL')
  const [selectedPages, setSelectedPages] = useState<string[]>([])
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const statusColors = {
    PUBLISHED: 'bg-green-100 text-green-800',
    DRAFT: 'bg-yellow-100 text-yellow-800',
    ARCHIVED: 'bg-gray-100 text-gray-800'
  }

  const languageNames = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch'
  }

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || page.status === statusFilter
    const matchesLanguage = languageFilter === 'ALL' || page.language === languageFilter

    return matchesSearch && matchesStatus && matchesLanguage
  })

  const handleSelectPage = (pageId: string) => {
    setSelectedPages(prev =>
      prev.includes(pageId)
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    )
  }

  const handleSelectAll = () => {
    if (selectedPages.length === filteredPages.length) {
      setSelectedPages([])
    } else {
      setSelectedPages(filteredPages.map(page => page.id))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for pages:`, selectedPages)
    // Implement bulk actions here
    setSelectedPages([])
  }

  const handleDeletePage = (pageId: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      setPages(pages.filter(page => page.id !== pageId))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="mt-2 text-gray-600">Manage your website pages and content</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {selectedPages.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedPages.length} selected</span>
                  <select
                    onChange={(e) => handleBulkAction(e.target.value)}
                    className="text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Bulk actions</option>
                    <option value="publish">Publish</option>
                    <option value="draft">Move to Draft</option>
                    <option value="archive">Archive</option>
                    <option value="delete">Delete</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="block w-full border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm"
                >
                  <option value="ALL">All Languages</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStatusFilter('ALL')
                    setLanguageFilter('ALL')
                    setSearchTerm('')
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pages Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPages.length === filteredPages.length && filteredPages.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedPages.includes(page.id)}
                      onChange={() => handleSelectPage(page.id)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {page.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        /{page.slug}
                      </div>
                      {page.metaTitle && (
                        <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                          SEO: {page.metaTitle}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[page.status]}`}>
                      {page.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {languageNames[page.language as keyof typeof languageNames] || page.language}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {formatDate(page.updatedAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {page.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/${page.slug}`}
                        target="_blank"
                        className="text-gray-400 hover:text-gray-600"
                        title="View page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="text-red-600 hover:text-red-900"
                        title="Edit page"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <div className="relative">
                        <button
                          onClick={() => setDropdownOpen(dropdownOpen === page.id ? null : page.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {dropdownOpen === page.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <Link
                                href={`/admin/pages/${page.id}/edit`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="w-4 h-4 inline mr-2" />
                                Edit
                              </Link>
                              <Link
                                href={`/admin/pages/${page.id}/duplicate`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <FileText className="w-4 h-4 inline mr-2" />
                                Duplicate
                              </Link>
                              <Link
                                href={`/${page.slug}`}
                                target="_blank"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye className="w-4 h-4 inline mr-2" />
                                View
                              </Link>
                              <button
                                onClick={() => handleDeletePage(page.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 inline mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'ALL' || languageFilter !== 'ALL'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first page'}
            </p>
            <Link
              href="/admin/pages/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Page
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredPages.length > 0 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 mt-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPages.length}</span> of{' '}
              <span className="font-medium">{filteredPages.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-red-50 text-sm font-medium text-red-600">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
