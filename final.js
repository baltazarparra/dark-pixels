import k from './kaboom.js'

export default function final () {

    const player = add([
        sprite('dark'),
        solid(),
        pos(20,240),
        body(),
        {
            dir: vec2(1,0)
        }
    ]) 

    layers(['bg', 'obj'], 'obj')

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

    player.action(() => {
        camPos(player.pos)
    })

    let MOVE_SPEED = 90
    let JUMP_FORCE = 220
    let DIR = 'right'
    let SHIELD = 5

    function attack(p) {
        const obj = add([sprite('mage'), scale(1.2), pos(p), 'mage'])
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
    
    player.collides('danger', () => {
        go('die')
    })

    collides('mage', 'ghost', (k, s) => {
        camShake(10)
        s.move(6000, 0)

        if (SHIELD === 5) {
            s.changeSprite('boss2')
            wait(1, () => {
                SHIELD = SHIELD - 1
            })
        }

        if (SHIELD === 4) {
            s.changeSprite('boss3')
            wait(1, () => {
                SHIELD = SHIELD - 1
            })
        }

        if (SHIELD === 3) {
            s.changeSprite('boss4')
            wait(1, () => {
                SHIELD = SHIELD - 1
            })
        }

        if (SHIELD === 2) {
            s.changeSprite('boss5')
            wait(1, () => {
                SHIELD = SHIELD - 1
            })
        }

        console.log('SHIELD', SHIELD)

        if (SHIELD === 1) {
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