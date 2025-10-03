"use client"

import React, { useState, useEffect } from 'react'
import {
  Users,
  DollarSign,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  MessageSquare,
  Globe,
  Eye,
  Heart,
  UserCheck
} from 'lucide-react'

interface StatCard {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ElementType
  color: string
}

interface RecentActivity {
  id: string
  type: string
  message: string
  timestamp: string
  user: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Donations',
      value: '$45,678',
      change: '+8%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Projects',
      value: '24',
      change: '+3',
      changeType: 'increase',
      icon: Activity,
      color: 'bg-purple-500'
    },
    {
      title: 'Newsletter Subscribers',
      value: '2,856',
      change: '+23%',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'bg-orange-500'
    },
    {
      title: 'Blog Posts',
      value: '156',
      change: '+5',
      changeType: 'increase',
      icon: FileText,
      color: 'bg-indigo-500'
    },
    {
      title: 'Page Views',
      value: '12,450',
      change: '+15%',
      changeType: 'increase',
      icon: Eye,
      color: 'bg-pink-500'
    },
    {
      title: 'Volunteer Applications',
      value: '89',
      change: '+7',
      changeType: 'increase',
      icon: UserCheck,
      color: 'bg-teal-500'
    },
    {
      title: 'Contact Messages',
      value: '45',
      change: '-2%',
      changeType: 'decrease',
      icon: MessageSquare,
      color: 'bg-red-500'
    }
  ])

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'donation',
      message: 'New donation of $500 received for Clean Water Project',
      timestamp: '2 minutes ago',
      user: 'John Smith'
    },
    {
      id: '2',
      type: 'volunteer',
      message: 'New volunteer application from Sarah Johnson',
      timestamp: '15 minutes ago',
      user: 'Sarah Johnson'
    },
    {
      id: '3',
      type: 'blog',
      message: 'Blog post "Impact in Rural Kenya" published',
      timestamp: '1 hour ago',
      user: 'Admin'
    },
    {
      id: '4',
      type: 'project',
      message: 'Education Project updated with new photos',
      timestamp: '2 hours ago',
      user: 'Marie Kouadio'
    },
    {
      id: '5',
      type: 'contact',
      message: 'New contact message from partnership inquiry',
      timestamp: '3 hours ago',
      user: 'Corporate Partner'
    }
  ])

  const quickActions = [
    { title: 'Create Blog Post', href: '/admin/blog/new', color: 'bg-blue-500' },
    { title: 'Add Project', href: '/admin/projects/new', color: 'bg-green-500' },
    { title: 'Create Event', href: '/admin/events/new', color: 'bg-purple-500' },
    { title: 'Upload Media', href: '/admin/media/upload', color: 'bg-orange-500' },
    { title: 'View Messages', href: '/admin/contacts', color: 'bg-red-500' },
    { title: 'Manage Users', href: '/admin/users', color: 'bg-indigo-500' }
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's what's happening with your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'increase' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {activity.type === 'donation' && <DollarSign className="w-4 h-4 text-green-500" />}
                        {activity.type === 'volunteer' && <Users className="w-4 h-4 text-blue-500" />}
                        {activity.type === 'blog' && <FileText className="w-4 h-4 text-purple-500" />}
                        {activity.type === 'project' && <Activity className="w-4 h-4 text-orange-500" />}
                        {activity.type === 'contact' && <MessageSquare className="w-4 h-4 text-red-500" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>{activity.user}</span>
                        <span className="mx-1">•</span>
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button className="text-sm font-medium text-red-600 hover:text-red-500">
                  View all activity →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <a
                    key={index}
                    href={action.href}
                    className={`${action.color} text-white rounded-lg p-3 text-center text-sm font-medium hover:opacity-90 transition-opacity`}
                  >
                    {action.title}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-600">Healthy</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-600">85% Available</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Service</span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Backup</span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-yellow-600">2 hours ago</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Website Traffic */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Today's Traffic</h2>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">3,247</div>
                <div className="text-sm text-gray-600 mt-1">Page Views</div>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">+12%</span>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Desktop</span>
                  <span className="font-medium">1,847</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Mobile</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tablet</span>
                  <span className="font-medium">166</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
