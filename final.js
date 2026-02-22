import k from './kaboom.js'
import { DEFAULTS } from './config.js'
import { createPlayer } from './entities/player.js'
import { setupMovementControls, setupDashControls } from './systems/controls.js'
import { setupAttackControls } from './systems/combat.js'
import { setupCameraFollow } from './systems/camera.js'

export default function final () {
    let MOVE_SPEED = DEFAULTS.moveSpeed
    let JUMP_FORCE = DEFAULTS.jumpForce
    let DIR = 'right'
    let SHIELD = 5
    let DASH_SPEED = DEFAULTS.dashSpeed

    layers(['bg', 'obj'], 'obj')

    const player = createPlayer({ x: 60, y: 200 })
    const getDir = () => DIR
    const setDir = (dir) => {
        DIR = dir
    }
    const getMageScale = () => DEFAULTS.finalMageScale

    const map = [
        '===============================================================================',
        '=                                                                             =',
        '=                                                                             =',
        '=                                                                             =',
        '=                                                                             =',
        '=                                                                             =',
        '=                                                                             =',
        '=                                                                             =',
        '=                                                                             =',
        '=                                                                             =',
        '=                       >>                                                    =',
        '=          >>>  >>   >                                                        =',
        '=      >>                                   #                                 =',
        '===============================================================================',
    ]

    const levelConfig = {
        width: 20,
        height: 20,
        '=': [sprite('brick'), solid(), 'wall'],
        '>': [sprite('block'), solid(), 'wall'],
        '#': [sprite('boss1'), solid(), scale(1.5), 'ghost', body(), 'danger', { dir: -1, timer: 0 }],
    }

    addLevel(map, levelConfig)
    
    add([sprite('bg'), layer('bg')])

    setupCameraFollow(player)
    setupMovementControls({ player, getDir, setDir, moveSpeed: MOVE_SPEED, jumpForce: JUMP_FORCE })
    setupDashControls({ player, getDir, dashSpeed: DASH_SPEED })
    setupAttackControls({ player, getDir, getMageScale })

    player.collides('danger', () => {
        go('die')
    })

    collides('mage', 'ghost', (k, s) => {
        camShake(10)
        s.jump(300, 100)

        if (DIR === 'right') {
            s.move(1000, 0)
        }

        if (DIR === 'left') {
            s.move(-1000, 0)
        }

        if (SHIELD === 5) {
            add([text('OUCH'), pos(player.pos.x, player.pos.y)])
            s.changeSprite('boss2')
            wait(1, () => {
                SHIELD = SHIELD - 1
            })
        }

        if (SHIELD === 4) {
            add([text('STOP DUDE!'), pos(player.pos.x, player.pos.y)])
            s.changeSprite('boss3')
            wait(1, () => {
                SHIELD = SHIELD - 1
            })
        }

        if (SHIELD === 3) {
            add([text('OMG'), pos(player.pos.x, player.pos.y)])
            s.changeSprite('boss4')
            wait(1, () => {
                SHIELD = SHIELD - 1
            })
        }

        if (SHIELD === 2) {
            add([text('AHHHHHHHHHHH'), pos(player.pos.x, player.pos.y)])
            s.changeSprite('boss5')
            wait(1, () => {
                SHIELD = SHIELD - 1
            })
        }

        if (SHIELD === 1) {
            add([text('FUUUUUUUUUUUUUCK'), pos(player.pos.x, player.pos.y)])
            destroy(s)
            go('win')
        }
    })

    action('ghost', (s) => {
        if (SHIELD === 2) {
            s.move(s.dir * 300, 0)
            s.timer -= dt()
            if (s.timer <= 0) {
                s.dir = - s.dir
                s.timer = rand(3)
                s.jump(400, 0)
            }
        } else if (SHIELD === 1) {
            s.move(s.dir * 400, 0)
            s.timer -= dt()
            if (s.timer <= 0) {
                s.dir = - s.dir
                s.timer = rand(2)
                s.jump(450, 0)
            }
        } else {
            s.move(s.dir * 100, 0)
            s.timer -= dt()
            if (s.timer <= 0) {
                s.dir = - s.dir
                s.timer = rand(4)
                s.jump(350, 0)
            }
        }
    })

    collides('danger', 'wall', (s) => {
        s.dir = -s.dir
    })

    action('mage', (m) => {
        const value = 10
        m.move(value, 0)
    })

}
