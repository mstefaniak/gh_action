const { getMessage } = require('./getMessage')
const { addOutput } = require('./addOutput')

const result = process.argv[2]
console.log('debug: result', result)
const { body, reactions } = getMessage(result)
addOutput('body', body)
addOutput('reactions', reactions)

