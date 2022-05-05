import { program } from 'commander'
import { join } from 'path'
import { toggleVersion } from './toggle'

const pkgPath = join(__dirname, '../package.json')
const pkg = require(pkgPath)

export const run = async () => {
  program
    .command(`use <version>`)
    .alias('u')
    .description(`toggle pnpm version`)
    .action((version) => {
      toggleVersion(version)
    })

  program.version(pkg.version)
  program.parse(process.argv)
}
