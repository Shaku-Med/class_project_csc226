// THIS KEY IS NOT SECURE AS IT CAN BE ACCESSED ANYWHERE INCLUDING BROWSER CONSOLE.
let keys;

// Prevent Reload.
// let PL = () => {
//     try {
//         let a = document.querySelectorAll('a')
//         if (a.length > 0) {
//             a.forEach(v => {
//                     v.addEventListener('click', async e => {
//                         e.preventDefault()
//                             //
//                         let hrf = e.target.getAttribute('href')
//                         if (hrf) {
//                             window.history.pushState(null, null, hrf)
//                                 //
//                             let ft = await fetch(hrf)
//                             let h = await ft.text()
//                                 //
//                             document.querySelector('html').innerHTML = ''
//                             document.querySelector('html').innerHTML = h
//                         }
//                     })
//                 })
//                 //
//             window.addEventListener('popstate', async e => {
//                 try {
//                     let ft = await fetch(document.location)
//                     let h = await ft.text()
//                         //
//                     document.querySelector('html').innerHTML = ''
//                     document.querySelector('html').innerHTML = h
//                 } catch {}
//             })
//         }
//     } catch {}
// }


let LogOut = async(isimmi) => {
    let lgs = async() => {
        sessionStorage.clear();
        localStorage.clear()
            // 
        let sstore = await fetch(`?endpoint=sessions.php`)
        let r = await sstore.text()

        window.location.reload()
    }
    if (!isimmi) {
        if (window.confirm(
                `🥺 Are you sure you want to logout? \n \n Don't worry, all your data is saved. \n \n Click on CANCLE to ignore or OK to continue. Hope you login again we're waiting. 😉`
            )) {
            lgs()
        }
    } else {
        lgs()
    }
}

let CheckAuth = (hasValue) => {
    try {
        let au = Obj.Window().split(/\s+/).join('')
        let lgOut = Obj.encDec(sessionStorage.getItem('auth'), au, true)
        if (!lgOut) {
            LogOut(true)
        } else {
            if (lgOut !== hasValue) {
                LogOut(true)
            }
        }
    } catch {
        LogOut(true)
    }
}

window.addEventListener('DOMContentLoaded', async() => {
    try {
        // CSRF TOKEN
        let k = await Obj.getK()
        if (k) {
            keys = k
                // 
            setInterval(Obj.KeepQuiet, 1000)
        } else {
            alert(`Unable to authorize your device, please try again later or try on another device or browser.`)
        }
    } catch (e) {
        console.log(e)
        alert(`Unable to authorize your device, please try again later or try on another device or browser.`)
    }
})