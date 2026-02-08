export interface IConfig {
    npm?: string
    pnpm?: string
    yarn?: string
    bun?: string
}

export interface ISymlinks {
    path: string
    symLink: string
    isSymlink: boolean
}
