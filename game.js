import k from './kaboom.js'

import UI from './ui.js'
import LEVEL from './level.js'
import WIN from './win.js'

loadRoot('./imgs/')
loadSprite('mage', 'mage.png')
loadSprite('bad', 'bad.png')
loadSprite('bad-half', 'bad-half.png')
loadSprite('brick', 'brick.png')
loadSprite('block', 'block.png')
loadSprite('dark', 'dark.png')
loadSprite('dark-attack', 'dark-attack.png')
loadSprite('dark-attack-reverse', 'dark-attack-reverse.png')
loadSprite('dark-reverse', 'dark-reverse.png')
loadSprite('ghost', 'ghost.png')
loadSprite('gem', 'key.png')
loadSprite('portal', 'portal.png')
loadSprite('bg', 'bg.png')
loadSprite('attack', 'attack.png')

scene('start', UI)
scene('game', LEVEL)
scene('win', WIN)

start('start') 