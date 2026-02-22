import k from './kaboom.js'
import { DEFAULTS } from './config.js'
import { createPlayer } from './entities/player.js'
import { setupMovementControls, setupDashControls } from './systems/controls.js'
import { setupAttackControls } from './systems/combat.js'
import { setupCameraFollow } from './systems/camera.js'

export default function level () {
    let MOVE_SPEED = DEFAULTS.moveSpeed
    let JUMP_FORCE = DEFAULTS.jumpForce
    let DIR = 'right'
    let SHIELD = true
    let SHIELDB = true
    let MAGE = DEFAULTS.mageScale
    let hasGem = false
    let addMsg = true
    let keyMsg = true
    let DASH_SPEED = DEFAULTS.dashSpeed

    layers(['bg', 'obj'], 'obj')

    const player = createPlayer({ x: 0, y: 240 })
    const getDir = () => DIR
    const setDir = (dir) => {
        DIR = dir
    }
    const getMageScale = () => MAGE

    const map = [
        [
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '     >>    >                                                                     ',
        '  =     =                                     #  =#%                             ',
        '   =        #                                 =   ==>                            ',
        '     >  #    >>                                        >                 =>      ',
        '        =        >                       ===>         =              #           ',
        '   =  ===>         >              =#   >         >  =       &       #>>          ',
        '  ==~       =        #   =     #     +=    #   =        #          ==            ',
        '=============   ==========   =======>>=    ======================================',
        ],
        [
        '                                                                                 ',
        '                                                                                 ',
        '                                                               #                 ',
        '                                #                                                ',
        '                                         #                                       ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                    %                            ',
        '                                                                                 ',
        '     >       >>  #                           ##                                  ',
        '      ~           >                       =  ==     # >=              +          ',
        '      ===>         >              =    >         >  =     >         #>>      &  >',
        '       #             #   =    =#     +=        =        #   >  #          #     >',
        '=============  >======  ==  =    ===>>=                       ===================',
        ],
        [
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '          %                                                                      ',
        '              ===                                                                ',
        '                   =                                                             ',
        '           >         ===                                                         ',
        '        =                =                       =#                              ',
        '                           =                  ==  ==>                    # =     ',
        '                    >=  ===>>                =         >               ===>      ',
        '       #        # >            =          ===>         =>                        ',
        '      ===>     ==                 =    >            =   ==             &        >',
        '  ==        =    >       =      #   +=      #  =         >=#      ~            #>',
        '====                    ========================         ========================',
        ],
        [
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '     >>    >                                                                     ',
        '  =     =                                     #  =#%                             ',
        '   =        #                                 =   ==>                            ',
        '     >  #    >>                                        >                 =>      ',
        '        =        >                       ===>         =              #           ',
        '   =  ===>         >              =#   >         >  =       &       #>>          ',
        '  ==~       =        #   =     #     +=    #   =        #          ==            ',
        '=============   ==========   =======>>=    ======================================',
        ],
        [
        '                                                                                 ',
        '                                                                                 ',
        '                                                               #                 ',
        '                                #                                                ',
        '                                         #                                       ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                    %                            ',
        '                                                                                 ',
        '     >       >>  #                           ##                                  ',
        '      ~           >                       =  ==     # >=              +          ',
        '      ===>         >              =    >         >  =     >         #>>      &  >',
        '       #             #   =    =#      =        =        #   >  #          #     >',
        '=============  >======  ==  =    ===>>=                       ===================',
        ]
    ]

    const levelConfig = {
        width: 20,
        height: 20,
        '=': [sprite('brick'), solid(), 'wall'],
        '>': [sprite('block'), solid(), 'wall'],
        '$': [sprite('gem'), solid()],
        '#': [sprite('ghost'), solid(), 'ghost', body(), 'danger', { dir: -1, timer: 0 }],
        '~': [sprite('bad'), solid(), 'bad', body(), 'danger', { dir: 1, timer: 1 }],
        '+': [sprite('bad'), solid(), 'badb', body(), 'danger', { dir: -1, timer: 0 }],
        '%': [sprite('gem'), 'gem'],
        '&': [sprite('portal'), 'portal', scale(2)]
    }

    const randLevel = Math.floor(Math.random() * 5)

    addLevel(map[Number(randLevel)], levelConfig)

    add([sprite('bg'), layer('bg')])

    add([
        pos(10,310),
        text('DARK PIXELS', 20, {
            width: 1000
        })
    ])

    add([
        pos(10,100),
        text('Walk - A, D | Jump - W | Attack - Click or Space | Dash - S', 8, {
            width: 1000
        })
    ])

    setupCameraFollow(player)
    setupMovementControls({ player, getDir, setDir, moveSpeed: MOVE_SPEED, jumpForce: JUMP_FORCE })
    setupDashControls({ player, getDir, dashSpeed: DASH_SPEED })
    setupAttackControls({ player, getDir, getMageScale })

    player.action(() => {
		if (player.pos.y >= 320) {
			go('die')
		}
	})

    player.overlaps('gem', (gem) => {
        destroy(gem)
        hasGem = true
        if (keyMsg) {
            keyMsg = false
            add([text('you got a key'), pos(player.pos.x, player.pos.y)])
        }
    })

    player.overlaps('portal', () => {
        if (hasGem) {
            go('next')
        } else if (addMsg) {
            addMsg = false
            add([text('you need a key'), pos(player.pos.x, player.pos.y)])
        }
    })

    player.collides('danger', () => {
        go('die')
    })

    collides('mage', 'ghost', (k, s) => {
        camShake(4)
        wait(1, () => {
            destroy(k)
        })
        destroy(s)
    })

    collides('mage', 'bad', (k, s) => {
        s.move(1000, 0)
        camShake(6)

        if (SHIELD) {
            s.changeSprite('bad-half')
            wait(1, () => {
                SHIELD = false
            })
        }

        if (!SHIELD) {
            wait(1.5, () => {
                destroy(k)
            })
            destroy(s)
        }
    })

    collides('mage', 'badb', (k, s) => {
        s.move(1000, 0)
        camShake(6)

        if (SHIELDB) {
            s.changeSprite('bad-half')
            wait(1, () => {
                SHIELDB = false
            })
        }

        if (!SHIELDB) {
            wait(1.5, () => {
                destroy(k)
            })
            destroy(s)
        }
    })

    collides('danger', 'wall', (s) => {
        s.dir = -s.dir
    })

    action('ghost', (s) => {
        s.move(s.dir * 80, 0)
        s.timer -= dt()
        if (s.timer <= 0) {
            s.dir = - s.dir
            s.timer = rand(10)
            s.jump(300, 0)
        }
    })

    action('bad', (s) => {
        s.move(s.dir * 40, 0)
        s.timer -= dt()
        if (s.timer <= 0) {
            s.dir = - s.dir
            s.timer = rand(4)
            s.jump(300, 0)
            s.move(-500, 0)
        }
    })

    action('badb', (s) => {
        s.move(s.dir * 60, 0)
        s.timer -= dt()
        if (s.timer <= 0) {
            s.dir = - s.dir
            s.timer = rand(6)
            s.jump(350, 0)
            s.move(500, 0)
        }
    })

    action('mage', (m) => {
        const value = 10
        m.move(value, 0)
    })

}
