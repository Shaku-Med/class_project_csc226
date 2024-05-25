let Cf = ({val, reply, setreply}) => {
    const { is_chat, setis_chat, users, handleSubmit, input, setinput, subs, setsubs, files } = useContext(Connect)

    return (
        <div className="putcontainer p-3 w-full flex items-center justify-center flex-col gap-1">
            {
                reply ? 
                    <div onClick={e => {
                        setreply(null)
                        setinput('')
                    }} className="aindlsinea bg-[var(--basebg)] w-full brd p-1 cursor-pointer text-center capitalize line-clamp-1">
                {reply.type} set, Do your editing here.
            </div> : ''
            }
            <div className="chatFooterS flex bg-[var(--border)] p-2 w-full items-center justify-between gap-2 rounded-lg overflow-hidden">
                <textarea autoFocus={reply ? true : true} onKeyDown={e => {
                    if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
                        e.preventDefault()
                        handleSubmit(val, reply)
                    }
                }} placeholder={`Type a message`} onChange={e => setinput(e.target.value)} value={input} className={`markDownEditor ${input.trim().length > 0 ? '' : ''} p-2 h-full w-full outline-none min-h-[50px] max-h-[100px] overflow-auto`} />
                <i onClick={!subs ? e => handleSubmit(val, reply) : e => {}} className={`bi bi-send h-10 w-10 min-w-10 min-h-10 flex items-center justify-center text-lg bg-primary rounded-full cursor-pointer ${input.trim().length > 0 || files.length > 0 ? '' : 'dis'} ${subs ? 'dis' : ''}`} />
            </div>
        </div>
    )
};


