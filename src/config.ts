import type { IConfig } from '@/types.ts'
import { x } from 'tinyexec'

export const resolveConfig = async (): Promise<IConfig> => {
    const cwd = process.cwd()
    const caches: IConfig = {}

    async function getCachePath(command: string, args: string[]): Promise<string | null> {
        try {
            const { stdout } = await x(command, args, {
                nodeOptions: {
                    cwd,
                    stdio: 'pipe',
                },
            })
            return stdout.trim()
        }
        catch (error) {
            return null
        }
    }

    // npm/npx
    const npmCache = await getCachePath('npm', ['config', 'get', 'cache'])

    if (npmCache)
        caches.npm = `${npmCache}/_npx`

    // pnpm/dlx
    const pnpmCache = await getCachePath('pnpm', ['store', 'path'])
    if (pnpmCache)
        caches.pnpm = `${pnpmCache}/projects`

    // yarn/dlx
    const yarnCache = await getCachePath('yarn', ['cache', 'dir'])
    if (yarnCache)
        caches.yarn = yarnCache

    // bun/bunx
    const bunCache = await getCachePath('bun', ['pm', 'cache'])
    if (bunCache)
        caches.bun = bunCache

    return caches
}
