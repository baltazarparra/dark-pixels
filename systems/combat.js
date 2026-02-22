import k from '../kaboom.js'
import { setPlayerAttackSprite, setPlayerSprite } from '../entities/player.js'

export function createAttack({ player, getDir, getMageScale }) {
    return function attack(p) {
        const obj = add([sprite('mage'), scale(getMageScale()), pos(p.x, p.y - 10), 'mage'])
        wait(1, () => {
            destroy(obj)
            setPlayerSprite(player, getDir())
        })
    }
}

export function setupAttackControls({ player, getDir, getMageScale }) {
    const attack = createAttack({ player, getDir, getMageScale })
    const performAttack = () => {
        if (player.canAttack) {
            player.canAttack = false
            attack(player.pos.add(player.dir.scale(20)))
            setPlayerAttackSprite(player, getDir())
            wait(0.8, () => {
                player.canAttack = true
            })
        }
    }
    keyPress('space', performAttack)
    mouseClick(performAttack)
}
