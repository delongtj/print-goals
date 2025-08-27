import Link from 'next/link'
import ExampleGoalList from '@/components/ExampleGoalList'
import ExamplePrintView from '@/components/ExamplePrintView'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Print Goals" className="w-8 h-8" />
              <span className="text-2xl print-goals-title">Print Goals</span>
            </div>
            <Link 
              href="/auth/signin" 
              className="px-4 py-2 text-sm text-gray-600 hover:text-neutral-800 border border-gray-400 bg-white hover:bg-gray-100"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl print-goals-title mb-6">
            Keep your goals in sight
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Turn your aspirations into something tangible. 
            Organize goals across seven key areas—Spiritual, Family, Physical, Financial, Educational, Career, and Social—then print them out and keep them where you'll see them every day.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/auth/signin" 
              className="px-8 py-3 border-2 border-neutral-800 bg-neutral-800 text-white hover:bg-neutral-700 font-medium text-lg"
            >
              Start Goal Tracking
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Beautiful Goal Lists</h3>
            <p className="text-gray-600">
              Create checkbox goals for simple yes/no achievements and progress goals for tracking habits over time.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-lg">
              <span className="text-2xl">🖨️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Always Visible</h3>
            <p className="text-gray-600">
              Print and place your goals where you'll see them daily. On your wall, fridge, or desk—constant gentle reminders.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Progress</h3>
            <p className="text-gray-600">
              Watch your progress unfold as you fill in boxes by hand. Satisfying, tangible progress you can see and feel.
            </p>
          </div>
        </div>

        {/* Example */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold mb-4">Your printed goal list</h2>
          <p className="text-gray-600 mb-8">Clean, organized, ready to hang on your wall:</p>
          <div className="flex justify-center">
            <ExampleGoalList />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gray-50 rounded-lg p-12">
          <h2 className="text-3xl font-semibold mb-4">Start tracking what matters</h2>
          <p className="text-gray-600 mb-6">
            Transform your dreams into daily visual reminders.
          </p>
          <Link 
            href="/auth/signin" 
            className="inline-block px-8 py-3 border-2 border-neutral-800 bg-neutral-800 text-white hover:bg-neutral-700 font-medium text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-600">
              <img src="/logo.svg" alt="Print Goals" className="w-6 h-6" />
              <span className="text-sm">Print Goals - Keep your goals in sight</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Hidden print view for demo */}
      <ExamplePrintView />
    </div>
  )
}