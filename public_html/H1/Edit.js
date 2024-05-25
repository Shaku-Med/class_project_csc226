let SongUpdate = (val) => {
        let griddata = document.querySelector(".griddata")
        if (griddata) {
            griddata.innerHTML += `<div class="cards_p min-w-[300px] w-full flex items-center justify-between flex-col brd bg-[var(--dim)] p-2 overflow-hidden rounded-xl shadow-md">
                    <div data-toggle="tooltip" data-placement="top" title="${val.name}" class="cardTitle w-full text-center text-[25px] line-clamp-2 uppercase p-2 font-bold">
                        ${val.name}
                    </div>
                    <div class="cartimage w-full h-[300px] rounded-xl shadow-lg brd overflow-hidden">
                        <img class=" w-full h-full mb-1 object-cover object-top" loading="lazy" src="${val.hasOwnProperty('album') ? val.album.images[0].url : `./noimg.jpg`}" alt="">
                        <hr>
                    </div>
                    <div class="acts w-full flex items-center justify-between gap-2 p-2">
                        <div class="playcontainer overflow-hidden rounded-xl relative w-full hover:bg-[var(--border)] ">
                            <div id="play_${val.id}" class=" z-[1000000] relative playbtn uppercase cursor-pointer w-full flex items-center justify-center h-full p-2 rounded-md playbtn">
                                Play
                            </div>
                            <div id="seek_${val.id}" class="seeker"></div>
                        </div>
                        <div id="download_${val.id}" class=" uppercase cursor-pointer w-full flex items-center justify-center hover:bg-[var(--border)] h-full p-2 rounded-md savebutton">
                            Download Song
                        </div>
                    </div>
                </div>`
    }
}

let isCurrent = (val) => { 
    let controlsspott = document.querySelector('.controlsspott')
    if (controlsspott) {
        let gAt = () => { 
            let ob = []
            val.artists.map((v) => {
                ob.push(v.name)
            })
            return ob.join(', ')
        }
        controlsspott.innerHTML = `

        <div class="controlContainer max-[600px]:flex-col  flex items-center justify-between  gap-2">
                <div class="controlleftpath relative flex-col flex items-start justify-start gap-1 ">
                    <div class="imagecont h-[100px] w-[100px] max-[600px]:w-[100%]  shadow-xl brd overflow-hidden">
                        <img class=" object-cover object-top h-full w-full" src="${val.hasOwnProperty('album') ? val.album.images[0].url : `./noimg.jpg`}" alt="">
                    </div>
                    <div class="songnamesdata backdrop-blur-md w-full absolute bottom-0 text-center p-2 ">
                        <div title="${val.name}" class="songname line-clamp-1 text-lg">
                            ${val.name}
                        </div>
                        <div class="artistname line-clamp-1 text-sm opacity-[.8]">
                            ${gAt()}
                        </div>
                    </div>
                </div>
                <div class="rightpart w-full flex items-center justify-between flex-col gap-2 ">
                    <div class="upptopad flex items-center justify-between gap-2 w-full max-w-[300px] ">
                        <div class=" h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-[var(--dim)] rounded-md hover:shadow-md brd  actions back" id="back">
                            <svg id="back" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path id="back" opacity="0.4" d="M22.0002 8.33994V15.6599C22.0002 17.1599 20.3703 18.0999 19.0703 17.3499L15.9002 15.5299L12.7303 13.7C12.5303 13.58 12.3702 13.45 12.2402 13.29V10.73C12.3702 10.57 12.5303 10.44 12.7303 10.32L15.9002 8.48993L19.0703 6.66996C20.3703 5.89996 22.0002 6.83994 22.0002 8.33994Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path id="back" d="M12.2391 8.33994V15.6599C12.2391 17.1599 10.6091 18.0999 9.30914 17.3499L6.13915 15.5299L2.96914 13.7C1.66914 12.95 1.66914 11.08 2.96914 10.32L6.13915 8.48993L9.30914 6.66996C10.6091 5.89996 12.2391 6.83994 12.2391 8.33994Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class=" h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-[var(--dim)] rounded-md hover:shadow-md brd  actions pauseplay" id="pauseplay">
                            <svg id="pauseplay"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12L3 18.9671C3 21.2763 5.53435 22.736 7.59662 21.6145L10.7996 19.8727M3 8L3 5.0329C3 2.72368 5.53435 1.26402 7.59661 2.38548L20.4086 9.35258C22.5305 10.5065 22.5305 13.4935 20.4086 14.6474L14.0026 18.131" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        </div>
                        <div class=" h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-[var(--dim)] rounded-md hover:shadow-md brd  actions forward" id="forward">
                            <svg id="forward" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path id="forward" opacity="0.4" d="M2 8.33994V15.6599C2 17.1599 3.62999 18.0999 4.92999 17.3499L8.10001 15.5299L11.27 13.7C11.47 13.58 11.63 13.45 11.76 13.29V10.73C11.63 10.57 11.47 10.44 11.27 10.32L8.10001 8.48993L4.92999 6.66996C3.62999 5.89996 2 6.83994 2 8.33994Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path id="forward" d="M11.7598 8.33994V15.6599C11.7598 17.1599 13.3898 18.0999 14.6898 17.3499L17.8597 15.5299L21.0298 13.7C22.3298 12.95 22.3298 11.08 21.0298 10.32L17.8597 8.48993L14.6898 6.66996C13.3898 5.89996 11.7598 6.83994 11.7598 8.33994Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                        </div>
                    </div>
                    <div class="bottompaths flex items-center justify-between w-full gap-2 ">
                        <div class="timedilation mt-[-6px]">
                            0:00
                        </div>
                        <div class="lide w-full">
                            <input value="0" type="range" name="" id="slide" class="slide w-full">
                        </div>
                        <div class="duration mt-[-6px]">
                            0:00
                        </div>
                    </div>
                </div>
            </div>

        
        `
    }
}