import { intro, outro } from '@clack/prompts'
import { createMain, defineCommand } from 'citty'
import pc from 'picocolors'
import { resolveConfig } from '@/config.ts'
import { rimraf, scanForSymlinks } from '@/utils.ts'
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
    async run() {
        const config = await resolveConfig()

        if (config.npm) {
            await rimraf(config.npm)
        }

        if (config.pnpm) {
            const symlinks = await scanForSymlinks(config.pnpm)

            for (const p of symlinks) {
                await rimraf(p.path)

                if (p.isSymlink) {
                    await rimraf(p.symLink)
                }
            }
        }

        // TODO yarn
        // TODO bun

        outro('Done.')
    },
})

createMain(command)({})
