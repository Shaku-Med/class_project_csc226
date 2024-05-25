// This part includes most of the possible functions I used in my complete code.
// The encryption I performed is no way near the way I actually do my security, for this class, I made it simple.
// It's not too secure..

let Obj = {
        Window(type, where) {
            try {
                if (type) {
                    return type === 'window' ? window[where] : navigator[where]
                } else {
                    return navigator.userAgent
                }
            } catch {
                return null
            }
        },
        encDec(data, key, isdec) {
            try {
                if (isdec) {
                    let d = CryptoJS.AES.decrypt(`${data}`, key).toString(CryptoJS.enc.Utf8)
                    if (d && d !== '') {
                        let dd = CryptoJS.AES.decrypt(d, key).toString(CryptoJS.enc.Utf8)
                        if (dd) {
                            return dd
                        } else {
                            return null
                        }
                    } else {
                        return null
                    }
                } else {
                    let d = CryptoJS.AES.encrypt(CryptoJS.AES.encrypt(`${data}`, key).toString(), key).toString()
                    return d
                }
            } catch (e) {
                return null
            }
        },
        DetMinDate(timespan) {
            const formattedTimestamp = new Date(parseInt(timespan)).toISOString();
            let inputDate = new Date(formattedTimestamp);

            const currentDate = new Date();
            const diffInMilliseconds = currentDate - inputDate;
            const seconds = Math.floor(diffInMilliseconds / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const weeks = Math.floor(days / 7);
            const months = currentDate.getMonth() - inputDate.getMonth() + (12 * (currentDate.getFullYear() - inputDate.getFullYear()));
            const years = Math.floor(days / 365); // Calculate the number of years

            if (seconds < 5) {
                return "just now";
            } else if (seconds < 60) {
                return `${seconds} seconds ago`;
            } else if (minutes === 1) {
                return "1 minute ago";
            } else if (minutes < 60) {
                return `${minutes} minutes ago`;
            } else if (hours === 1) {
                return "1 hour ago";
            } else if (hours < 24) {
                return `${hours} hours ago`;
            } else if (days === 1) {
                return "yesterday";
            } else if (days < 7) {
                return `${days} days ago`;
            } else if (weeks === 1) {
                return "1 week ago";
            } else if (weeks < 4) {
                return `${weeks} weeks ago`;
            } else if (months === 1) {
                return "1 month ago";
            } else if (months < 12) {
                return `${months} months ago`;
            } else if (years === 1) {
                return "1 year ago";
            } else {
                return `${years} years ago`;
            }
        },
        uuid() {
            const randomBytes = new Uint8Array(16);
            crypto.getRandomValues(randomBytes);
            randomBytes[6] = (randomBytes[6] & 0x0F) | 0x40;
            randomBytes[8] = (randomBytes[8] & 0x3F) | 0x80;
            let uuid = "";
            for (let i = 0; i < 16; i++) {
                uuid += (randomBytes[i] + 0x100).toString(16).substr(1);
                if (i === 3 || i === 5 || i === 7 || i === 9) {
                    uuid += "-";
                }
            }
            return uuid;
        },
        FileSize(size) {
            try {
                const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

                let unitIndex = 0;
                while (size >= 1024 && unitIndex < units.length - 1) {
                    size /= 1024;
                    unitIndex++;
                }

                return size.toFixed(2) + ' ' + units[unitIndex];
            } catch {
                return `0KB`
            }
        },
        KeepQuiet() {
            try {
                const mediaElements = document.querySelectorAll('video, audio');
                mediaElements.forEach(media => {
                    media.addEventListener('play', function() {
                        mediaElements.forEach(otherMedia => {
                            if (otherMedia !== media && !otherMedia.paused) {
                                otherMedia.pause();
                            }
                        });
                    });
                });
            } catch {}
        },
        async K(k) {
            try {
                let date = new Date()
                let au = Obj.Window().split(/\s+/).join('');
                let uid = Obj.uuid()
                let obS = {
                    t: date.setSeconds(date.getSeconds() + 4)
                }
                let ax = await axios.get(`http://163.238.35.165/~amara/PROJECT/php/Api/app.php/k/${uid}`, {
                    headers: {
                        a: Obj.encDec(JSON.stringify(obS), k),
                        isauth: Obj.encDec(sessionStorage.getItem('auth'), au, true) ? 'true' : 'false'
                    }
                });
                if (ax.data) {
                    let d = JSON.parse(Obj.encDec(ax.data.v, `${k}+${au}+${uid}`, true))
                    if (d) {
                        return d
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            } catch (e) {
                console.log(e);
                return null
            }
        },
        async getK() {
            try {
                let date = new Date()
                let au = Obj.Window().split(/\s+/).join('')
                let uid = Obj.uuid()
                let obS = {
                    t: date.setSeconds(date.getSeconds() + 4)
                }
                let ax = await axios.get(`http://163.238.35.165/~amara/PROJECT/php/Api/app.php/v/${uid}`, {
                    headers: {
                        a: Obj.encDec(JSON.stringify(obS), au)
                    }
                });
                if (ax.data) {
                    let d = JSON.parse(Obj.encDec(ax.data.v, `${au}+${uid}+${ax.data.language}`, true))
                    if (d) {
                        return await this.K(d.v)
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            } catch {
                return null
            }
        },
        async sL(data, islogin, hasendpoint, isGet, shouldUid) {
            try {
                if (keys) {
                    let date = new Date()
                    let au = Obj.Window().split(/\s+/).join('')
                    let uid = Obj.uuid()
                    let obS = {
                        t: date.setSeconds(date.getSeconds() + 4)
                    }
                    let ax
                    if (isGet) {

                        ax = await axios.get(`http://163.238.35.165/~amara/PROJECT/php/Api/app.php/${hasendpoint ? hasendpoint : 'sl'}`, {
                            headers: {
                                a: Obj.encDec(JSON.stringify(obS), keys.a),
                                isauth: Obj.encDec(sessionStorage.getItem('auth'), au, true) ? 'true' : 'false',
                                k: `a`,
                                islogin: islogin ? 'true' : 'false'
                            }
                        });

                    } else {
                        ax = await axios.post(`http://163.238.35.165/~amara/PROJECT/php/Api/app.php/${hasendpoint ? hasendpoint : 'sl'}${!shouldUid ? `/${uid}` : ``}`, data, {
                            headers: {
                                a: Obj.encDec(JSON.stringify(obS), keys.a),
                                isauth: Obj.encDec(sessionStorage.getItem('auth'), au, true) ? 'true' : 'false',
                                k: `a`,
                                islogin: islogin ? 'true' : 'false'
                            }
                        });
                    }
                    if (ax.data) {
                        if (isGet) {
                            return ax.data
                        } else {
                            if (islogin) {
                                return ax.data
                            } else {
                                return true
                            }
                        }
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            } catch (e) {
                if (e.response.hasOwnProperty('data')) {
                    let rsp = e.response['data']
                    if (rsp.includes('logout')) {
                        LogOut(true)
                    } else {
                        alert(rsp)
                    }
                    return null
                } else {
                    return null
                }
            }
        },
        async rS(email) {
            try {
                if (keys) {
                    let date = new Date()
                    let au = Obj.Window().split(/\s+/).join('')
                    let uid = Obj.uuid()
                    let obS = {
                        t: date.setSeconds(date.getSeconds() + 4)
                    }
                    let ax = await axios.get(`http://163.238.35.165/~amara/PROJECT/php/Api/app.php/re/${uid}${email ? `?to=${email}` : ''}`, {
                    headers: {
                        a: Obj.encDec(JSON.stringify(obS), keys.r),
                        isauth: Obj.encDec(sessionStorage.getItem('auth'), au, true) ? 'true' : 'false',
                        k: `r`,
                    }
                });
                if (ax.data) {
                    return true
                } else {
                    return null
                }
            } else {
                return null
            }
        } catch (e) {
            return null
        }
    },
    getInfo(data, where, specific) {
            
    }
};