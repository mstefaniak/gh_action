const { getResult } = require('./getResult')
const { addOutput } = require('./addOutput')

const initStatus = process.argv[2]
const buildStatus = process.argv[3]

const result = getResult(initStatus, buildStatus)
addOutput('result', result)
