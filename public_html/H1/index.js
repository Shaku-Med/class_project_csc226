let endpoints = {
        page: (params, uid) => {
                return `https://fawundu-api.vercel.app/api/v2/music/${uid}${params ? `/${params}` : ''}`
    },
    sound: (params, uid) => {
                return `https://advance-player-backend.vercel.app/api/open/spotify/get/song/${uid}${params ? `/${params}` : ''}`
    },
};


let uuid = () => {
    let txt = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
    let c = 0;
    let r = ``
    for (let i = 0; i < txt.length; i++) {
        r += txt.charAt(Math.floor(Math.random() * txt.length))
        c += 1;
    }
    return r
}

window.addEventListener('DOMContentLoaded', () => {
    // 
    let search = document.querySelector('#search')
    let audio = new Audio()
    let timeOut
    // 
    let song = []
    let blob = []
    let current = null;
    
    //


    let PLA = () => {
        let pl = Functions.getCurrent()
        let seeker = document.querySelectorAll('.seeker')
        if (pl && seeker.length) {
            pl.innerHTML = `Pause`
            Functions.PlayPause(true)
            // 
            seeker.forEach(v => {
                v.style.width = `0%`
            })
        }
    };

    let PUS = () => {
        let pl = Functions.getCurrent()
        if (pl) {
            pl.innerHTML = `Play`
            Functions.PlayPause()
        }
    };

    let Functions = {

        mediaSession(val) {
            if (val) {
                if ("mediaSession" in navigator) {

                    let gAt = () => {
                        let ob = []
                        val.artists.map((v) => {
                            ob.push(v.name)
                        })
                        return ob.join(', ')
                    };

                navigator.mediaSession.metadata = new MediaMetadata({
                    title: `${val.name}`,
                    artist: `${gAt()}`,
                    album: `No Album - Just Play Me`,
                    artwork: [
                        {
                            src: `${val.hasOwnProperty('album') ? val.album.images[0].url : `./noimg.jpg`}`,
                            sizes: "96x96",
                            type: "image/png",
                        },
                        {
                            src: `${val.hasOwnProperty('album') ? val.album.images[0].url : `./noimg.jpg`}`,
                            sizes: "128x128",
                            type: "image/png",
                        },
                        {
                            src: `${val.hasOwnProperty('album') ? val.album.images[0].url : `./noimg.jpg`}`,
                            sizes: "192x192",
                            type: "image/png",
                        },
                        {
                            src: `${val.hasOwnProperty('album') ? val.album.images[0].url : `./noimg.jpg`}`,
                            sizes: "256x256",
                            type: "image/png",
                        },
                        {
                            src: `${val.hasOwnProperty('album') ? val.album.images[0].url : `./noimg.jpg`}`,
                            sizes: "384x384",
                            type: "image/png",
                        },
                        {
                            src: `${val.hasOwnProperty('album') ? val.album.images[0].url : `./noimg.jpg`}`,
                            sizes: "512x512",
                            type: "image/png",
                        },
                    ],
                });
                    
                    navigator.mediaSession.setActionHandler("play", () => {
                        PLA()
                    });

                    navigator.mediaSession.setActionHandler("pause", () => {
   PUS()
                    });
                    
                    navigator.mediaSession.setActionHandler("nexttrack", () => {
                       Functions.Next()
                    });
                    navigator.mediaSession.setActionHandler("previoustrack", () => {
                        Functions.Prev()
                    });
                    navigator.mediaSession.setActionHandler("stop", () => {
                        audio.pause()
                    });

            }
           }
        },

        SavePlays(val, isget, time) {
            try {
                if (!isget) {
                    let loc = localStorage.getItem('data')
                    if (loc !== JSON.stringify(val)) {
                        localStorage.setItem(`data`, JSON.stringify(val))
                    }
                    localStorage.setItem(`time`, time)
                }
                else {
                    let gt = localStorage.getItem(`data`)
                    let t = localStorage.getItem(`time`)
                    if (gt && t) {
                        return {
                            data: JSON.parse(gt),
                            time: t
                        }
                    }
                }
            }
            catch {}
        },

        getCurrent(isname) {
            try {
                if (current) {
                    let plb = document.querySelector(`#${!isname ? `play_` : isname}${current.id}`)
                    if (plb) {
                        return plb
                    }
                    return null
                }
                return null
            }
            catch { }
        },

        async AddSound(v, shouldplay, download, isave) {
            try {
                let ft = blob.find(b => b.id === v.id)
                if (!ft) {
                    // 
                    if (shouldplay) {
                        current = v;
                        isCurrent(v);
                        Functions.PlayerFunctions(v)
                        Functions.SavePlays(v, false, 0)
                        // 
                        let pl = Functions.getCurrent()
                        let pauseplay = document.querySelector('.pauseplay')

                        if (pl && pauseplay) {
                            pauseplay.innerHTML = `<i class="loading animate-ping h-3 w-3 bg-primary rounded-full"></i>`
                            pl.innerHTML = `<i class="loading animate-ping h-3 w-3 bg-primary rounded-full"></i>`
                        }
                    }
                    // 
                    let x = await axios.get(endpoints.sound(`?id=${v.id}`, uuid()))
                    let fet = await fetch(x.data.link)
                    let ul = await fet.arrayBuffer()
                    // 
                    let b = new Blob([ul], { type: `audio/mp3` })

                    let obj = {
                        id: v.id,
                        blob: b
                    }
                    // 
                    blob.push(obj)
                    // 
                    
                    // 
                    if (shouldplay) {
                        audio.src = `${URL.createObjectURL(b)}`
                        // 
                        let playbtn = document.querySelectorAll('.playbtn');
                        if (playbtn.length > 0) {
                            // 
                            playbtn.forEach(y => {
                                y.innerHTML = `Play`
                            })
                        }
                    }

                    if (download) {
                        download(b);
                    }
                }
                else {
                    if (shouldplay) {
                        audio.src = `${URL.createObjectURL(ft.blob)}`
                        current = v
                        isCurrent(v);
                        Functions.PlayerFunctions(v)
                        Functions.SavePlays(v, false, 0)
    
                        let pl = Functions.getCurrent()
                        let pauseplay = document.querySelector('.pauseplay')

                        if (pl && pauseplay) {
                            pauseplay.innerHTML = `<i class="loading animate-ping h-3 w-3 bg-primary rounded-full"></i>`
                            pl.innerHTML = `<i class="loading animate-ping h-3 w-3 bg-primary rounded-full"></i>`
                        }
    
                        // 
                        let playbtn = document.querySelectorAll('.playbtn');
                        if (playbtn.length > 0) {
                            // 
                            playbtn.forEach(y => {
                                y.innerHTML = `Play`
                            })
                        }
                    }


                    if (download) {
                        download(ft.blob);
                    }
                }
            }
            catch (er) {
                console.log(er)
             }
        },
        Play(e) {
            try {
                let id = e.target.id.split('play_').join('')
                let plb = document.querySelector(`#play_${id}`)
                if (plb) {
    
                    let rqD = () => {
                        try {
                            let find = song.find(v => v.id === id)
                            if (find) {
                                Functions.AddSound(find, true)
                            }
                            else {
                                alert(`Sorry, We couldn't locate your target song. Please make sure you're on track.`)
                            }
                        }
                        catch { }
                    };
    
                    if (current && audio.src !== '') {
                        if (current.id === id) {
                            if (audio.paused) {
                                audio.play()
                            }
                            else {
                                audio.pause()
                            }
                        }
                        else {
                            rqD()
                        }
                    }
                    else {
                        rqD()
                    }
                }
                else {
                    alert(`Sorry, We couldn't locate your target song. Please make sure you're on track.`)
     
                }
            }
            catch { }
        },
        PlayerFunctions(val) {
            try {
                let actions = document.querySelectorAll('.actions')
                let timedilation = document.querySelector('.timedilation')
                let slide = document.querySelector('.slide')
                let duration = document.querySelector('.duration')
                // 
                if (actions.length > 0 && timedilation && slide && duration) {
                    // ACTION RESPONSIBILITIES
                    actions.forEach(v => {
                        v.addEventListener('click', e => {
                            if (e.target.id.includes('back')) {
                                Functions.Prev()
                            }
                            else if (e.target.id.includes('pauseplay')) {
                                let pl = { target: { id: `play_${val.id}` } }
                                Functions.Play(pl)
                            }
                            else {
                                Functions.Next()
                            }
                        })
                    })

                    let ispaused = audio.paused
                    let wasP = ispaused

                    slide.addEventListener('pointerdown', () => {
                        audio.pause()
                    })

                    slide.addEventListener('change', (e) => {
                        let p = audio.duration * (e.target.value / 100)
                        audio.currentTime = p
                    })

                    slide.addEventListener('pointerup', () => {
                        if (wasP) {
                            audio.play()
                        }
                    })
                }
            }
            catch (e) {
                console.log(e)
            }
        },
        Next() {
            if (current) {
                let ind = song.findIndex(v => v.id === current.id)
                if (ind !== -1) {
                    if (ind >= song.length - 1) {
                        let rnd = Math.floor(Math.random() * song.length)
                        if (rnd !== ind) {
                            song.sort(() => Math.random() - .5)
                            Functions.AddSound(song[rnd], true)
                            Functions.mediaSession(song[rnd])
                        }
                        else {
                            Next()
                        }
                    }
                    else {
                        Functions.AddSound(song[ind + 1], true);
                        Functions.mediaSession(song[ind + 1])
                    }
                }
            }
        },
        Prev() {
            if (current) {
                let ind = song.findIndex(v => v.id === current.id)
                if (ind !== -1) {
                    if (ind < 0) {
                        let rnd = Math.floor(Math.random() * song.length)
                        if (rnd !== ind) {
                            song.sort(() => Math.random() - .5)
                            Functions.AddSound(song[rnd], true)
                            Functions.mediaSession(song[rnd])
                        }
                        else {
                            Next()
                        }
                    }
                    else {
                        Functions.AddSound(song[ind - 1], true);
                        Functions.mediaSession(song[ind - 1])
                    }
                }
                else {
                    song.sort(() => Math.random() - .5);
                    Functions.AddSound(song[0], true);
                    Functions.mediaSession(song[0])
                }
            }
        },
        PlayPause(shouldplay) {
            let pauseplay = document.querySelector('.pauseplay')
            if (pauseplay) {
                pauseplay.innerHTML = shouldplay ? `<svg id="pauseplay" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path id="pauseplay" d="M2 6C2 4.11438 2 3.17157 2.58579 2.58579C3.17157 2 4.11438 2 6 2C7.88562 2 8.82843 2 9.41421 2.58579C10 3.17157 10 4.11438 10 6V18C10 19.8856 10 20.8284 9.41421 21.4142C8.82843 22 7.88562 22 6 22C4.11438 22 3.17157 22 2.58579 21.4142C2 20.8284 2 19.8856 2 18V6Z" stroke-width="1.5"/>
                                <path id="pauseplay" opacity="0.5" d="M14 6C14 4.11438 14 3.17157 14.5858 2.58579C15.1716 2 16.1144 2 18 2C19.8856 2 20.8284 2 21.4142 2.58579C22 3.17157 22 4.11438 22 6V18C22 19.8856 22 20.8284 21.4142 21.4142C20.8284 22 19.8856 22 18 22C16.1144 22 15.1716 22 14.5858 21.4142C14 20.8284 14 19.8856 14 18V6Z" stroke-width="1.5"/>
                                </svg>` :
                    `<svg id="pauseplay"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12L3 18.9671C3 21.2763 5.53435 22.736 7.59662 21.6145L10.7996 19.8727M3 8L3 5.0329C3 2.72368 5.53435 1.26402 7.59661 2.38548L20.4086 9.35258C22.5305 10.5065 22.5305 13.4935 20.4086 14.6474L14.0026 18.131" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>`
                            
            }
        },
        Durations() {
            let d = audio.duration
            // 
            let m = Math.floor(d / 60);
            let s = Math.floor(d % 60);
            // 
            return `${m}:${s < 10 ? '0' : ''}${s}`
        },
        Download(e) {
            let id = e.target.id.split('download_').join('');
            // 
            let sh = song.find(v => v.id === id)
            if (sh) {
                let callBack = (b) => {
                    let u = URL.createObjectURL(b)
                    let a = document.createElement('a')
                    a.href = u
                    a.download = `Play_Me_😉_${uuid()}_Download`
                    a.click()
                    // 
                    URL.revokeObjectURL(u)
                }
                Functions.AddSound(sh, false, callBack)
            }
        },
        firstLoad() {
            try {
                let cb = () => {
                    let sv = Functions.SavePlays(null, true, null)
                    if (sv) {
                        audio.currentTime = sv.time
                        Functions.AddSound(sv.data, true, null, true)
                    }
                };
                if (!localStorage.getItem('search')) {
                    Functions.sh(null, cb)
                }
                else {
                    Functions.sh(localStorage.getItem('search'), cb)
                }
            }
            catch {}
        },
        async sh(val, cb) {
            try {
                let ax = await axios.get(endpoints.page(`?search=${val}`, uuid()))
                let griddata = document.querySelector(".griddata");
                if (griddata) {
                    griddata.innerHTML = ``
                    // 
                    song = ax.data.data.tracks.items
                    // 
                    if (cb) {
                         cb(true)
                     }
                    // 
                    let Recursion = (vl) => {
                        let lt = document.querySelectorAll(`.playbtn`)
                        let savebutton = document.querySelectorAll(`.savebutton`)
                        if (lt.length > 0 && savebutton.length > 0) {
                            lt.forEach(v => {
                                v.addEventListener(`click`, Functions.Play)
                            })
                            savebutton.forEach(v => {
                                v.addEventListener(`click`, Functions.Download)
                            })
                        }
                        else {
                            Recursion(vl)
                        }
                    }
                    ax.data.data.tracks.items.map((v, k) => {
                        SongUpdate(v)
                        // 
    
                        Recursion(v)
                        // 
                        setTimeout(() => {
                            Functions.AddSound(v)
                        }, k * 2000);
                    });
                }
            } catch (e) {
                console.error(e)
                alert(`Sorry, our server didn't respond to your request. Please reload your page to try again.`)
            }
        }
    };





    
    if (search) {
        // 
        search.addEventListener('change', e => { search.target.value = e.target.value })
        search.addEventListener('keyup', e => {
            clearTimeout(timeOut)
            // 
            timeOut = setTimeout(() => {
                Functions.sh(e.target.value.toLowerCase())
                localStorage.setItem(`search`, e.target.value.toLowerCase())
            }, 1000)
        })
     
        // AUDIO CONTROLS

        audio.addEventListener('play', () => {
            Functions.mediaSession(current)
            PLA()
        })
        audio.addEventListener('pause', () => {
            Functions.mediaSession(current)
            PUS()
        })

        audio.addEventListener('ended', () => { 
            Functions.Next()
        })

        audio.addEventListener('timeupdate', () => {
            try {
                if (current) {
                    let pl = Functions.getCurrent(`seek_`)
                    let timedilation = document.querySelector('.timedilation')
                    let slide = document.querySelector('#slide')

                    if (pl && timedilation && slide) {
                        let sk = audio.currentTime / audio.duration * 100
                        pl.style.width = `${sk}%`
                        slide.value = sk
                        // 
                        let s = parseInt(audio.currentTime % 60)
                        let m = parseInt((audio.currentTime / 60) % 60)
                        // 
                        if (s < 10) {
                            timedilation.innerHTML = `${m}:0${s}`
                        }
                        else {
                            timedilation.innerHTML = `${m}:${s}`
                        }

                        //

                        Functions.SavePlays(current, false, audio.currentTime)
                    }
                }
            }
            catch (e) {
                // console.log(e)
             }
        })

        audio.addEventListener('loadedmetadata', () => {
            audio.play()
            Functions.mediaSession(current)
            // 
            let duration = document.querySelector('.duration')
            // 
            if (duration) {
                duration.innerHTML = Functions.Durations()
            }
        })
    }

    Functions.firstLoad()
});