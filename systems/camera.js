import k from '../kaboom.js'

export function setupCameraFollow(player) {
    player.action(() => {
        camPos(player.pos)
    })
}
