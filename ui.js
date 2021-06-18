import k from './kaboom.js'

export default function ui () {
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
        go('final')
    })
}