const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
  try {
    const token = process.env.GITHUB_TOKEN
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

  const { data: alternativeList } = await octokit.rest.search.issuesAndPullRequests({
    q: `repo:${owner}/${repo} type:pr is:merged hash:${sha}`,
    sort: 'updated',
    order: 'desc',
    per_page: 100
  })
  
  if (alternativeList.total_count === 1) {
    console.log('found:', alternativeList.items[0])
    const { title, body, number, labels, assignees } = alternativeList.items[0]
    return {
      title,
      body,
      number,
      labels: labels.map(l => l.name),
      assignees: assignees.map(a => a.login)
    }
  } else if (alternativeList.total_count > 1) {
    console.error('Found more than one pull request')
    return null
  } 
  
  console.error('Pull request not found')
  return null
}

run()
