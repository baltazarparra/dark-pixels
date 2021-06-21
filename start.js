import k from './kaboom.js'

export default function start () {
    add([
        pos(10,20),
        text('DARK PIXELS', 40, {
            width: 1000
        })
    ])
    add([
        pos(10,100),
        text('Click or press space', 8, {
            width: 1000
        })
    ])
    mouseClick(() => {
        go('one')
    })
    keyDown('space', () => {
        go('one')
    })
}