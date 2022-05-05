import chalk from 'chalk'
import { toNumber, isNumber, isNaN, isSafeInteger } from 'lodash'
import execa from 'execa'
import ora from 'ora'
// @ts-ignore
import gradient from 'gradient-string'

const isValidNumber = (v: string): [true, number] | [false, null] => {
  const versionAsNumber = toNumber(v)
  if (isNumber(versionAsNumber) && !isNaN(versionAsNumber)) {
    return [true, versionAsNumber]
  }
  return [false, null]
}

const isCommandExist = async (cmd: string) => {
  try {
    await execa(`${cmd}`, ['--version'])
    return true
  } catch (e) {
    return false
  }
}

const install = async (v: string) => {
  const spinner = ora(gradient.atlas('Installing...'))
  spinner.start()
  const isPnpmExist = await isCommandExist('pnpm')
  if (isSafeInteger(toNumber(v))) {
    v = `^${v}`
  }
  if (isPnpmExist) {
    await execa(`pnpm`, [`add`, `-g`, `pnpm@${v}`])
  } else {
    await execa(`npm`, [`i`, `-g`, `pnpm@${v}`], { stdio: 'inherit' })
  }
  spinner.stop()
  await execa(`pnpm`, [`--version`], { stdio: 'inherit' })
}

export const toggleVersion = async (v: string) => {
  if (!v?.length) {
    console.log(chalk.red(`version cannot be empty`))
    return
  }
  const [isValid, versionAsNumber] = isValidNumber(v)
  if (!isValid) {
    console.log(chalk.red(`version must be valid number (e.g. 6.20)`))
    return
  }
  // install
  await install(v)
  if (versionAsNumber >= 7) {
    await execa(`pnpm`, ['setup'])
  }
  console.log(`> ${gradient.pastel('Toggled pnpm')} ${chalk.bold.green(v)}`)
}