import k from './kaboom.js'

export default function win () {
    add([text('YOU WON'), origin('center'), pos(width()/2, height()/2)])
    
    mouseClick(() => {
        go('ui')
    })
}