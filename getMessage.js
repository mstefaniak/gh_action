const getMessage = (result) => {
    if (result === 'success') {
      return {
        body: '> :tada: The deployment has succeeded',
        reactions: '+1',
      }
    }
  
    if (result === 'failure') {
      return {
        body: '> :x: The deployment has failed',
        reactions: '-1',
      }
    }
  
    if (result === 'skipped') {
      return {
        body: '> :fast_forward: The deployment has been skipped (no changes detected). To force a deployment, add `[force=true]` to your commit command.',
        reactions: '+1',
      }
    }
  
    if (result === 'cancelled') {
      return {
        body: '> :rewind: The deployment has been cancelled',
        reactions: '+1',
      }
    }
  
    return {
      body: '> :question: The deployment has an unknown status',
      reactions: '-1',
    }
  }
  
  module.exports = { getMessage }
  