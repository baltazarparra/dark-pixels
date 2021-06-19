import k from './kaboom.js'

export default function die () {
    add([text('YOU DIED', 30), color(1,0,0), origin('center'), pos(width()/2, height()/2.5)])
    add([text('press space'), origin('center'), pos(width()/2, height()/2)])
    
    keyPress('space', () => {
        go('game')
    })
}