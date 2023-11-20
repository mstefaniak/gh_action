const fs = require('fs')
const os = require('os')

const filePath = process.env.GITHUB_OUTPUT
const delimiter = 'EOF'

const addOutput = (name, output) => {
  fs.appendFileSync(filePath, `${name}<<${delimiter}${os.EOL}${JSON.stringify(output)}${os.EOL}${delimiter}${os.EOL}`, {
    encoding: 'utf8'
  })
}

module.exports = { addOutput }
