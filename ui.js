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
        text('press space', 8, {
            width: 1000
        })
    ])
    keyPress('space', () => {
        go('final')
    })
}