import * as shell from '@hydrofoil/shell'

export { alerts } from './plugins/alerts'
export { operationAlerts } from './plugins/operationAlerts'

export const routing = shell.routing({
  appPath: '/app',
  pathPrefix: '/page',
})
