let Nav = ({ isextrnal }) => {
    const { users, setusers, external, setexternal } = useContext(Connect);
    const [o, seto] = useState([])
    const [imgprev, setimgprev] = useState(null)
    
    let Recursion = () => {
        let sidenavpath = document.querySelector('.sidenavpath')
        let viewpaths = document.querySelector('.viewpaths')
        let closeShow = document.querySelector('.closeShow')
        let opennav = document.querySelector('.opennav')
        // 
        if (sidenavpath && viewpaths && closeShow && opennav) {
            closeShow.addEventListener('click', (e) => {
                sidenavpath.classList.remove('act')
                viewpaths.classList.remove('act')
            })

            opennav.addEventListener('click', (e) => {
                sidenavpath.classList.add('act')
                viewpaths.classList.add('act')
            })
            // 
        } else {
            setTimeout(Recursion, 1000)
        }
    }
    useLayoutEffect(() => {
        try {
            console.log(isextrnal)
            seto(isextrnal ? isextrnal : owner)
            setTimeout(Recursion, 1000)
        }
        catch {
            seto([])
        }
    }, [owner, isextrnal])

    //


    
    let getFL = (fl) => {
        return new Promise((resolve, reject) => {
            try {
                let reader = new FileReader();
                reader.onload = () => {
                    let b = new Uint8Array(reader.result);
                    const chunkSize = 1 * 1024 * 1024;
                    // const chunkSize = 80 * 1024;
                    const chunks = [];

                    for (let offset = 0; offset < b.byteLength; offset += chunkSize) {
                        chunks.push(b.slice(offset, offset + chunkSize));
                    }

                    if (chunks.length > 0) {
                        resolve(chunks);
                    } else {
                        showToast(`File chop failed.`);
                        resolve(null);
                    }
                };
                reader.onerror = () => {
                    reject(new Error("Failed to read the file."));
                };
                reader.readAsArrayBuffer(fl);
            } catch (error) {
                reject(error);
            }
        });
    };
    
    let SelectFile = async (e) => {
        try {
            let files = e.target.files[0];
            if (files) {
                let reg = /^(image)\/[a-zA-Z0-9]+$/;
                if (reg.test(files.type)) {
                    let lgfile = await getFL(files);
                    if (lgfile) {

                        let flS = [{
                            file: lgfile,
                            type: files.type,
                        }];

                        let subFile = (index, fl) => {
                            try {
                                let v = fl[index];
                                let nv = Object.assign({}, v);
                                let ph = [];
                                let uid = Obj.uuid();
                                let dtu = new Date().toDateString().split(/\s+/).join('_');

                                let sendChops = async (ob) => {
                                    try {
                                        if (ob <= nv.file.length - 1) {
                                            let fld = nv.file[ob];
                                            let bl = new Blob([JSON.stringify(fld)], { type: 'text/plain' });

                                            let formdata = new FormData();
                                            formdata.append('file', bl);
                                            formdata.append('user_id', owner[0].user_id);
                                            formdata.append('uid', uid);
                                            formdata.append('index', ob);
                                            formdata.append('date', dtu);

                                            let ax = await axios.post(`http://163.238.35.165/~amara/PROJECT/php/Upload/Upload.php`, formdata);
                                            if (ax.data) {
                                                sendChops(ob + 1);
                                            }
                                        } else {
                                            subFile(index + 1, fl);
                                            // 
                                            nv.len = nv.file.length
                                            nv.file = `${dtu}/${uid}`;
                                            nv.time = new Date().getTime()
                                            // 
                                            owner[0].info[0].profilepic.push(nv)
                                            // 
                                            let reqObj = {
                                                owner_id: owner[0].user_id,
                                                user_id: owner[0].user_id,
                                                update: JSON.stringify(owner[0].info),
                                                hidden_id: owner[0].hidden_id,
                                                cookie_id: owner[0].cookie_id,
                                                is_verified: owner[0].is_verified,
                                                where: 'info'
                                            }
                                        
                                            let jj = {
                                                data: Obj.encDec(JSON.stringify(reqObj), keys.p),
                                                k: 'p'
                                            };
                                            await Obj.sL(jj, null, `user_update`);
                                        }
                                    } catch (error) {
                                        console.error(error);
                                        sendChops(ob);
                                        showToast(`Upload Failed, Re - Uploading...`);
                                    }
                                };

                                if (index <= fl.length - 1) {
                                    if (v.file.length > 0) {
                                        sendChops(0);
                                    }
                                } else {
                                    showToast("Profile change complete.", "success");
                                }
                            } catch (error) {
                                console.error(error);
                                subFile(index, fl);
                            }
                        };

                        subFile(0, flS);
                    }
                } else {
                    showToast(`Invalid File. Please upload an image file of any type.`);
                }
            }
        } catch (error) {
            console.error(error);
            showToast(`An error occurred while selecting the file.`);
        }
    };

    return (
        <>

            {
                (o || []).map((v, k) => {
                    return (

                        <div
                            key={k}
                            className={`${isextrnal ? ` w-full h-full` : `sidenavpath max-[800px]:z-[1000000000000] z-[100000000000] flex items-start justify-start flex-col h-full br max-w-[300px] min-w-[300px] w-full bg-[var(--mainBg)] shadow-lg`}`}>
                            
                            {
                                imgprev ?
                                    <Prev v={v} setimgprev={setimgprev} /> : ``
                            }

                            <div
                                onClick={isextrnal ? e => setexternal(null) : e => {}}
                                className={`${isextrnal ? ' flex' : 'closeShow hidden max-[800px]:flex ' }  text-center p-1  items-center justify-center text-danger w-full brd cursor-pointer hover:bg-[var(--basebg)]`}>
                                Close
                            </div>
                            <div className=" overflow-x-hidden overflow-y-auto h-full w-full">
                                <div className="userProfileS pt-5 pb-2 pl-2 pr-2 flex flex-col items-center justify-center text-center gap-2">
                                    <div className="ccontlog relative">
                                        <div onClick={v.info[0].profilepic.length > 0 ? e => setimgprev(true) : e => { }} className={`userPP ${v.info[0].profilepic.length > 0 ? `cursor-pointer hover:opacity-[.7]` : ''} relative h-[8rem] w-[8rem] min-w-[8rem] min-h-[8rem] overflow-hidden rounded-full`}>
                                            <Picture val={v} profilepic={v.info[0].profilepic} />
                                        </div>
                                        {
                                            isextrnal ? '' : 
                                                <label htmlFor="profilepic" className="imageAdd absolute bottom-[8px] right-[-6px] z-[10000]">
                                            <input onChange={SelectFile} className={`hidden pointer-events-none refinput`} type="file" accept="image/*" id="profilepic" />
                                            <i className="bi bi-camera brd bg-[var(--basebg)] h-10 w-10 rounded-full overflow-hidden flex items-center justify-center text-xl cursor-pointer" />
                                        </label>
                                        }
                                    </div>
                                    <div title={v.name} className="profileName cursor-pointer hover:underline text-xl line-clamp-3">
                                        {v.name}
                                    </div>
                                    <div title={v.email} className="prof_email">{v.email}</div>
                                </div>
                                {
                                    isextrnal ? '' :
                                        <>
                                            <hr />
                                            <div className="contactND uppercase font-bold text-center p-2 opacity-[.5]">
                                                Your contacts
                                            </div>
                                            {
                                                users.length > 0 ?
                                                    (users.filter(a => v.contacts.some(b => b.id === a.user_id)) || []).map((val, key) => {
                                                        return (
                                                            <div key={key} className="userpath mt-2 bg-[var(--basebg)] pl-4 pr-4 pt-2 pb-2 flex items-center justify-start gap-2">
                                                                <div className="userPP h-10 w-10 min-w-10 min-h-10 overflow-hidden rounded-full">
                                                                    <Picture val={val} profilepic={val.info[0].profilepic} />
                                                                </div>
                                                                <div className="usernamePath">
                                                                    <div className="nameUser line-clamp-1 text-[.90rem] opacity-[.8]">
                                                                        {val.name}
                                                                    </div>
                                                                    {
                                                                        val.hasOwnProperty('chats') ?
                                                                            <div className="recentMessage line-clamp-2 text-[.60rem] opacity-[.5]">
                                                                            </div> : ''
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    }) : ''
                                            }
                                        </>
                                }
                            </div>
                        </div>
                    )
                })
            }
        </>
    );
};