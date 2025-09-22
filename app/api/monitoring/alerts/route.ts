import { NextRequest, NextResponse } from 'next/server'
import { MonitoringAlert } from '@/lib/i18n/production-monitor'

export async function POST(request: NextRequest) {
  try {
    const { alert }: { alert: MonitoringAlert } = await request.json()
    
    // Process the alert based on severity
    await processAlert(alert)
    
    return NextResponse.json({ 
      success: true, 
      alertId: alert.id,
      processed: true
    })
  } catch (error) {
    console.error('Error processing alert:', error)
    return NextResponse.json(
      { error: 'Failed to process alert' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return recent alerts for dashboard
    const alerts = await getRecentAlerts()
    
    return NextResponse.json({ 
      alerts,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}

async function processAlert(alert: MonitoringAlert) {
  // Log alert
  console.log(`Alert [${alert.severity.toUpperCase()}]: ${alert.message}`, alert.data)
  
  // Send to monitoring service
  if (process.env.MONITORING_WEBHOOK_URL) {
    try {
      await fetch(process.env.MONITORING_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MONITORING_API_KEY}`
        },
        body: JSON.stringify({
          type: 'i18n_alert',
          alert,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to send alert to monitoring service:', error)
    }
  }
  
  // Send immediate notifications for critical alerts
  if (alert.severity === 'critical') {
    await sendCriticalAlert(alert)
  }
  
  // Create incident if needed
  if (alert.severity === 'critical' || alert.type === 'error_rate') {
    await createIncident(alert)
  }
}

async function sendCriticalAlert(alert: MonitoringAlert) {
  const notifications = []
  
  // Slack/Teams notification
  if (process.env.ALERT_WEBHOOK_URL) {
    notifications.push(
      fetch(process.env.ALERT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 CRITICAL I18N ALERT`,
          attachments: [{
            color: 'danger',
            title: alert.message,
            fields: [
              {
                title: 'Alert Type',
                value: alert.type,
                short: true
              },
              {
                title: 'Severity',
                value: alert.severity.toUpperCase(),
                short: true
              },
              {
                title: 'Time',
                value: alert.timestamp.toISOString(),
                short: true
              },
              {
                title: 'Data',
                value: JSON.stringify(alert.data, null, 2),
                short: false
              }
            ],
            footer: 'I18n Monitoring System',
            ts: Math.floor(alert.timestamp.getTime() / 1000)
          }]
        })
      })
    )
  }
  
  // Email notification (if configured)
  if (process.env.EMAIL_ALERT_ENDPOINT) {
    notifications.push(
      fetch(process.env.EMAIL_ALERT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`
        },
        body: JSON.stringify({
          to: process.env.ALERT_EMAIL_RECIPIENTS?.split(',') || [],
          subject: `🚨 Critical I18n Alert: ${alert.message}`,
          html: generateAlertEmailHTML(alert)
        })
      })
    )
  }
  
  // SMS notification for critical alerts (if configured)
  if (process.env.SMS_ALERT_ENDPOINT && alert.severity === 'critical') {
    notifications.push(
      fetch(process.env.SMS_ALERT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SMS_API_KEY}`
        },
        body: JSON.stringify({
          to: process.env.ALERT_PHONE_NUMBERS?.split(',') || [],
          message: `CRITICAL I18N ALERT: ${alert.message}. Check dashboard immediately.`
        })
      })
    )
  }
  
  // Wait for all notifications to complete
  try {
    await Promise.allSettled(notifications)
  } catch (error) {
    console.error('Some alert notifications failed:', error)
  }
}

async function createIncident(alert: MonitoringAlert) {
  // Create incident in incident management system (e.g., PagerDuty, Opsgenie)
  if (process.env.INCIDENT_MANAGEMENT_URL) {
    try {
      await fetch(process.env.INCIDENT_MANAGEMENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.INCIDENT_API_KEY}`
        },
        body: JSON.stringify({
          title: `I18n System Alert: ${alert.message}`,
          description: `Alert Type: ${alert.type}\nSeverity: ${alert.severity}\nData: ${JSON.stringify(alert.data, null, 2)}`,
          severity: mapSeverityToIncident(alert.severity),
          service: 'i18n-system',
          alertId: alert.id,
          timestamp: alert.timestamp.toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to create incident:', error)
    }
  }
}

function mapSeverityToIncident(severity: string): string {
  switch (severity) {
    case 'critical': return 'critical'
    case 'high': return 'high'
    case 'medium': return 'low'
    case 'low': return 'info'
    default: return 'low'
  }
}

function generateAlertEmailHTML(alert: MonitoringAlert): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h1 style="color: #dc3545; margin: 0;">🚨 Critical I18n Alert</h1>
          <p style="margin: 10px 0; font-size: 16px;">${alert.message}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h2>Alert Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Alert Type</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${alert.type}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Severity</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${alert.severity.toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Time</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${alert.timestamp.toISOString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Alert ID</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${alert.id}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin: 20px 0;">
          <h2>Additional Data</h2>
          <pre style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(alert.data, null, 2)}</pre>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #e9ecef; border-radius: 4px;">
          <p style="margin: 0;"><strong>Next Steps:</strong></p>
          <ol style="margin: 10px 0;">
            <li>Check the monitoring dashboard for more details</li>
            <li>Review recent deployments and changes</li>
            <li>Investigate affected languages and translations</li>
            <li>Consider enabling maintenance mode if necessary</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 20px 0; color: #6c757d;">
          <p>I18n Monitoring System • ${new Date().toISOString()}</p>
        </div>
      </body>
    </html>
  `
}

async function getRecentAlerts() {
  // In a real implementation, this would fetch from a database
  // For now, return mock data
  return [
    {
      id: 'alert-1',
      timestamp: new Date(),
      type: 'error_rate',
      severity: 'medium',
      message: 'Elevated error rate detected for Spanish translations',
      resolved: false
    }
  ]
}