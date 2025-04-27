import * as phys from './phys/utils.js'
const canvas = document.querySelector("canvas")
mass=getMassOfBall(5)
canvas.addEventListener('click', (e) => {
    // Append the new ball's data to the existing input array

    phys.addBall(e.clientX, e.clientY)
})
addEventListener('keypress', (e)=>{
    if (e.key==="c"){
        iscreating = !iscreating
        console.log('iscreating', iscreating)
    }
})
let iscreating = false
setInterval(()=>{
    if (iscreating){
        phys.addBall(300, 200)
    }
}, 1000/30)