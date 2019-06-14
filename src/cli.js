#!/usr/bin/env node

const program = require('commander')

const pkg = require('../package.json')
const stackdriver = require('././index')

// main cli logic
function main () {
  program
    .version(pkg.version)
    .option('-c, --credentials <credentials>', 'The file path of the JSON file that contains your service account key')
    .option('-p, --project <project>', 'Your Google Cloud Platform project ID')
    .option('-n, --log_name <log_name>', 'The log name')
    .option('-r, --resource_name <resource_name>', 'The resource name')
    .action(({ credentials, project, resourceName, logName }) => {
      try {
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !credentials) { throw Error('Credentials are missing.') }
        const _credentials = credentials || process.env.GOOGLE_APPLICATION_CREDENTIALS
        if (!process.env.PROJECT_ID && !project) { throw Error('Project is missing.') }

        const _project = project || process.env.PROJECT_ID
        const _logName = logName || process.env.STACKDRIVER_LOG_NAME
        const _resource = resourceName || process.env.STACKDRIVER_RESOURCE

        const writeStream = stackdriver.createWriteStream({
          resource: _resource ? { type: _resource } : null,
          credentials: _credentials,
          projectId: _project,
          logName: _logName
        })
        process.stdin.pipe(writeStream)
        console.info('logging')
      } catch (error) {
        console.log(error.message)
      }
    })

  program.parse(process.argv)
}

main()
