const fs = require('fs')
const path = require('path')

const readFiles = require('./readFiles')

const STYLEGUIDE_DIR = path.join(__dirname, '../components/List/styleguide')
const OUT_FILE = path.join(STYLEGUIDE_DIR, 'ListStyleguide.md')

let examplesWritten = 0

const writeMarkdownContentToFile = content => {
  // wrap output in MD code fences
  const contentToWrite = `\`\`\`jsx
${content}
;<Example />
\`\`\`\n
`

  // on first pass, write to the file to clear previous content
  if (examplesWritten === 0) {
    fs.writeFileSync(OUT_FILE, contentToWrite)
  } else {
    fs.appendFileSync(OUT_FILE, contentToWrite)
  }

  examplesWritten += 1
}

const handleFileContent = (filename, content) => {
  writeMarkdownContentToFile(content)
}

const handleComplete = () => {
  // eslint-disable-next-line no-console
  console.log(`Finished writing ${examplesWritten} examples!`)
}

readFiles(STYLEGUIDE_DIR, handleFileContent, {
  fileFilter: /\.example\.[jt]sx/,
  onComplete: handleComplete,
})
