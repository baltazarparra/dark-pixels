import k from './kaboom.js'

import { loadAssets } from './assets.js'
import START from './start.js'
import LEVEL_ONE from './level-one.js'
import WIN from './win.js'
import DIE from './die.js'
import FINAL from './final.js'
import LEVEL_TWO from './level-two.js'
import NEXT from './next.js'

loadAssets()

scene('start', START)
scene('one', LEVEL_ONE)
scene('two', LEVEL_TWO)
scene('final', FINAL)
scene('win', WIN)
scene('die', DIE)
scene('next', NEXT)

start('start') 
