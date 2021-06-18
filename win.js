import k from './kaboom.js'

export default function win () {
    add([text('win, press space to refresh'), origin('center'), pos(width()/2, height()/2)])
    
    keyPress('space', () => {
        go('game')
    })
}