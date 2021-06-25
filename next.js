import k from './kaboom.js'

export default function die () {
    add([text('Nice! next level', 20), color(1,1,1), origin('center'), pos(width()/2, height()/2.5)])
    
    wait(1, () => {
        go('two')
    })
}