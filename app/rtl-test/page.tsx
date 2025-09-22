"use client"

import { useLanguage } from "@/components/language-provider"
import { useRTLStyles } from "@/lib/rtl-utils"
import { Button } from "@/components/ui/button"
import { RTLInput } from "@/components/ui/rtl-input"
import { RTLTextarea } from "@/components/ui/rtl-textarea"
import { 
  RTLNavigation, 
  RTLBreadcrumb, 
  RTLButtonGroup, 
  RTLCard, 
  RTLCardHeader, 
  RTLCardContent, 
  RTLCardFooter 
} from "@/components/ui/rtl-navigation"
import { Heart, Star, ArrowRight, ArrowLeft } from "lucide-react"

export default function RTLTestPage() {
  const { language, direction, t } = useLanguage()
  const rtlStyles = useRTLStyles(language)

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Test", href: "/rtl-test" },
    { label: "RTL Components", current: true }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir={direction}>
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className={`text-center space-y-4 ${rtlStyles.isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-4xl font-bold text-gray-900">
            RTL Component Test Page
          </h1>
          <p className="text-lg text-gray-600">
            Current Language: {language} | Direction: {direction}
          </p>
          <RTLBreadcrumb items={breadcrumbItems} className="justify-center" />
        </div>

        {/* Navigation Test */}
        <RTLCard>
          <RTLCardHeader>
            <h2 className="text-2xl font-semibold">Navigation Components</h2>
          </RTLCardHeader>
          <RTLCardContent className="space-y-4">
            <RTLNavigation className="space-x-4 p-4 bg-gray-100 rounded">
              <Button variant="outline">First</Button>
              <Button variant="outline">Second</Button>
              <Button variant="outline">Third</Button>
            </RTLNavigation>

            <RTLButtonGroup>
              <Button variant="outline">Left</Button>
              <Button variant="outline">Center</Button>
              <Button variant="outline">Right</Button>
            </RTLButtonGroup>
          </RTLCardContent>
        </RTLCard>

        {/* Form Components Test */}
        <RTLCard>
          <RTLCardHeader>
            <h2 className="text-2xl font-semibold">Form Components</h2>
          </RTLCardHeader>
          <RTLCardContent className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${rtlStyles.isRTL ? 'text-right' : 'text-left'}`}>
                RTL Input Field
              </label>
              <RTLInput 
                placeholder="Type something here..." 
                className="w-full"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${rtlStyles.isRTL ? 'text-right' : 'text-left'}`}>
                RTL Textarea
              </label>
              <RTLTextarea 
                placeholder="Enter your message here..."
                rows={4}
                className="w-full"
              />
            </div>
          </RTLCardContent>
        </RTLCard>

        {/* Text Direction Test */}
        <RTLCard>
          <RTLCardHeader>
            <h2 className="text-2xl font-semibold">Text Direction Test</h2>
          </RTLCardHeader>
          <RTLCardContent className="space-y-4">
            <div className={`p-4 bg-blue-50 rounded ${rtlStyles.isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="font-semibold mb-2">English Text (LTR)</h3>
              <p>This is a sample paragraph in English. It should always be left-to-right regardless of the current language setting.</p>
            </div>

            <div className={`p-4 bg-green-50 rounded ${rtlStyles.isRTL ? 'text-right' : 'text-left'}`} dir="rtl">
              <h3 className="font-semibold mb-2">Arabic Text (RTL)</h3>
              <p>هذا نص تجريبي باللغة العربية. يجب أن يكون من اليمين إلى اليسار دائماً.</p>
            </div>

            <div className={`p-4 bg-purple-50 rounded ${rtlStyles.isRTL ? 'text-right' : 'text-left'}`} dir="rtl">
              <h3 className="font-semibold mb-2">Hebrew Text (RTL)</h3>
              <p>זהו טקסט לדוגמה בעברית. הוא צריך להיות תמיד מימין לשמאל.</p>
            </div>
          </RTLCardContent>
        </RTLCard>

        {/* Icon and Button Test */}
        <RTLCard>
          <RTLCardHeader>
            <h2 className="text-2xl font-semibold">Icons and Buttons</h2>
          </RTLCardHeader>
          <RTLCardContent className="space-y-4">
            <div className={`flex items-center gap-4 ${rtlStyles.isRTL ? 'flex-row-reverse' : ''}`}>
              <Button className={`flex items-center ${rtlStyles.isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <Heart className="w-4 h-4" />
                <span>Like</span>
              </Button>

              <Button variant="outline" className={`flex items-center ${rtlStyles.isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <Star className="w-4 h-4" />
                <span>Favorite</span>
              </Button>

              <Button variant="ghost" className={`flex items-center ${rtlStyles.isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <span>Next</span>
                {rtlStyles.isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </RTLCardContent>
        </RTLCard>

        {/* Layout Test */}
        <RTLCard>
          <RTLCardHeader>
            <h2 className="text-2xl font-semibold">Layout Test</h2>
          </RTLCardHeader>
          <RTLCardContent>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${rtlStyles.isRTL ? 'text-right' : 'text-left'}`}>
              <div className="p-4 bg-red-50 rounded">
                <h4 className="font-semibold mb-2">Card 1</h4>
                <p>This card should align properly based on the current text direction.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded">
                <h4 className="font-semibold mb-2">Card 2</h4>
                <p>This card should also align properly and maintain consistent spacing.</p>
              </div>
            </div>
          </RTLCardContent>
          <RTLCardFooter>
            <Button>Action 1</Button>
            <Button variant="outline">Action 2</Button>
          </RTLCardFooter>
        </RTLCard>

        {/* CSS Custom Properties Test */}
        <RTLCard>
          <RTLCardHeader>
            <h2 className="text-2xl font-semibold">CSS Custom Properties</h2>
          </RTLCardHeader>
          <RTLCardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Direction:</strong> {direction}</p>
              <p><strong>Start:</strong> {rtlStyles.customProperties['--start']}</p>
              <p><strong>End:</strong> {rtlStyles.customProperties['--end']}</p>
              <p><strong>Is RTL:</strong> {rtlStyles.isRTL ? 'Yes' : 'No'}</p>
              <p><strong>Is LTR:</strong> {rtlStyles.isLTR ? 'Yes' : 'No'}</p>
            </div>
          </RTLCardContent>
        </RTLCard>
      </div>
    </div>
  )
}