let ChatData = ({ val, vo, reply, setreply }) => {
    // 
    const { users, setusers, input, setinput } = useContext(Connect);
    const [chat, setchat] = useState([])

    let Fm = (time, type) => {
        let d = new Date(time);
        if (!type) {
            let today = new Date();
            if (d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
                return 'Today';
            } else if (d.getDate() === today.getDate() - 1 && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
                return 'Yesterday';
            } else {
                return d.toDateString();
            }
        } else {
            return d.toLocaleString();
        }
    };

    let arrangeData = (us) => {
        let usr = us
        let output = [];
        usr.forEach(user => {
            if (user.message_thread.length > 0) {
                let pt = [];
                let threadmessages = user.message_thread
                    .map(threadId => {
                        let threadmessage = usr.find(p => p.message_id === threadId);
                        if (threadmessage) {
                            pt.push(threadId);
                            // 
                            return threadmessage;
                        }
                        return null;
                    })
                    .filter(threadmessage => threadmessage !== null);

                let pushP = () => {
                    let postCopy = { ...user, thread_message: threadmessages };
                    output.push(postCopy);
                };

                if (pt.length > 0) {
                    if (!pt.includes(user.message_id)) {
                        pushP();
                    }
                } else {
                    pushP();
                }

            } else {
                let f = usr.find(v => JSON.stringify(v.message_thread).includes(user.message_id));
                if (!f) {
                    output.push(user);
                }
            }
        });

        output = output.filter((v, i, a) => a.findIndex(t => t.message_id === v.message_id) === i);

        return output;
    };

    useEffect(() => {

        if (val) {
            if (val.length > 0) {
                let arrange = arrangeData(val)
                // 
                if (arrange.length > 0) {
                    
                    let reA = [];
                    
                    let getFormattedDate = (timestamp) => {
                        const date = new Date(timestamp);
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const year = date.getFullYear();
                        return `${month}-${day}-${year}`;
                    };
                    
                    arrange.map(v => {
                        const formattedDate = getFormattedDate(parseInt(v.message_time));
                        const existingGroupIndex = reA.findIndex(group => group.date === formattedDate);
                        // 
                        if (existingGroupIndex !== -1) {
                            reA[existingGroupIndex].data.push(v);
                        } else {
                            reA.push({ date: formattedDate, data: [v], dt: parseInt(v.message_time) });
                        }
                    });

                    if (reA.length > 0) {
                        let srt = reA.sort((a, b) => new Date(b.dt) - new Date(a.dt))
                        setchat(srt.reverse())

                        //

                        setTimeout(POPREquest, 1000)
                        
                    }

                }
            }
        }
    }, [val, users]);


    let POPREquest = () => {
        let helpbtns_view = document.querySelector('.helpbtns_view');
        if (helpbtns_view) {
            helpbtns_view.scrollIntoView({ behavior: 'smooth' });
        }
        else {
            setTimeout(POPREquest, 1000)
        }
    };

    let handleUpdates = async (va, onlyme) => {
        let u = [...users];
        let f = u.find(v => v.user_id === vo.user_id);
        if (f) {
            let c = f.chats.findIndex(v => v.message_id === va.message_id)
            if (c !== -1) {
                f.chats.splice(c, 1)
                setusers(u)

                let pt = {
                    owner_id: owner[0].user_id,
                    onlyme: onlyme ? true : false,
                    contact_id: vo.user_id,
                    receivers_id: vo.user_id,
                    action_type: 'delete',
                    message_id: va.message_id
                }

                let jo = {
                    data: Obj.encDec(JSON.stringify(pt), keys.p),
                    k: 'p'
                }

                let dt = await Obj.sL(jo, null, `chat`);
                if (dt) {
                    setinput('')
                    setsubs(false)
                
                }
            }
        }
    };

    return (
        <>
            <div className="chatmainBd transition-all p-2 overflow-x-hidden overflow-y-auto h-full max-h-full w-full bg-[transparent] z-[100000000]">
                {
                    chat.length > 0 ?
                        <>
                            {
                                (chat || []).map((vl, kl) => {
                                    return (
                                        <div key={kl} className="msd">
                                            <div className="prev_ma sticky top-0 left-0 flex items-center z-[1000000000000] pointer-events-none justify-center p-1 w-full">
                                                <div className="float_date brd w-fit p-1 rounded-lg shadow-md bg-[var(--mainBg)]">{Fm(vl.dt)}</div>
                                            </div>
                                            {
                                                vl.data.length > 0 ?
                                                    <>
                                                        {
                                                            (vl.data || []).map((v, k) => {
                                                                return (
                                                                    <div className={`leftanRight _id_${k} w-full flex  items-start ${v.owner_id === owner[0].user_id ? `justify-end` : ``}`}>
                                                                        <div key={k} className={`messagebox_c mt-1 bb p-2 ${v.owner_id === owner[0].user_id ? 'adColors' : 'bg-[var(--border)]'} w-fit max-w-[90%] rounded-xl shadow-md brd`}>
                                                                            <div className="who flex items-center justify-end gap-1">
                                                                                <div className="usseroptioonDropdown">
                                                                                    <div className="dropdown">
                                                                                        <i className="bi bi-three-dots-vertical hover:bg-[var(--mainBg)] flex items-center justify-center h-5 w-5 overflow-hidden rounded-full brd cursor-pointer"
                                                                                            type="button" data-bs-toggle="dropdown" aria-expanded="false"
                                                                                        ></i>
                                                                                        <ul className="dropdown-menu w-[200px] bg-[var(--mainBg)]">
                                                                                            <div onClick={e => {
                                                                                                setreply({ type: 'reply', v })
                                                                                            }} className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                                                                                <i className="bi bi-reply p-1 flex items-center justify-center"></i>
                                                                                                <span>Reply</span>
                                                                                            </div>
                                                                                            <div className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                                                                                <i className="bi bi-copy p-1 flex items-center justify-center"></i>
                                                                                                <span>Copy</span>
                                                                                            </div>
                                                                                            <div onClick={e => {
                                                                                                if (window.confirm(`⚠️⚠️⚠️ This action will prevent your from being able to delete from everyone. \n\n do you wish to delete this item only from your end? \n\nOK(YES) or CANCEL(NO)`)) {
                                                                                                    handleUpdates(v, true)
                                                                                                }
                                                                                            }} className="contentBts text-danger flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                                                                                <i className="bi bi-trash p-1 flex items-center justify-center"></i>
                                                                                                <span>Delete From Me</span>
                                                                                            </div>
                                                                                            {
                                                                                                v.owner_id === owner[0].user_id ?
                                                                                                    <>
                                                                                                        <div onClick={e => {
                                                                                                            setreply({ type: 'edit', v })
                                                                                                            setinput(v.messages.text)
                                                                                                        }} className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                                                                                            <i className="bi bi-pen p-1 flex items-center justify-center"></i>
                                                                                                            <span>Edit</span>
                                                                                                        </div>
                                                                                                        <div onClick={e => {
                                                                                                            if (window.confirm(`⚠️⚠️⚠️ Warning!!! This action can not be backedup. \n You just clicked on the delete from everyone button. \n\n Do you wish to delete from both ends? \n\nOK(YES) or CANCEL(NO)`)) {
                                                                                                                handleUpdates(v)
                                                                                                            }
                                                                                                        }} className="contentBts text-danger flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                                                                                            <i className="bi bi-trash p-1 flex items-center justify-center"></i>
                                                                                                            <span>Delete Fom Everyone</span>
                                                                                                        </div>
                                                                                                    </> : ``
                                                                                            }
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {
                                                                                v.messages.text.trim().length > 0 ?
                                                                                    <div className="textmSt text-xs opacity-[.8] p-2 select-text">
                                                                                        <TextWithLinks text={v.messages.text} />
                                                                                    </div> : ''
                                                                            }
                                                                            {
                                                                                v.message_thread.length > 0 ?
                                                                                    <div className="gridImagepost mb-1">
                                                                                        {
                                                                                            (v.thread_message.slice(0, 4) || []).map((vk, kv) => {
                                                                                                return (
                                                                                                    <div key={kv} className="gridImage1 relative cursor-pointer hover:opacity-[.6] max-h-[300px] overflow-hidden rounded-md brd">
                                                                                                        {
                                                                                                            kv + 1 === 4 ?
                                                                                                                <div className="amountMore absolute top-0 left-0 w-full h-full z-[1000000] bg-[var(--brd)] text-4xl font-bold text-center flex items-center justify-center p-2">
                                                                                                                    {vk.thread_message.length - 4 > 99 ? `99+` : `${vk.thread_posts.length - 4}+`}
                                                                                                                </div> : ``
                                                                                                        }
                                                                                                        <Img id={vk.message_id} v={vk} type={vk.message_type} len={vk.messages.len} className=" h-full w-full object-cover object-top"
                                                                                                            src={vk.messages.file}
                                                                                                            alt="" />
                                                                                                        {/*  */}
                                                                                                        <div className="bottominfo transition-all flex items-center justify-between gap-2 w-full">
                                                                                                            <span className={"line-clamp-1"}>{Obj.DetMinDate(parseInt(vk.message_time))}</span>
                                                                                                            <span className={"line-clamp-1 min-w-fit"}>{vk.messages.size}</span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                );
                                                                                            })
                                                                                        }
                                                                                    </div> : ''
                                                                            }
                                                                            <div className="helloUser w-full flex items-center justify-end gap-2 text-xs opacity-[.6]">
                                                                                {
                                                                                    v.edited ? 
                                                                                        <div className="editeed text-[.50rem] opacity-[.5]">Edited</div> : ``
                                                                                }
                                                                                <div className="dateAd text-xs">  {new Date(parseInt(v.message_time)).toLocaleTimeString().replace(/:\d{2}(?=\s[AP]M)/, '')}</div>
                                                                                {
                                                                                    v.owner_id === owner[0].user_id ?
                                                                                        <div title={`Delivered`} className="stat">
                                                                                            <i className={`bi ${v.message_read ? 'bi-check2-all' : 'bi-check2'}`} />
                                                                                        </div> : ''
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </> : ``
                                            }
                                        </div>
                                    )
                                })
                            }
                        </> :
                        <>
                        </>
                }
                <div className="helpbtns_view h-10 w-full p-2" />
            </div>
        </>
    );
};
    

const Chat = () => {
    const { is_chat, setis_chat, users } = useContext(Connect)
    // 
    const [nc, setnc] = useState([])
    const [reply, setreply] = useState(null)
    // 
    useEffect(() => {
        if (owner && users.length > 0) {
            if (is_chat) {
                let f = users.find(v => v.user_id === is_chat)
                if (f) {
                    let fc = owner[0].contacts.find(v => v.id === f.user_id)
                    f.contact = fc
                    setnc([f])
                }
            }
        }
    }, [is_chat, owner, users]);
    //

    let pushTODB = async () => {
        try {
            let reqObj = {
                owner_id: owner[0].user_id,
                user_id: owner[0].user_id,
                update: JSON.stringify(owner[0].contacts),
                hidden_id: owner[0].hidden_id,
                cookie_id: owner[0].cookie_id,
                is_verified: owner[0].is_verified,
                where: 'contacts'
            }
                                        
            let jj = {
                data: Obj.encDec(JSON.stringify(reqObj), keys.p),
                k: 'p'
            };
            await Obj.sL(jj, null, `user_update`);

            window.location.reload()
        }
        catch (e) {
            console.log(e)
        }
    };

    let hanleUpdatess = (type, id, isblocked) => { 
        try {
            let addobj = {
                id,
                blocked: isblocked ? true : false,
                time: new Date().getTime()
            }
            // 
            if (type === 'add') {
                let f = owner[0].contacts.find(v => v.id === id)
                if (!f) {
                    owner[0].contacts.push(addobj)
                    pushTODB()
                }
            }
            else if (type === 'remove') {
                let f = owner[0].contacts.findIndex(v => v.id === id)
                if (f !== -1) {
                    owner[0].contacts.splice(f, 1)
                    pushTODB()
                }
                
            }
            else {
                let f = owner[0].contacts.find(v => v.id === id)
                if (f) {
                    f.blocked = isblocked
                    pushTODB()
                }
            }
        }
        catch (e) {
            console.log(e)
        }
    }


    return (
        <>
            {
                (nc || []).map((val, key) => {
                    return (
                        <div key={key} onContextMenu={e => e.preventDefault()} className="welometohomepage h-full w-full flex items-center justify-between flex-col overflow-hidden z-[10000000000]">
                            <div className="curruheader z-[100000000000] flex items-center justify-between w-full bg-[var(--basebg)] p-2">
                                <div className="currentuProfilNamee flex items-center justify-start gap-2">
                                    <i
                                        onClick={e => setis_chat(null)}
                                        className="bi bi-x-lg h-10 w-10 flex items-center justify-center text-center text-lg cursor-pointer hover:bg-[var(--border)]"
                                    ></i>
                                    <div className="usImage h-10 w-10 overflow-hidden rounded-full">
                                        <Picture val={val} profilepic={val.info[0].profilepic} />
                                    </div>
                                    <div className="aindkeyams">
                                        <div className="uname text-sm hover:underline w-fit cursor-pointer">
                                            {val.name}
                                        </div>
                                        <div className="status text-xs opacity-[.5]">Online</div>
                                    </div>
                                </div>
                                <div className="usseroptioonDropdown">
                                    <div className="dropdown">
                                        <i className="bi bi-three-dots-vertical hover:bg-[var(--basebg)] flex items-center justify-center h-10 w-10 overflow-hidden rounded-full brd cursor-pointer"
                                            type="button" data-bs-toggle="dropdown" aria-expanded="false"
                                        ></i>
                                        <ul className="dropdown-menu">
                                            <div className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                                <i className="bi bi-person p-1 flex items-center justify-center"></i>
                                                <span>Chat info</span>
                                            </div>
                                            <div className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                                <i className="bi bi-ban p-1 flex items-center justify-center"></i>
                                                <span>Block Chat</span>
                                            </div>
                                            <div className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                                <i className="bi bi-share p-1 flex items-center justify-center"></i>
                                                <span>Share Contact</span>
                                            </div>
                                            <div className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                                <i className="bi bi-collection-play p-1 flex items-center justify-center"></i>
                                                <span>Chat Medias</span>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="chatBodaypoint overflow-hidden relative h-full w-full flex items-end justify-end flex-col">
                                    <ChatData reply={reply} setreply={setreply} vo={val} val={val.hasOwnProperty('chats') ? val.chats : null}/>
                            </div>
                            {
                                val.contact ?
                                    !val.blocked ?
                                        <Cf reply={reply} setreply={setreply}  val={val} /> :
                                        <></> :
                                    <>
                                        <div className="bottomS p-2 text-center flex items-center justify-center flex-col gap-2">
                                            <div className="textCnts text-sm opacity-[.8]">
                                                This user is not in your contact list. Add to your chat to start chatting.
                                            </div>
                                            <div className="addbtn">
                                                <div onClick={e => hanleUpdatess(`add`, val.user_id)} className="btnC brd bg-primary text-white p-2 btn">
                                                    Add to contacts
                                                </div>
                                            </div>
                                        </div>
                                    </>
                            }
                        </div>
                    )
                })
            }
        </>
    );
};