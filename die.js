import k from './kaboom.js'

export default function die () {
    add([text('YOU DIED', 30), color(1,0,0), origin('center'), pos(width()/2, height()/2.5)])
    add([text('Click or press space'), origin('center'), pos(width()/2, height()/2)])
    
    mouseClick(() => {
        go('start')
    })

    keyDown('space', () => {
        go('start')
    })
}