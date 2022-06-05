import * as configure from '@hydrofoil/shaperone-wc/configure'
import * as SL from '@hydrofoil/shaperone-wc-shoelace/components'
import * as templates from '@hydrofoil/shaperone-wc-shoelace/templates'

configure.components.pushComponents(SL)
configure.renderer.setTemplates(templates)
