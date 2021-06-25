import k from './kaboom.js'

export default function win () {
    add([text('YOU WON', 40), origin('center'), pos(width()/2, height()/2)])
    
    mouseClick(() => {
        wait(1, () => {
            go('start')
        })
    })
}