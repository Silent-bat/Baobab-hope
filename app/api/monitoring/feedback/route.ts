import { NextRequest, NextResponse } from 'next/server'
import { UserFeedback } from '@/lib/i18n/production-monitor'

export async function POST(request: NextRequest) {
  try {
    const { feedback }: { feedback: UserFeedback[] } = await request.json()
    
    // Analyze feedback
    const analysis = analyzeFeedback(feedback)
    
    // Log feedback
    if (process.env.NODE_ENV === 'development') {
      console.log('User feedback received:', analysis)
    } else {
      await logUserFeedback(feedback, analysis)
    }
    
    // Check for quality issues
    const qualityIssues = checkQualityIssues(analysis)
    if (qualityIssues.length > 0) {
      await sendQualityAlerts(qualityIssues)
    }
    
    return NextResponse.json({ 
      success: true, 
      processed: feedback.length,
      qualityIssues: qualityIssues.length,
      analysis
    })
  } catch (error) {
    console.error('Error processing user feedback:', error)
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    )
  }
}

function analyzeFeedback(feedback: UserFeedback[]) {
  const analysis: Record<string, {
    totalFeedback: number
    averageRating: number
    ratingDistribution: Record<number, number>
    poorRatings: number
    commonIssues: string[]
  }> = {}
  
  // Group feedback by language
  const grouped = feedback.reduce((acc, item) => {
    if (!acc[item.language]) acc[item.language] = []
    acc[item.language].push(item)
    return acc
  }, {} as Record<string, UserFeedback[]>)
  
  // Analyze each language
  Object.entries(grouped).forEach(([language, items]) => {
    const ratings = items.map(item => item.rating)
    const totalRating = ratings.reduce((sum, rating) => sum + rating, 0)
    const averageRating = totalRating / ratings.length
    
    const ratingDistribution = ratings.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    
    const poorRatings = items.filter(item => item.rating <= 2).length
    
    // Extract common issues from comments
    const comments = items
      .filter(item => item.comment && item.rating <= 3)
      .map(item => item.comment!.toLowerCase())
    
    const commonIssues = extractCommonIssues(comments)
    
    analysis[language] = {
      totalFeedback: items.length,
      averageRating,
      ratingDistribution,
      poorRatings,
      commonIssues
    }
  })
  
  return analysis
}

function extractCommonIssues(comments: string[]): string[] {
  const issueKeywords = [
    'incorrect', 'wrong', 'error', 'mistake', 'bad',
    'unclear', 'confusing', 'hard to understand',
    'missing', 'incomplete', 'truncated',
    'cultural', 'offensive', 'inappropriate',
    'grammar', 'spelling', 'typo'
  ]
  
  const issues: Record<string, number> = {}
  
  comments.forEach(comment => {
    issueKeywords.forEach(keyword => {
      if (comment.includes(keyword)) {
        issues[keyword] = (issues[keyword] || 0) + 1
      }
    })
  })
  
  // Return top 3 most common issues
  return Object.entries(issues)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([keyword]) => keyword)
}

function checkQualityIssues(analysis: Record<string, any>) {
  const issues = []
  
  Object.entries(analysis).forEach(([language, stats]) => {
    // Check for low average rating
    if (stats.averageRating < 3.0) {
      issues.push({
        type: 'low_rating',
        severity: stats.averageRating < 2.5 ? 'high' : 'medium',
        language,
        message: `Low average rating for ${language}: ${stats.averageRating.toFixed(1)}/5`,
        data: stats
      })
    }
    
    // Check for high percentage of poor ratings
    const poorRatingPercentage = (stats.poorRatings / stats.totalFeedback) * 100
    if (poorRatingPercentage > 30) {
      issues.push({
        type: 'high_poor_ratings',
        severity: poorRatingPercentage > 50 ? 'high' : 'medium',
        language,
        message: `${poorRatingPercentage.toFixed(1)}% poor ratings for ${language}`,
        data: stats
      })
    }
    
    // Check for common issues
    if (stats.commonIssues.length > 0) {
      issues.push({
        type: 'common_issues',
        severity: 'medium',
        language,
        message: `Common issues reported for ${language}: ${stats.commonIssues.join(', ')}`,
        data: stats
      })
    }
  })
  
  return issues
}

async function logUserFeedback(feedback: UserFeedback[], analysis: any) {
  // Send to analytics service
  if (process.env.ANALYTICS_WEBHOOK_URL) {
    try {
      await fetch(process.env.ANALYTICS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MONITORING_API_KEY}`
        },
        body: JSON.stringify({
          type: 'i18n_feedback',
          feedback,
          analysis,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to log user feedback:', error)
    }
  }
}

async function sendQualityAlerts(issues: any[]) {
  if (process.env.ALERT_WEBHOOK_URL) {
    try {
      const message = {
        text: `📝 Translation Quality Issues Detected`,
        attachments: issues.map(issue => ({
          color: issue.severity === 'high' ? 'danger' : 'warning',
          fields: [
            {
              title: 'Issue Type',
              value: issue.type,
              short: true
            },
            {
              title: 'Language',
              value: issue.language,
              short: true
            },
            {
              title: 'Details',
              value: issue.message,
              short: false
            }
          ]
        }))
      }
      
      await fetch(process.env.ALERT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      })
    } catch (error) {
      console.error('Failed to send quality alerts:', error)
    }
  }
}