import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="Print Goals" className="w-8 h-8" />
              <span className="text-2xl print-goals-title">Print Goals</span>
            </Link>
            <Link 
              href="/auth/signin" 
              className="px-4 py-2 text-sm text-gray-600 hover:text-neutral-800 border border-gray-400 bg-white hover:bg-gray-100"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-8 py-16">
        <div className="prose prose-gray max-w-none">
          <h1>Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Our Commitment to Your Privacy</h2>
          <p>
            <strong>We will never share, sell, or distribute your personal information or goal data to third parties.</strong> Your privacy is fundamental to our service, and we are committed to protecting your personal information.
          </p>

          <h2>Information We Collect</h2>
          <h3>Information You Provide</h3>
          <ul>
            <li><strong>Email Address:</strong> Used for account creation and authentication via magic links</li>
            <li><strong>Goal Data:</strong> The goals, categories, and progress information you create in the app</li>
          </ul>

          <h3>Information We Automatically Collect</h3>
          <ul>
            <li><strong>Usage Data:</strong> Basic analytics about how you interact with our service</li>
            <li><strong>Device Information:</strong> Browser type, device type, and IP address for security and service delivery</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use your information solely to:</p>
          <ul>
            <li>Provide and maintain the Print Goals service</li>
            <li>Authenticate your account and provide secure access</li>
            <li>Store and sync your goal data across sessions</li>
            <li>Improve our service based on usage patterns</li>
            <li>Communicate important service updates</li>
          </ul>

          <h2>Data Storage and Security</h2>
          <p>
            Your data is stored securely using industry-standard practices. We use Supabase as our backend service, which provides enterprise-grade security and encryption. Your goal data is private to your account and cannot be accessed by other users.
          </p>

          <h2>Data Sharing</h2>
          <p>
            <strong>We do not share, sell, or distribute your personal information or goal data to any third parties.</strong> The only exception would be if required by law or to protect the rights and safety of our users.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain your account information and goal data for as long as your account is active. If you wish to delete your account and all associated data, please contact us.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Update or correct your personal information</li>
            <li>Delete your account and associated data</li>
            <li>Export your goal data</li>
          </ul>

          <h2>Cookies and Tracking</h2>
          <p>
            We use minimal cookies necessary for authentication and service functionality. We do not use tracking cookies for advertising purposes.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We use Supabase for backend services and authentication. Supabase has its own privacy policy, but we ensure they meet our standards for data protection and privacy.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes via email or through the service.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or your data, please contact us through our website.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <Link href="/" className="text-neutral-800 hover:text-gray-600">
            ← Back to Print Goals
          </Link>
        </div>
      </main>
    </div>
  )
}