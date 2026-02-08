import { intro } from '@clack/prompts'
import { createMain, defineCommand } from 'citty'
import pc from 'picocolors'
import { description, name, version } from '../package.json'

const command = defineCommand({
    meta: {
        name,
        version,
        description,
    },
    setup() {
        intro(pc.bgCyan(` ${name} [v${version}]`))
    },
    run({ args }) {
        console.log(args)
    },
})

createMain(command)({})
