import k from '../kaboom.js'
import { setPlayerSprite } from '../entities/player.js'

export function setupMovementControls({ player, getDir, setDir, moveSpeed, jumpForce }) {
    keyDown('a', () => {
        setDir('left')
        if (player.sliding) {
            return
        }
        setPlayerSprite(player, getDir())
        player.move(-moveSpeed, 0)
        player.dir = vec2(-1, 0)
    })

    keyDown('d', () => {
        setDir('right')
        if (player.sliding) {
            return
        }
        setPlayerSprite(player, getDir())
        player.move(moveSpeed, 0)
        player.dir = vec2(1, 0)
    })

    keyPress('w', () => {
        if (player.sliding) {
            return
        }
        if (player.grounded()) {
            player.jump(jumpForce, 0)
        }
    })
}

export function setupDashControls({ player, getDir, dashSpeed }) {
    keyPress('s', () => {
        if (player.canSlide && !player.sliding && player.grounded()) {
            player.canSlide = false
            player.sliding = true
            if (getDir() === 'right') player.slideTo = vec2(-1, 0)
            if (getDir() === 'left') player.slideTo = vec2(1, 0)
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

    player.on('update', () => {
        if (player.sliding) {
            player.pos.x += player.slideTo.x * dashSpeed * dt()
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
}
