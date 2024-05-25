let greet = document.querySelector('.greet')
let firstin = document.querySelector('.firstin')
let daytime = document.querySelector('.daytime')
let video = document.querySelector('video')
let a = document.querySelectorAll('a')
    // 
if (greet && firstin && daytime && a.length > 0) {

    let GetDayTime = () => {
        const dw = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const mth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const cdate = new Date();
        const dwk = dw[cdate.getDay()];
        const month = mth[cdate.getMonth()];
        const dm = cdate.getDate();

        daytime.innerHTML = `${dwk}, ${month} ${dm}`;
    }

    // 
    let GMTS = (hr) => {
            let localOffset = new Date().getTimezoneOffset();
            let gmtoffset = localOffset / 60;
            // 
            let nhour = hr - gmtoffset;
            return (nhour + 16) % 24;
        }
        // 
    let callTime = (date) => {
            let hr = date.getHours();
            let min = date.getMinutes();
            firstin.innerHTML = `${hr < 10 ? `${hr < 1 ? `12` : `0${hr}`}` : `${hr > 12 ? `${GMTS(hr)}` : `${hr}`}`}:${min < 10 ? `0${min}` : `${min}`}`
    };

    setInterval(() => {
        let date = new Date()
        let hour = date.getHours()
        if (hour < 12) {
            greet.innerHTML = `Hey there, Good Morning. Thanks for viewing my website.`
        } else if (hour >= 12 && hour < 16) {
            greet.innerHTML = `Sup, Good Afternoon. Thanks for viewing my website.`
        } else if (hour >= 16) {
            greet.innerHTML = `Hey, Good Evening. Thanks for viewing my website.`
        }
        // 
        callTime(date)
        GetDayTime()
    }, 10);
    //

    // 

    let vidURL = [`./VIDEO/smoke1.mp4`, `./VIDEO/sm2.mp4`, `./VIDEO/sm3.mp4`, `./VIDEO/sm4.mp4`, `./VIDEO/sm5.mp4`, `./VIDEO/sm6.mp4`, `./VIDEO/sm7.mp4`, `./VIDEO/sm8.mp4`, `./VIDEO/s9.mp4`, `./VIDEO/sm10.mp4`, `./VIDEO/sm11.mp4`, `./VIDEO/sm12.mp4`, `./VIDEO/sm13.mp4`, `./VIDEO/sm14.mp4`, `./VIDEO/sm15.mp4`, `./VIDEO/sm16.mp4`]

    video.addEventListener('ended', () => { 
        let rand = Math.floor(Math.random() * vidURL.length)
        // 
        video.src = `${vidURL[rand]}`
    })
    video.addEventListener('error', () => { 
        let rand = Math.floor(Math.random() * vidURL.length)
        // 
        video.src = `${vidURL[rand]}`
    })
    // 
    video.addEventListener('pause', () => { 
        video.play()
    })
    video.addEventListener('loadedmetadata', () => { 
        video.play()
    })

    //


    // a.forEach(v => {
    //     v.addEventListener('click', e => {
    //         e.preventDefault()
    //         // 
    //     })
    // });
   
}