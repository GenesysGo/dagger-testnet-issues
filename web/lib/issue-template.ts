type Screenshot = {
  name: string
  url: string
}

type TemplateParams = {
  description: string
  steps: string
  behavior: string
  screenshots?: Screenshot[]
  context?: string
}

const formatTemplate = ({ description, steps, behavior, screenshots, context }: TemplateParams) => `
**Describe the bug**
${description}

**To Reproduce**
${steps}

**Expected behavior**
${behavior}

**Screenshots**
${screenshots?.map(({ name, url }) => `![${name}](${url})`).join('\n') || 'N/A'}

**Desktop (please complete the following information):**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Smartphone (please complete the following information):**
 - Device: [e.g. iPhone6]
 - OS: [e.g. iOS8.1]
 - Browser [e.g. stock browser, safari]
 - Version [e.g. 22]

**Additional context**
${context || 'N/A'}
`

export function getIssueTemplate(params: TemplateParams) {
  const template = formatTemplate(params)

  return template
}
