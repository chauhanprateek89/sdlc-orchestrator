export const meta = {
  name: 'build',
  description: 'Build the planned tasks one at a time on the feature branch. Each task gets a two-stage review; after two failed reviews it is rebuilt on Opus.',
  whenToUse: 'Run by the sdlc orchestrator after the Plan stage. args: { repoRoot, branch, tasks: [{ id, title, requirements, files, acceptance, mockup, model }] }.',
  phases: [
    { title: 'Build', detail: 'one builder per task, in order' },
    { title: 'Review', detail: 'spec compliance, then code quality' },
  ],
}

const input = typeof args === 'string' ? JSON.parse(args) : args
if (!input || !input.repoRoot || !input.branch || !Array.isArray(input.tasks) || input.tasks.length === 0) {
  return { ok: false, reason: 'build needs args.repoRoot, args.branch and a non-empty args.tasks list from .sdlc/features.json' }
}
const { repoRoot, branch, tasks } = input

const builderSchema = {
  type: 'object',
  required: ['status', 'summary', 'filesChanged', 'commits'],
  properties: {
    status: { type: 'string', enum: ['done', 'blocked'] },
    summary: { type: 'string' },
    filesChanged: { type: 'array', items: { type: 'string' } },
    commits: { type: 'array', items: { type: 'string' } },
    blocker: { type: 'string' },
  },
}

const reviewSchema = {
  type: 'object',
  required: ['verdict', 'specIssues', 'qualityIssues'],
  properties: {
    verdict: { type: 'string', enum: ['pass', 'fail'] },
    specIssues: { type: 'array', items: { type: 'string' } },
    qualityIssues: { type: 'array', items: { type: 'string' } },
    nits: { type: 'array', items: { type: 'string' } },
  },
}

const list = xs => (xs && xs.length ? xs.map(x => `- ${x}`).join('\n') : '- (none listed)')

const brief = t => `Task ${t.id}: ${t.title}
Repository: ${repoRoot}
Branch: ${branch}
Requirements: ${(t.requirements || []).join(', ') || '(none)'} (read them in docs/requirements.md)
Files: ${(t.files || []).join(', ') || '(see .sdlc/features.json)'}
Mockup: ${t.mockup || 'none'}
Acceptance criteria:
${list(t.acceptance)}`

const findings = reviews => reviews.map((r, i) => `Review ${i + 1}
Spec issues:
${list(r.specIssues)}
Quality issues:
${list(r.qualityIssues)}`).join('\n\n')

const build = (model, prompt, label) =>
  agent(prompt, { label, phase: 'Build', agentType: 'sdlc:builder', model, schema: builderSchema })

// The reviewer gets the task and the branch, never the builder's summary.
const review = t =>
  agent(`Review task ${t.id} on branch ${branch} in ${repoRoot}.\n\n${brief(t)}\n\nReview only the commits whose message starts "${t.id}:". Write .sdlc/reviews/${t.id}.md and return your verdict.`,
    { label: `review ${t.id}`, phase: 'Review', agentType: 'sdlc:reviewer', schema: reviewSchema })

const results = []
for (const t of tasks) {
  let model = t.model === 'opus' ? 'opus' : 'sonnet'
  const reviews = []
  let outcome = null
  let built = await build(model, `${brief(t)}\n\nImplement this task with tests and commit it on ${branch}.`, `build ${t.id}`)
  while (!outcome) {
    if (!built || built.status !== 'done') {
      outcome = { id: t.id, outcome: 'blocked', model, blocker: built ? built.blocker || built.summary : 'the builder returned nothing', reviews: reviews.length }
      break
    }
    const verdict = await review(t)
    if (verdict && verdict.verdict === 'pass') {
      outcome = { id: t.id, outcome: 'passed-review', model, commits: built.commits, reviews: reviews.length + 1, nits: verdict.nits || [] }
      break
    }
    reviews.push(verdict || { specIssues: ['the reviewer returned nothing'], qualityIssues: [] })
    if (reviews.length >= 3) {
      outcome = { id: t.id, outcome: 'failed-review', model, findings: findings(reviews) }
      break
    }
    if (reviews.length === 2) {
      // Two failures: rebuild on Opus with a fresh context, per the routing rules.
      model = 'opus'
      built = await build(model, `${brief(t)}\n\nThis task has failed review twice. Rework it from the current state of ${branch}; you may revert or rewrite this task's earlier commits. Every finding below must be resolved, and every commit message must start "${t.id}:".\n\n${findings(reviews)}`, `rebuild ${t.id} on opus`)
    } else {
      built = await build(model, `${brief(t)}\n\nYour commit for this task failed review. Fix every finding below and commit the fix on ${branch} with a message starting "${t.id}:".\n\n${findings(reviews)}`, `fix ${t.id}`)
    }
  }
  results.push(outcome)
  if (outcome.outcome !== 'passed-review') {
    log(`${t.id} ${outcome.outcome}: stopping here, because later tasks may depend on it`)
    break
  }
}

const passed = results.filter(r => r.outcome === 'passed-review').length
return {
  ok: passed === tasks.length,
  branch,
  passed,
  total: tasks.length,
  results,
  notStarted: tasks.slice(results.length).map(t => t.id),
}
