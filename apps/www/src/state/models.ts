import auth0 from '@hydrofoil/shell-auth-auth0'
import * as env from '../env'

export { core, resource, operation } from '@hydrofoil/shell'
export { app } from './app'

export const auth = auth0({
  audience: env.OIDC_AUDIENCE,
  domain: env.OIDC_URL,
  client_id: env.OIDC_CLIENT_ID,
  appPath: '/app',
})
