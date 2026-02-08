import type { ISymlinks } from '@/types.ts'
import { readdir, realpath, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'

export const scanForSymlinks = async (dir: string, maxDepth = 3): Promise<ISymlinks[]> => {
    const results: ISymlinks[] = []

    async function walk(current: string, depth: number) {
        if (depth > maxDepth)
            return

        try {
            const entries = await readdir(current, {
                withFileTypes: true,
            })
            for (const entry of entries) {
                const fullPath = join(current, entry.name)
                if (entry.isSymbolicLink()) {
                    const real = await realpath(fullPath).catch(() => 'resolve failed')
                    if (real.indexOf('pnpm/dlx') > 0 || real === 'resolve failed') {
                        results.push({
                            path: fullPath,
                            symLink: resolve(real, '../'),
                            isSymlink: real !== 'resolve failed',
                        })
                    }
                }
                else if (entry.isDirectory()) {
                    await walk(fullPath, depth + 1)
                }
            }
        }
        catch {
        }
    }

    await walk(dir, 0)

    return results
}

export const rimraf = async (path: string) => {
    await rm(path, {
        recursive: true,
        force: true,
    })
}
