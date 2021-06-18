kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0,0,0,1]
})

loadRoot('https://i.imgur.com/')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('brick', 'pogC9x5.png')
loadSprite('block', 'fVscIbn.png')
loadSprite('mario', 'SvV4ueD.png')
loadSprite('mushroom', 'Wb1qfhK.png')
loadSprite('gem', 'gqVoI2b.png')
loadSprite('portal', 'uaUm9sN.png')
loadSprite('bg', 'S98Jvpx.png')

scene('game', () => {
    
    layers(['bg', 'obj'], 'obj')

    const map = [
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '                                                                                 ',
        '        >  >>                                 #  =#%                             ',
        '                  >>>                         =  ==                              ',
        '             >                                                                   ',
        '                 >                       ===     =                               ',
        '                   >              =   =>                                         ',
        '                                  ==  =    #   =     &                           ',
        '============================>=======>>===========================================',
    ]

    let hasGem = false

    function respawn() {
		player.pos = vec2(0, 0)
	}

    const levelConfig = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid(), scale(0.5), 'wall'],
        '>': [sprite('brick'), solid(), 'wall'],
        '$': [sprite('coin'), solid()],
        '#': [sprite('mushroom'), solid(), 'mushroom', body(), 'danger', { dir: -1, timer: 0 }],
        '%': [sprite('gem'), 'gem', scale(0.5)],
        '&': [sprite('portal'), 'portal']
    }

    addLevel(map, levelConfig)
    
    add([sprite('bg'), layer('bg')])

    const player = add([
        sprite('mario'),
        solid(),
        scale(0.5),
        pos(400,200),
        body(),
        {
            dir: vec2(1,0)
        }
    ]) 

    player.action(() => {
        camPos(player.pos)
    })

    const MOVE_SPEED = 90
    const JUMP_FORCE = 280

    function spawn(p) {
        const obj = add([sprite('coin'), pos(p), 'coin'])
        wait(1, () => {
            destroy(obj)
        })
    }
    
    player.overlaps('gem', (gem) => {
        destroy(gem)
        hasGem = true
    })

    player.overlaps('portal', (portal) => {
        if (hasGem) {
            go('win')
        } else {
            respawn()
        }
    })

    player.collides('danger', (danger) => {
        go('lose')
    })

    collides('coin', 'mushroom', (k, s) => {
        camShake(4)
        wait(1, () => {
            destroy(k)
        })
        destroy(s)
    })

    action('danger', (s) => {
        s.move(s.dir * 60, 0)
        s.timer -= dt()
        if (s.timer <= 0) {
            s.dir = - s.dir
            s.timer = rand(5)
            s.jump(400, 0)
        }
    })

    collides('danger', 'wall', (s) => {
        s.dir = -s.dir
    })

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
        player.dir = vec2(-1,0)
    })

    keyDown('right', () => {
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
        spawn(player.pos.add(player.dir.scale(10)))
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