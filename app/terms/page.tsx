import Link from 'next/link'

export default function TermsPage() {
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
          <h1>Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Print Goals, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Print Goals is a web application that allows users to create, organize, and print goal lists. The service is designed to help users track their goals in a physical, printed format.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To use our service, you must create an account using a valid email address. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>

          <h2>4. User Content</h2>
          <p>
            You retain ownership of any content you create using Print Goals. You grant us permission to store and process your content solely for the purpose of providing our service to you.
          </p>

          <h2>5. Prohibited Uses</h2>
          <p>
            You may not use Print Goals for any unlawful purpose or in any way that could damage, disable, or impair the service. You agree not to attempt to gain unauthorized access to any part of the service.
          </p>

          <h2>6. Service Availability</h2>
          <p>
            We strive to maintain high availability but do not guarantee that the service will be available at all times. We may temporarily suspend service for maintenance or updates.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            Print Goals is provided "as is" without any warranties. We shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the service.
          </p>

          <h2>8. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or the service.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
          </p>

          <h2>10. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us through our website.
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