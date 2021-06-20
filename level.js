import k from './kaboom.js'

export default function level () {

    const player = add([
        sprite('dark'),
        solid(),
        pos(0,240),
        body(),
        {
            dir: vec2(1,0)
        }
    ]) 

    layers(['bg', 'obj'], 'obj')

    const map = [
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '           >>                                                                    ',
        '        >                                     #  =#%                             ',
        '            #     >>>                         =   ==>                            ',
        '^           =>>                                        >                 =>      ',
        '       = =       >                       ===>         =              #           ',
        '      =  >>        >              =#   >         >  =       &       #>>          ',
        '   = ~      =        =   =           +=    #   =        #          ==            ',
        '=============   ==========   =======>>=    ======================================',
    ]

    let hasGem = false

    const levelConfig = {
        width: 20,
        height: 20,
        '=': [sprite('brick'), solid(), 'wall'],
        '^': [sprite('castle'), scale(2.5 ), layer('bg')],
        '>': [sprite('block'), solid(), 'wall'],
        '$': [sprite('gem'), solid()],
        '#': [sprite('ghost'), solid(), 'ghost', body(), 'danger', { dir: -1, timer: 0 }],
        '~': [sprite('bad'), solid(), 'bad', body(), 'danger', { dir: 1, timer: 1 }],
        '+': [sprite('bad'), solid(), 'badb', body(), 'danger', { dir: -1, timer: 3 }],
        '%': [sprite('gem'), 'gem'],
        '&': [sprite('portal'), 'portal', scale(2)]
    }

    addLevel(map, levelConfig)
    
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

    player.action(() => {
        camPos(player.pos)
    })

    let MOVE_SPEED = 90
    let JUMP_FORCE = 220
    let DIR = 'right'
    let SHIELD = true
    let SHIELDB = true
    let MAGE = 1

    function attack(p) {
        const obj = add([sprite('mage'), scale(MAGE), pos(p), 'mage'])
        wait(0.1, () => {
            destroy(obj)
            if (DIR === 'right') {
                player.changeSprite('dark')
            }

            if (DIR === 'left') {
                player.changeSprite('dark-reverse')
            }
        })
    }
    
    player.overlaps('gem', (gem) => {
        destroy(gem)
        MAGE = 1.2
        hasGem = true
    })

    player.overlaps('portal', () => {
        if (hasGem) {
            go('final')
        } else {
            go('die')
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
        s.move(2000, 0)
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
        s.move(2000, 0)
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

    collides('danger', 'wall', (s) => {
        s.dir = -s.dir
    })

    keyDown('a', () => {
        DIR = 'left'
        player.changeSprite('dark-reverse')
        player.move(-MOVE_SPEED, 0)
        player.dir = vec2(-1,0)
    })

    keyDown('d', () => {
        DIR = 'right'
        player.changeSprite('dark')
        player.move(MOVE_SPEED, 0)
        player.dir = vec2(1,0)
    })

    keyPress('w', () => {
        if (player.grounded()) {
            player.jump(JUMP_FORCE, 0)
        }
    })

    keyPress('s', () => {
        player.move(-3500, 0)
    })

    keyPress('space', () => {
        attack(player.pos.add(player.dir.scale(20)))
        if (DIR === 'right') {
            player.changeSprite('dark-attack')
        }

        if (DIR === 'left') {
            player.changeSprite('dark-attack-reverse')
        }
        
    })

    mouseClick(() => {
        attack(player.pos.add(player.dir.scale(20)))
        if (DIR === 'right') {
            player.changeSprite('dark-attack')
        }

        if (DIR === 'left') {
            player.changeSprite('dark-attack-reverse')
        }
        
    })

	player.action(() => {
		if (player.pos.y >= 320) {
			go('die')
		}
	});
}