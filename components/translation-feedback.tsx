'use client'

// User feedback component for reporting translation issues

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { AlertTriangle, MessageSquare, Send, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { translationQA, UserFeedback } from '@/lib/i18n/quality-assurance'
import { useLanguage } from '@/components/language-provider'

const feedbackSchema = z.object({
  type: z.enum(['incorrect', 'unclear', 'missing', 'suggestion', 'cultural']),
  message: z.string().min(10, 'Please provide at least 10 characters of feedback'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  key: z.string().optional(),
  url: z.string().optional()
})

type FeedbackFormData = z.infer<typeof feedbackSchema>

interface TranslationFeedbackProps {
  translationKey?: string
  currentTranslation?: string
  trigger?: React.ReactNode
  className?: string
}

export function TranslationFeedback({ 
  translationKey, 
  currentTranslation, 
  trigger,
  className 
}: TranslationFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()
  const { language } = useLanguage()

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: 'incorrect',
      priority: 'medium',
      key: translationKey,
      url: typeof window !== 'undefined' ? window.location.href : ''
    }
  })

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true)
    
    try {
      const feedbackData: Omit<UserFeedback, 'id' | 'timestamp' | 'status'> = {
        language,
        key: data.key || translationKey || 'unknown',
        type: data.type,
        message: data.message,
        priority: data.priority,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        url: data.url || (typeof window !== 'undefined' ? window.location.href : undefined)
      }

      const feedbackId = translationQA.submitUserFeedback(feedbackData)
      
      setIsSubmitted(true)
      toast({
        title: 'Feedback Submitted',
        description: `Thank you for your feedback! Reference ID: ${feedbackId.slice(-8)}`,
        duration: 5000
      })

      // Reset form after a delay
      setTimeout(() => {
        setIsOpen(false)
        setIsSubmitted(false)
        form.reset()
      }, 2000)

    } catch (error) {
      console.error('Failed to submit feedback:', error)
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your feedback. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const feedbackTypes = [
    { value: 'incorrect', label: 'Incorrect Translation', description: 'The translation is wrong or inaccurate' },
    { value: 'unclear', label: 'Unclear Meaning', description: 'The translation is confusing or ambiguous' },
    { value: 'missing', label: 'Missing Translation', description: 'Content is not translated' },
    { value: 'suggestion', label: 'Improvement Suggestion', description: 'I have a better translation suggestion' },
    { value: 'cultural', label: 'Cultural Issue', description: 'The translation is culturally inappropriate' }
  ]

  const defaultTrigger = (
    <Button 
      variant="outline" 
      size="sm" 
      className={`gap-2 ${className}`}
    >
      <MessageSquare className="h-4 w-4" />
      Report Issue
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Report Translation Issue
          </DialogTitle>
          <DialogDescription>
            Help us improve translations by reporting issues or suggesting improvements.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
            <p className="text-muted-foreground">
              Your feedback has been submitted and will be reviewed by our translation team.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Current Translation Context */}
              {currentTranslation && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Current Translation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-muted p-3 rounded-md">
                      "{currentTranslation}"
                    </p>
                    {translationKey && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Key: {translationKey}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Feedback Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 gap-3"
                      >
                        {feedbackTypes.map((type) => (
                          <div key={type.value} className="flex items-start space-x-3">
                            <RadioGroupItem 
                              value={type.value} 
                              id={type.value}
                              className="mt-1"
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label 
                                htmlFor={type.value}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {type.label}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {type.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe the issue or provide your suggestion..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much detail as possible to help us understand and fix the issue.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low - Minor improvement</SelectItem>
                        <SelectItem value="medium">Medium - Noticeable issue</SelectItem>
                        <SelectItem value="high">High - Significant problem</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Translation Key (if not provided as prop) */}
              {!translationKey && (
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Translation Key (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., navigation.home, forms.submit"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        If you know the translation key, please provide it to help us locate the issue faster.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Quick feedback button for development mode
export function QuickFeedbackButton({ 
  translationKey, 
  currentTranslation 
}: { 
  translationKey?: string
  currentTranslation?: string 
}) {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <TranslationFeedback
      translationKey={translationKey}
      currentTranslation={currentTranslation}
      trigger={
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
          title="Report translation issue"
        >
          <AlertTriangle className="h-3 w-3" />
        </Button>
      }
      className="inline-flex"
    />
  )
}

// Hook for programmatic feedback submission
export function useTranslationFeedback() {
  const { language } = useLanguage()
  const { toast } = useToast()

  const submitFeedback = async (
    key: string,
    type: UserFeedback['type'],
    message: string,
    priority: UserFeedback['priority'] = 'medium'
  ) => {
    try {
      const feedbackData: Omit<UserFeedback, 'id' | 'timestamp' | 'status'> = {
        language,
        key,
        type,
        message,
        priority,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined
      }

      const feedbackId = translationQA.submitUserFeedback(feedbackData)
      
      toast({
        title: 'Feedback Submitted',
        description: `Thank you for your feedback! Reference ID: ${feedbackId.slice(-8)}`,
        duration: 5000
      })

      return feedbackId
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your feedback. Please try again.',
        variant: 'destructive'
      })
      throw error
    }
  }

  return { submitFeedback }
}