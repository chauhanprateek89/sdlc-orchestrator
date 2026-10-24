export const meta = {
  name: 'qa',
  description: 'Test each requirement against the running app with screenshots as evidence, one at a time because the browser is shared.',
  whenToUse: 'Run by the sdlc orchestrator after the build. args: { repoRoot, baseUrl, startCommand, items: [{ requirement, criteria, taskIds, mockups }] }.',
  phases: [
    { title: 'QA', detail: 'one checker per requirement, in order' },
  ],
}

const input = typeof args === 'string' ? JSON.parse(args) : args
if (!input || !input.repoRoot || !input.baseUrl || !Array.isArray(input.items) || input.items.length === 0) {
  return { ok: false, reason: 'qa needs args.repoRoot, args.baseUrl and a non-empty args.items list' }
}
const { repoRoot, baseUrl, startCommand, items } = input

const schema = {
  type: 'object',
  required: ['requirement', 'results'],
  properties: {
    requirement: { type: 'string' },
    results: {
      type: 'array',
      items: {
        type: 'object',
        required: ['criterion', 'pass', 'evidence'],
        properties: {
          criterion: { type: 'string' },
          pass: { type: 'boolean' },
          evidence: { type: 'string' },
        },
      },
    },
    testsAdded: { type: 'array', items: { type: 'string' } },
  },
}

const list = xs => (xs && xs.length ? xs.map(x => `- ${x}`).join('\n') : '- (none)')

const reports = []
for (const item of items) {
  const r = await agent(`Test requirement ${item.requirement} against the running app.
Repository: ${repoRoot}
Local URL: ${baseUrl}
Start command, if the URL doesn't answer: ${startCommand || '.sdlc/init.sh'}
Tasks to mark: ${(item.taskIds || []).join(', ') || '(none)'}
Mockups to compare against: ${(item.mockups || []).join(', ') || 'none'}
Acceptance criteria:
${list(item.criteria)}`, { label: `qa ${item.requirement}`, phase: 'QA', agentType: 'sdlc:qa', schema })
  reports.push(r
    ? { ...r, passed: r.results.length > 0 && r.results.every(c => c.pass) }
    : { requirement: item.requirement, passed: false, results: [], error: 'the QA agent returned nothing' })
}

const failed = reports.filter(r => !r.passed)
return {
  ok: failed.length === 0,
  passed: reports.length - failed.length,
  total: reports.length,
  failed: failed.map(r => ({ requirement: r.requirement, failures: r.results.filter(c => !c.pass), error: r.error })),
  reports,
}
