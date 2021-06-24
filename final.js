import k from './kaboom.js'

export default function final () {
    let MOVE_SPEED = 90
    let JUMP_FORCE = 220
    let DIR = 'right'
    let SHIELD = 5
    let DASH_SPEED = 180

    layers(['bg', 'obj'], 'obj')

    const player = add([
        sprite('dark'),
        solid(),
        pos(60,200),
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

    function attack(p) {
        const obj = add([sprite('mage'), scale(2), pos(p.x, p.y - 10), 'mage'])

        wait(1, () => {
            destroy(obj)
            if (DIR === 'right') player.changeSprite('dark')
            if (DIR === 'left') player.changeSprite('dark-reverse')
        })
    }
    
    player.action(() => {
        camPos(player.pos)
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
        camShake(10)

        if (DIR === 'right') {
            s.move(2000, 0)
        }

        if (DIR === 'left') {
            s.move(-2000, 0)
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