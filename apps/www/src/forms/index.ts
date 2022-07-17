import * as configure from '@hydrofoil/shaperone-wc/configure'
import * as SL from '@hydrofoil/shaperone-wc-shoelace/components'
import * as templates from '@hydrofoil/shaperone-wc-shoelace/templates'
import hydra from '@hydrofoil/shaperone-hydra'
import * as Editors from './editors'
import * as Components from './components'

hydra(configure)
configure.components.pushComponents(SL)
configure.components.pushComponents(Components)
configure.editors.addMatchers(Editors)
configure.renderer.setTemplates(templates)
