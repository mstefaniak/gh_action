const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
  try {
    const token = process.env.GITHUB_TOKEN
    console.log('token length:', token.length)
    const repo = process.env.REPO
    const owner = process.env.OWNER
    const sha = process.env.COMMIT_SHA
    console.info('context: ', repo, owner, sha)

    const pull = await getMergedPullRequest(token, owner, repo, sha)

    if (!pull) {
      console.error('Pull request not found')
      return
    }

    core.setOutput('title', pull.title)
    core.setOutput('body', pull.body)
    core.setOutput('number', pull.number)
    core.setOutput('labels', pull.labels?.join('\n'))
    core.setOutput('assignees', pull.assignees?.join('\n'))

    console.info('title', pull.title)
    console.info('body', pull.body)
    console.info('number', pull.number)
    console.info('labels', pull.labels?.join('\n'))
    console.info('assignees', pull.assignees?.join('\n'))
  } catch (e) {
    console.error(e)
    core.setFailed(e.message)
  }
}

async function getMergedPullRequest(
  githubToken,
  owner,
  repo,
  sha
) {
  const octokit = github.getOctokit(githubToken)

  const q = `repo:${owner}/${repo} type:pr is:merged hash:${sha}`
  console.log('query:', q)
  const { data: alternativeList } = await octokit.rest.search.issuesAndPullRequests({
    q,
    sort: 'updated',
    order: 'desc',
    per_page: 100
  })
  console.info('List size:', alternativeList.total_count)
  console.info('Found:', alternativeList.items.map(p => p.merge_commit_sha))

  const q2 = `repo:${owner}/${repo} type:pr is:merged merged:${sha}`
  console.log('query 2:', q)
  const { data } = await octokit.rest.search.issuesAndPullRequests({
    q: q2,
    sort: 'updated',
    order: 'desc',
    per_page: 100
  })
  console.info('List 2 size:', data.total_count)
  console.info('Found 2:', data.items.map(p => p.merge_commit_sha))

  
  const { data: list } = await octokit.rest.pulls.list({
    owner,
    repo,
    sort: 'updated',
    direction: 'desc',
    state: 'closed',
    per_page: 100
  })

  console.info('looking for: ', sha)
  console.info('list:', list.map(p => p.merge_commit_sha))
  const pull = list.find(p => p.merge_commit_sha === sha)
  console.info('found:', !!pull)
  if (!pull) {
    return null
  }

  return {
    title: pull.title,
    body: pull.body,
    number: pull.number,
    labels: pull.labels.map(l => l.name),
    assignees: pull.assignees.map(a => a.login)
  }
}

run()
