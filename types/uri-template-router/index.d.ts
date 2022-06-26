// eslint-disable-next-line max-classes-per-file
declare module 'uri-template-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface RouteOptions {
  }

  interface Variable {
    varname: string
    operatorChar: string
    prefix: string
    expand(params: Record<string, unknown>): string
  }

  export interface Route {
    options: RouteOptions
    variables: Variable[]
  }

  export interface Result {
    rewrite(uriTemplate: string, options: unknown, name: string): Result
    next(): Result
    template: string
    readonly name: string
    readonly route: Route
    params: Record<string, any>
  }

  export class Router {
    addTemplate(arg: { uriTemplate: string; options: RouteOptions; name: string }): void
    addTemplate(uriTemplate: string, options: RouteOptions, matchValue: string): void
    resolveRequestURI(uri: string, flags: unknown, initial_state: unknown): Result | undefined
    resolveURI(uri: string, flags: unknown): Result | undefined
    reindex(): void
    clear(): void
    hasRoute(route: string): boolean
    readonly size: number
    readonly routes: string[]
    getTemplate(uriTemplate: string): unknown
    hasTemplate(uriTemplate: string): boolean
    getValue(matchValue: unknown): unknown
    hasValue(matchValue: unknown): boolean
  }
}
