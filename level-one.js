import k from './kaboom.js'

export default function level () {
    let MOVE_SPEED = 90
    let JUMP_FORCE = 220
    let DIR = 'right'
    let SHIELD = true
    let SHIELDB = true
    let MAGE = 1.5
    let hasGem = false
    let addMsg = true
    let keyMsg = true
    let DASH_SPEED = 180

    layers(['bg', 'obj'], 'obj')

    const player = add([
        sprite('dark'),
        solid(),
        pos(0,240),
        body(),
        {
            dir: vec2(1,0),
            slideTo: vec2(0, 0),
            sliding: false,
            canSlide: true,
            canAttack: true
        },
        'player'
    ])

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

    function attack(p) {
        const obj = add([sprite('mage'), scale(MAGE), pos(p.x, p.y - 10), 'mage'])

        wait(1, () => {
            destroy(obj)
            if (DIR === 'right') player.changeSprite('dark')
            if (DIR === 'left') player.changeSprite('dark-reverse')
        })
    }

    player.action(() => {
        camPos(player.pos)
    })

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
            go('two')
        } else if (addMsg) {
            addMsg = false
            add([text('you need a key'), pos(player.pos.x, player.pos.y)])
        }
    })

    player.collides('danger', () => {
        go('die')
    })

    player.on('update', () => {
        if (player.sliding) {
            player.pos.x += player.slideTo.x * DASH_SPEED * dt()
        } else {
            player.sliding = false
            player.slideTo = vec2(0, 0)
        }
	})

    overlaps('player', 'wall', (player) => {
        if (player.sliding) {
            player.sliding = false
            player.canSlide = true
            player.slideTo = vec2(0, 0)
        }
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

    keyDown('a', () => {
        DIR = 'left'

        if (player.sliding) {
            return
        }

        player.changeSprite('dark-reverse')
        player.move(-MOVE_SPEED, 0)
        player.dir = vec2(-1,0)
    })

    keyDown('d', () => {
        DIR = 'right'

        if (player.sliding) {
            return
        }

        player.changeSprite('dark')
        player.move(MOVE_SPEED, 0)
        player.dir = vec2(1,0)
    })

    keyPress('w', () => {

        if (player.sliding) {
            return
        }

        if (player.grounded()) {
            player.jump(JUMP_FORCE, 0)
        }
    })

    keyPress('s', () => {
        if (player.canSlide && !player.sliding && player.grounded()) {
            player.canSlide = false
            player.sliding = true
            if (DIR === 'right') player.slideTo = vec2(-1, 0)
            if (DIR === 'left') player.slideTo = vec2(1, 0)
            wait(0.25, () => {
                if (player.sliding) {
                    player.sliding = false
                    wait(0.5, () => {
                        player.canSlide = true
                    })
                }
            })
        }
    })

    keyPress('space', () => {
        if(player.canAttack) {
            player.canAttack = false
            attack(player.pos.add(player.dir.scale(20)))
            if (DIR === 'right') player.changeSprite('dark-attack')
            if (DIR === 'left') player.changeSprite('dark-attack-reverse')
            wait(0.8, () => {
                player.canAttack = true
            })
        }
    })

    mouseClick(() => {
        if(player.canAttack) {
            player.canAttack = false
            attack(player.pos.add(player.dir.scale(20)))
            if (DIR === 'right') player.changeSprite('dark-attack')
            if (DIR === 'left') player.changeSprite('dark-attack-reverse')
            wait(0.8, () => {
                player.canAttack = true
            })
        }
    })
}