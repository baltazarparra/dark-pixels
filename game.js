import k from './kaboom.js'

import UI from './ui.js'
import LEVEL from './level.js'
import WIN from './win.js'
import DIE from './die.js'
import FINAL from './final.js'
import SECOND from './second.js'

loadRoot('./imgs/')
loadSprite('mage', 'mage.png')
loadSprite('castle', 'castle.png')
loadSprite('boss1', 'boss1.png')
loadSprite('boss2', 'boss2.png')
loadSprite('boss3', 'boss3.png')
loadSprite('boss4', 'boss4.png')
loadSprite('boss5', 'boss5.png')
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
loadSprite('power', 'power.png')
loadSprite('mageup', 'mageup.png')

scene('start', UI)
scene('game', LEVEL)
scene('win', WIN)
scene('die', DIE)
scene('final', FINAL)
scene('second', SECOND)

start('start') 