import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
            <Link href="/" className="flex items-center justify-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="javascript:history.back()" className="flex items-center justify-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </Link>
          </Button>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-red-600 hover:text-red-700">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
