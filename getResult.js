const getResult = (initStatus, buildStatus) => {
    if (initStatus === 'success' && buildStatus === 'success') {
      return 'success'
    } else if (initStatus === 'cancelled' || buildStatus === 'cancelled') {
      return 'cancelled'
    } else if (initStatus === 'failure' || buildStatus === 'failure') {
      return 'failure'
    } else if (initStatus === 'success' && buildStatus === 'skipped') {
      return 'skipped'
    }
  
    return 'unhandled'
  }
  
  module.exports = { getResult }
  