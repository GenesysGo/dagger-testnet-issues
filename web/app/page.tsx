import { Octokit } from 'octokit'

import { Dropzone } from '@/components/dropzone'
import { getIssueTemplate } from '@/lib/issue-template'
import { redirect } from 'next/navigation'

export default function Home() {
  async function submit(formData: FormData) {
    'use server'

    if (!process.env.GH_PAT || !process.env.NEXT_PUBLIC_GITHUB_OWNER || !process.env.NEXT_PUBLIC_GITHUB_REPO) {
      throw new Error('Missing credentials')
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const steps = formData.get('steps') as string
    const behavior = formData.get('behavior') as string

    if (!title || !description || !steps || !behavior) {
      return redirect(`/?error=Missing fields`)
    }

    if (title.length > 60) {
      return redirect(`/?error=Title too long`)
    }

    const body = getIssueTemplate({
      description,
      steps,
      behavior,
    })

    const octokit = new Octokit({ auth: process.env.GH_PAT })

    let result

    try {
      result = await octokit.rest.issues.create({
        owner: process.env.NEXT_PUBLIC_GITHUB_OWNER,
        repo: process.env.NEXT_PUBLIC_GITHUB_REPO,
        title,
        body,
        labels: ['bug'],
      })
    } catch(e) {
      throw new Error((e as Error)?.message ?? 'Unknown error')
    }

    if (result) {
      redirect(`/success?issue=${result.data.number}`)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <div>
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold text-white">Submit a DAGGER issue</h1>
          <span className="rounded-full py-1 px-2 bg-lime-400 text-slate-900 text-xs font-medium">testnet</span>
        </div>
        <div className="mt-10">
          <form action={submit}>
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-2">
                <label className="font-medium text-slate-50" htmlFor="title">Title</label>
                <small className="text-sm font-medium text-slate-300">Give a short title to your issue report</small>
                <input type="text" id="title" name="title" className="bg-transparent rounded-sm border-2 border-slate-600 text-slate-100 outline-none px-2 py-1" />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium text-slate-50" htmlFor="description">Description</label>
                <small className="text-sm font-medium text-slate-300">A clear and concise description of what the bug is</small>
                <textarea rows={5} cols={33} id="description" name="description" className="bg-transparent rounded-sm border-2 border-slate-600 text-slate-100 outline-none px-2 py-1" />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium text-slate-50" htmlFor="steps">Steps to reproduce</label>
                <small className="text-sm font-medium text-slate-300">Step by step instructions to reproduce the issue</small>
                <textarea rows={5} cols={33} id="steps" name="steps" className="bg-transparent rounded-sm border-2 border-slate-600 text-slate-100 outline-none px-2 py-1" />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium text-slate-50" htmlFor="behavior">Expected behavior</label>
                <small className="text-sm font-medium text-slate-300">A clear and concise description of what you expected to happen</small>
                <textarea rows={5} cols={33} id="behavior" name="behavior" className="bg-transparent rounded-sm border-2 border-slate-600 text-slate-100 outline-none px-2 py-1" />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium text-slate-50" htmlFor="screenshots">Screenshots</label>
                <small className="text-sm font-medium text-slate-300">If applicable, add screenshots to help explain your problem</small>
                <Dropzone />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium text-slate-50" htmlFor="context">Additional context</label>
                <small className="text-sm font-medium text-slate-300">Add any other context about the problem here</small>
                <textarea rows={5} cols={33} id="context" name="context" className="bg-transparent rounded-sm border-2 border-slate-600 text-slate-100 outline-none px-2 py-1" />
              </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button type="submit" className="bg-blue-500 text-white rounded-sm px-4 py-2 flex items-center space-x-2 hover:bg-blue-600">
                <span className="font-medium">Submit report</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
