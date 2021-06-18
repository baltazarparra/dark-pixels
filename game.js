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
loadSprite('dark-reverse', 'dark-reverse.png')
loadSprite('ghost', 'ghost.png')
loadSprite('gem', 'key.png')
loadSprite('portal', 'portal.png')
loadSprite('bg', 'bg.png')

scene('game', () => {
    
    layers(['bg', 'obj'], 'obj')

    const map = [
        '                                                                                 ',
        '                                                               #                 ',
        '    #                                                                            ',
        '                             #                                                   ',
        '                                                #                                ',
        '           #                                                #                    ',
        '           >>                                                                    ',
        '        >                    #                #  =#%                             ',
        '             #    >>>                         =   ==>     #                      ',
        '            =>>                                        >          #              ',
        '   #   = =       >                       ===>         =                          ',
        '      =  >>        >              =    >         >  =&                           ',
        '#  =        =        =   =            =    #   =                                 ',
        '=============   ==========   =======>>=    ======================================',
    ]

    let hasGem = false

    function respawn() {
		player.pos = vec2(0, 0)
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
        pos(0,100),
        body(),
        {
            dir: vec2(1,0)
        }
    ]) 

    player.action(() => {
        camPos(player.pos)
    })

    const MOVE_SPEED = 90
    const JUMP_FORCE = 220

    function spawn(p) {
        const obj = add([sprite('mage'), scale(1.5), pos(p), 'mage'])
        wait(1, () => {
            destroy(obj)
        })
    }
    
    player.overlaps('gem', (gem) => {
        destroy(gem)
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
        go('lose')
    })

    collides('mage', 'ghost', (k, s) => {
        camShake(4)
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
        player.changeSprite('dark-reverse')
        player.move(-MOVE_SPEED, 0)
        player.dir = vec2(-1,0)
    })

    keyDown('right', () => {
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
        spawn(player.pos.add(player.dir.scale(20)))
    })

	player.action(() => {
		if (player.pos.y >= 320) {
			go('lose')
		}
	});
})

scene('win', () => {
    add([text('win'), origin('center'), pos(width()/2, height()/2)])
})

scene('lose', () => {
    add([text('lose'), origin('center'), pos(width()/2, height()/2)])
})

start('game') 