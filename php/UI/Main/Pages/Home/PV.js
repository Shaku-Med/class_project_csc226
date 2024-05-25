// 

let Input = ({ id, callback, def }) => {
    const [input, setinput] = useState(def ? def.trim().length > 0 ? def : '' : '');
    // 
    useEffect(() => {
        setinput(def ? def : '')
    }, [def])
    return (
        <>
            <textarea value={input} onChange={e => {
                callback(e.target.value, id)
                setinput(e.target.value)
            }} placeholder={`What's on your mind?`} className={` p-2 w-full brd h-fit`}></textarea>
        </>
    )
};

let Post = () => {
    const pht = useRef();
    const [file, setfile] = useState([]);
    const [input, setinput] = useState('');
    const [privacy, setprivacy] = useState('public');
    const [allowrp, setallowrp] = useState(true);
    const [allowcm, setallowcm] = useState(true);
    // 
    const [rl, setrl] = useState(0);
    const [sb, setsb] = useState(null);
    // 
    let rg = /^(video|image)\/[a-zA-Z0-9]+$/
    // 

    let callback = (value, id) => {
        if (id) {
            let nf = file
            let f = nf.find((v) => v.id === id);
            if (f) {
                f.text = value
                setfile(nf)
                setrl(Obj.uuid())
            }
        }
        else {
            setinput(value)
        }
    }

    let getFL = (fl) => {
        return new Promise((resolve, reject) => {
            try {
                let reader = new FileReader();
                reader.onload = () => {
                    let b = new Uint8Array(reader.result);
                    // const chunkSize = 1 * 1024 * 1024;
                    const chunkSize = 50 * 1024;
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

    let handleFile = async (files) => {
        try {
            if (pht.current) {
                if (files.length > 0) {
                    let newFiles = [];
                    for (let i = 0; i < files.length; i++) {
                        if (rg.test(files[i].type)) {
                            let obj = {
                                file: await getFL(files[i]),
                                preview: URL.createObjectURL(files[i]),
                                size: Obj.FileSize(files[i].size),
                                type: files[i].type,
                                name: files[i].name,
                                id: Obj.uuid(),
                                text: ''
                            };
                            newFiles.unshift(obj);
                        } else {
                            showToast(`File (${files[i].name}) was ignored upload because file type (${files[i].type}) was invalid. Valid Files (IMAGE & VIDEOS).`);
                        }
                    }
                    setfile((prevFiles) => [...newFiles, ...prevFiles]);
                    pht.current.value = '';

                } else {
                    pht.current.value = '';
                }
            }
        } catch (e) {
            showToast('Unable to load files.');
            pht.current.value = '';
        }
    };

    let handleRemove = (id) => {
        try {
            let nf = file
            let f = nf.findIndex((f) => f.id === id);
            if (f !== -1) {
                nf.splice(f, 1)
                setfile(nf)
                setrl(Obj.uuid())
            }
        }
        catch { }
    }

    let handleSubmit = async () => {
        try {
            if (owner) {
                let postcontainer = {
                    text: {
                        text: input,
                        length: input.trim().length
                    },
                    allowcm,
                    allowrp,
                    privacy,
                    post_thread: file.length > 0 ? file.flatMap(v => v.id) : [],
                    owner_id: owner[0].user_id,
                    post_time: new Date().getTime(),
                    is_main_post: 'true',
                    post_type: 'text',
                    post_id: Obj.uuid(),
                    islast: file.length > 0 ? null : true,
                    action_type: null
                }

                let jo = {
                    data: Obj.encDec(JSON.stringify(postcontainer), keys.p),
                    k: 'p'
                }
                // 
                setsb(true);
                // 
                let dt = await Obj.sL(jo, null, `post`);
                if (dt) {
                    if (file.length > 0) {
                        let subFile = (index, fl) => {
                            try {
                                let v = file[index];
                                let nv = Object.assign({}, v)
                                // 
                                let ph = []
                                let uid = Obj.uuid()
                                let dtu = new Date().toDateString().split(/\s+/).join('_')
                                let sendChops = async (ob) => {
                                    try {
                                        if (ob <= nv.file.length - 1) {
                                            let fld = nv.file[ob]
                                            let bl = new Blob([JSON.stringify(fld)], { type: 'text/plain' })
                                            // 
                                            let formdata = new FormData()
                                            formdata.append('file', bl)
                                            formdata.append('user_id', owner[0].user_id)
                                            formdata.append('uid', uid)
                                            formdata.append('index', ob)
                                            formdata.append('date', dtu)
                                            // 
                                            let ax = await axios.post(`http://163.238.35.165/~amara/PROJECT/php/Upload/Upload.php`, formdata)
                                            if (ax.data) {
                                                // Changed my mind.
                                                // let fobj = { path: ax.data.file_path }
                                                // ph.push(fobj);
                                                // 
                                                sendChops(ob + 1)
                                            }
                                        }
                                        else {
                                            // if (ph.length > 0) {
                                            subFile(index + 1, fl);
                                            // 
                                            nv.len = nv.file.length
                                            nv.file = `${dtu}/${uid}`
                                            
                                            // 
                                            postcontainer.post_thread = []
                                            postcontainer.post_type = nv.type
                                            postcontainer.is_main_post = postcontainer.post_id
                                            // 
                                            postcontainer.post_id = nv.id
                                            postcontainer.post_time = new Date().getTime()
                                            postcontainer.text = nv
                                            postcontainer.action_type = null
                                            
                                            // 
                                            let jj = {
                                                data: Obj.encDec(JSON.stringify(postcontainer), keys.p),
                                                k: 'p'
                                            };
                                            await Obj.sL(jj, null, `post`);
                                            // }
                                            // else {
                                            //     showToast(`Upload Failed`)
                                            // }
                                        }
                                    }
                                    catch {
                                        sendChops(ob)
                                        showToast(`Upload Failed, Re - Uploading...`)
                                    }
                                }
                                // 
                                if (index <= file.length - 1) {
                                    if (v.file.length > 0) {
                                        sendChops(0)
                                    }
                                }
                                else {
                                    showToast("Your post has been saved completely.", "success")
                                    // 
                                    setfile([])
                                    setinput('')
                                    setprivacy('public')
                                    setallowcm(true)
                                    setallowrp(true)
                                }
                            }
                            catch {
                                subFile(index, fl)
                            }
                        };
                        subFile(0, file)
                    }
                    else {
                        showToast(`Your Post has been added successfully.`, `success`)
                        // 
                        setinput('')
                        setprivacy('public')
                        setallowcm(true)
                        setallowrp(true)

                        setsb(true)

                        window.location.reload()
                    }
                }
                else {
                    showToast('Request Failed. Please try again.');
                }
            }
        }
        catch {
            showToast('Request Failed. Please try again.');
        }
    };

    return (
        <>

            {
                owner ?
                    (owner || []).map((val, key) => {
                        return (
                            <div key={key} className="modal-dialog w-full max-w-[400px] z-[1000000000]">
                                <div className="modal-content relative z-[10000000000000] bg-[var(--border)]">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Post</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body reactBody">

                                        <div className="ontentUp">
                                            <div className="userprofiles flex items-start justify-start gap-2 w-full p-2">
                                                <div className="usImage h-10 w-10 min-w-10 max-h-10 overflow-hidden rounded-full">
                                                    <Picture val={val} profilepic={val.info[0].profilepic} />
                                                </div>
                                                <div className="userNamehere">
                                                    <div className="uaname hover:underline w-fit cursor-pointer line-clamp-1">
                                                        {val.name}
                                                    </div>
                                                    <div className="selecctionss mt-1">
                                                        <select value={privacy} onChange={e => setprivacy(e.target.value)} className="p-1 rounded-md">
                                                            <option value="private">Private</option>
                                                            <option value="public">Every One</option>
                                                        </select>
                                                        <div className="checkoptions">
                                                            {/* <div className="form-check">
                                                                <input onChange={e => setallowrp(allowrp ? false : true)} className="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked={allowrp} />
                                                                <label className="form-check-label" for="flexCheckDefault">
                                                                    Allow Repost
                                                                </label>
                                                            </div> */}
                                                            <div className="form-check">
                                                                <input onChange={e => setallowcm(allowcm ? false : true)} className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked={allowcm} />
                                                                <label className="form-check-label" for="flexCheckChecked">
                                                                    Allow Comments
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <Input callback={callback} />

                                            <div className="contentContainer">
                                                <input ref={pht} onChange={e => handleFile(e.target.files)} type="file" accept="image/*,video/*" className=" hidden " multiple id="selectFiles" />
                                                <label onDragOver={e => e.preventDefault()} onDrop={e => {
                                                    e.preventDefault()
                                                    // 
                                                    handleFile(e.dataTransfer.files)
                                                }} htmlFor="selectFiles" className="chooseOrdrag mb-2 cursor-pointer text-center flex items-center flex-col rounded-lg shadow-md justify-center w-full p-2 h-[150px] brd bg-[var(--basebg)]">
                                                    <i className="bi bi-file-earmark-plus text-4xl" />
                                                    <span className=" text-2xl">Add Photos/Videos</span>
                                                    <div className="dragDrop text-xs opacity-[.6]">Or drag and drop</div>
                                                </label>
                                                {
                                                    file.length > 0 ?
                                                        <>
                                                            <div className="fileSeleted bg-success text-white mb-1 p-1 text-lg w-fit brd rounded-lg">({file.length}) {file.length > 1 ? 'Files' : 'File'} selected</div>

                                                            <div className="gridSpott gridImagepost">
                                                                {
                                                                    (file || []).map((v, k) => {
                                                                        return (
                                                                            <>
                                                                                <div key={k} className={`contentPreview vid_${k} relative overflow-hidden shadow-lg rounded-lg brd`}>
                                                                                    <i onClick={e => handleRemove(v.id)} className="bi bi-x-lg h-5 w-5 flex items-center justify-center rounded-full bg-danger cursor-pointer z-[10000000] absolute top-[10px] right-[10px]" />
                                                                                    <div className={`contentBody bg-[var(--mainBg)] brd h-full w-full relative overflow-hidden min-h-[200px] max-h-[200px]`}>
                                                                                        {
                                                                                            v.type.includes('image') ?

                                                                                                <>
                                                                                                    <Img className=" h-full w-full object-contain absolute top-0 left-0" loading="lazy" src={v.preview} />
                                                                                                </>
                                                                                                :
                                                                                                <>
                                                                                                    <video onPlay={e => {
                                                                                                        let vid = document.querySelector(`.vid_${k}`)
                                                                                                        if (vid) {
                                                                                                            vid.classList.add('stick')
                                                                                                        }
                                                                                                    }} onPause={e => {
                                                                                                        let vid = document.querySelector(`.vid_${k}`)
                                                                                                        if (vid) {
                                                                                                            vid.classList.remove('stick')
                                                                                                        }
                                                                                                    }} className=" h-full w-full object-contain absolute top-0 left-0" controls playsInline src={v.preview} />
                                                                                                </>
                                                                                        }
                                                                                    </div>
                                                                                    <div className="inputContainer">
                                                                                        <Input def={v.text} callback={callback} id={v.id} />
                                                                                    </div>
                                                                                    <div className="contentSize text-sm opacity-[.7] flex items-center justify-between gap-2 p-1">
                                                                                        <span className="line-clamp-1">{v.name}</span>
                                                                                        <span className="line-clamp-1 min-w-fit">{v.size}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </> :
                                                        <>
                                                        </>
                                                }
                                            </div>

                                        </div>
                                        <div className="bottomontent p-2 w-full">
                                            <div onClick={sb ? e => { } : file.length > 0 || input.trim().length > 1 ? handleSubmit : e => { }} className={`bTNS flex items-center justify-center text-center p-2 brd rounded-lg ${file.length > 0 || input.trim().length > 1 ? 'cursor-pointer bg-success text-white shadow-lg active:scale-[.97]' : 'dis bg-[var(--basebg)]'}`}>
                                                {!sb ? `Post` : `Posting Please wait...`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dimbg bg-[var(--basebg)] fixed top-0 left-0 w-full h-full z-[10000]"></div>
                            </div>
                        )
                    }) : ''
            }

        </>
    )
};