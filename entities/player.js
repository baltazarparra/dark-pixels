import k from '../kaboom.js'

export function createPlayer({ x = 0, y = 240 } = {}) {
    return add([
        sprite('dark'),
        solid(),
        pos(x, y),
        body(),
        {
            dir: vec2(1, 0),
            slideTo: vec2(0, 0),
            sliding: false,
            canSlide: true,
            canAttack: true
        },
        'player'
    ])
}

export function setPlayerSprite(player, dir) {
    if (dir === 'right') {
        player.changeSprite('dark')
    }
    if (dir === 'left') {
        player.changeSprite('dark-reverse')
    }
}

export function setPlayerAttackSprite(player, dir) {
    if (dir === 'right') {
        player.changeSprite('dark-attack')
    }
    if (dir === 'left') {
        player.changeSprite('dark-attack-reverse')
    }
}
