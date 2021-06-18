kaboom({
    global: true,
    fullscreen: true,
    scale: 1.5,
    debug: true,
    clearColor: [0,0,0,1]
})

loadRoot('./imgs/')
loadSprite('mage', 'mage.png')
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

scene('start', () => {
    add([
        pos(10,20),
        text('DARK PIXELS', 40, {
            width: 1000
        })
    ])
    add([
        pos(10,100),
        text('press spacebar to enter in darkness', 8, {
            width: 1000
        })
    ])
    keyPress('space', () => {
        go('game')
    })
})

scene('game', () => {
    
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
        '            =>>                                        >                 =>      ',
        '       = =       >                       ===>         =              #           ',
        '      =  >>        >     #        =#   >         >  =       &       #>>          ',
        '   =   #    =        =   =   #   #    =    #   =        #          ==            ',
        '=============   ==========   =======>>=    ======================================',
    ]

    let hasGem = false

    function respawn() {
		player.pos = vec2(50, 0)
	}

    const levelConfig = {
        width: 20,
        height: 20,
        '=': [sprite('brick'), solid(), 'wall'],
        '>': [sprite('block'), solid(), 'wall'],
        '$': [sprite('gem'), solid()],
        '#': [sprite('ghost'), solid(), 'ghost', body(), 'danger', { dir: -1, timer: 0 }],
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
        text('right and left = walk | space = jump | down = dark mage | up = backdash', 8, {
            width: 1000
        })
    ])

    const player = add([
        sprite('dark'),
        solid(),
        pos(400,100),
        body(),
        {
            dir: vec2(1,0)
        }
    ]) 

    player.action(() => {
        camPos(player.pos)
    })

    let MOVE_SPEED = 90
    let JUMP_FORCE = 220
    let DIR = 'right'

    function attack(p) {
        const obj = add([sprite('mage'), pos(p), 'mage'])
        wait(0.2, () => {
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
        JUMP_FORCE = 420
        hasGem = true
    })

    player.overlaps('portal', () => {
        if (hasGem) {
            go('win')
        } else {
            respawn()
        }
    })

    player.collides('danger', () => {
        respawn()
    })

    collides('mage', 'ghost', (k, s) => {
        camShake(6)
        wait(1, () => {
            destroy(k)
        })
        destroy(s)
    })

    action('danger', (s) => {
        s.move(s.dir * 80, 0)
        s.timer -= dt()
        if (s.timer <= 0) {
            s.dir = - s.dir
            s.timer = rand(10)
            s.jump(300, 0)
        }
    })

    collides('danger', 'wall', (s) => {
        s.dir = -s.dir
    })

    keyDown('left', () => {
        DIR = 'left'
        player.changeSprite('dark-reverse')
        player.move(-MOVE_SPEED, 0)
        player.dir = vec2(-1,0)
    })

    keyDown('right', () => {
        DIR = 'right'
        player.changeSprite('dark')
        player.move(MOVE_SPEED, 0)
        player.dir = vec2(1,0)
    })

    keyPress('space', () => {
        if (player.grounded()) {
            player.jump(JUMP_FORCE, 0)
        }
    })

    keyPress('up', () => {
        player.move(-3500, 0)
    })

    keyPress('down', () => {
        attack(player.pos.add(player.dir.scale(15)))
        if (DIR === 'right') {
            player.changeSprite('dark-attack')
        }

        if (DIR === 'left') {
            player.changeSprite('dark-attack-reverse')
        }
        
    })

	player.action(() => {
		if (player.pos.y >= 320) {
			respawn()
		}
	});
} )

scene('win', () => {
    add([text('win, press space to refresh'), origin('center'), pos(width()/2, height()/2)])
    
    keyPress('space', () => {
        go('game')
    })
})

start('start') 