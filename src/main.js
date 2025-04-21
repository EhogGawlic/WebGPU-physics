import * as phys from './phys/utils.js'
addEventListener('click', (e) => {
    // Append the new ball's data to the existing input array
    phys.addBall(e.clientX, e.clientY)
    iscreating = !iscreating
})
let iscreating = false
setInterval(()=>{
    if (iscreating){
        phys.addBall(300, 200)
    }
}, 1000/30)