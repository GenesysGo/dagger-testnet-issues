'use client'

import { useSearchParams } from 'next/navigation'

export default function Success() {
  const searchParams = useSearchParams()

  const issueNumber = searchParams.get('issue')

  if (!issueNumber) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-16">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-semibold text-white">Issue not found</h1>
          </div>
          <div className="mt-5">
            <p>
              We couldn&apos;t find the issue you were looking for.
            </p>
            <p>
              Please try again later.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO

  const issueUrl = `https://github.com/${owner}/${repo}/issues/${issueNumber}`

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <div>
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold text-white">Issue <a href={issueUrl} className="text-green-300 hover:border-b-2 border-green-300">#{issueNumber}</a> submitted</h1>
        </div>
        <div className="mt-5 space-y-2">
          <p>
            Thank you for submitting an issue! Our team will review it shortly.
          </p>
          <p>
            In the meantime, you can track the progress of your issue on <a href={issueUrl} className="text-green-300 hover:border-b-2 border-green-300">GitHub</a>.
          </p>
        </div>
      </div>
    </main>
  )
}
