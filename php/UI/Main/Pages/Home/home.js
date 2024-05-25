const { useState, useEffect, useLayoutEffect, useCallback, useRef, createContext, useContext } = React;

const Connect = createContext();

const Loader = ({type}) => {
    const isTriangle = 'triangle';

    return (
        <div className={`loader triangle`}>
            <svg viewBox={ "0 0 86 80" }>
                <polygon points="43 8 79 72 7 72"></polygon>
                {/* <rect x="8" y="8" width="64" height="64"></rect> */}
                {/* <circle cx="40" cy="40" r="32"></circle> */}
            </svg>
        </div>
    );
};

let App = () => {

    // const socket = io(`https://two26-csc.onrender.com`,)

    const [data, setdata] = useState([])
    const [post, setpost] = useState([])
    const [users, setusers] = useState([])
    const [isv, setisv] = useState([]);
    const [external, setexternal] = useState(null);
    // 
    const [files, setfiles] = useState([]);
    const [input, setinput] = useState('');
    const [subs, setsubs] = useState(null)
    // 
    const [is_chat, setis_chat] = useState(null);
    // 
    const [rlstate, setrlstate] = useState(0)
    // 
    const [imgF, setimgF] = useState([])

    let GetFiles = (src, callback, len, type) => {
        let psh = []
        let FnC = async (ob) => {
            try {
                if (ob <= len - 1) {
                    let ulr = `${type}${src}_${ob}`
                    let ax = await axios.get(ulr);
                    psh.push(Object.values(ax.data));
                    FnC(ob + 1);
                    // 
                    Obj.addCH([ulr])
                }
                else {
                    if (psh.length > 0) {
                        callback(psh);
                    }
                    else {
                        callback(null)
                    }
                }
            }
            catch {

            }
        };
    
        FnC(0)
    };

    let CImg = (id) => {
        try {
            let f = imgF.find(v => v.id === id)
            if (f) {
                return f.url
            } else {
                return null
            }
        } catch {
            return null
        }
    }


    const deepMerge = (target, source) => {
        for (let key in source) {
            if (Array.isArray(source[key])) {
                if (!Array.isArray(target[key])) {
                    target[key] = [];
                }
                source[key].forEach(item => {
                    if (!target[key].some(targetItem => JSON.stringify(targetItem) === JSON.stringify(item))) {
                        target[key].push(item);
                    }
                });
            } else if (source[key] && typeof source[key] === 'object') {
                if (!target[key]) {
                    target[key] = {};
                }
                deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    };

    // Finding objects Data structure algorithm.

    let findObjectByID = (array, targetid) => {
        for (const item of array) {
            if (item.id === targetid) {
                return item
            }
            // 
            if (item.thread_posts && item.thread_posts.length > 0) {
                const foundObject = findObjectByID(item.thread_posts, targetid);
                if (foundObject) {
                    return foundObject
                }
            }
        }
        return null
    }

    let arrangePost = (pst, likes, users, comment, comment_likes) => {
        try {
            let posts = pst;
            let output = [];

            let LikeDeal = (post) => {
                try {
                    let fl = likes.filter(v => v.post_id === post.post_id);
                    post.likes = fl ? fl : [];

                    let f = fl.find(v => v.owner_id === ownerId);
                    post.hasLiked = f ? true : false;

                    let uft = owner[0].user_id === post.owner_id ? owner : users;
                    let u = uft.find(v => v.user_id === post.owner_id);
                    post.owner = u ? u : null;

                    // Comments
                    let ct = comment.filter(v => v.post_id === post.post_id);
                    post.comments = ct ? ct : [];

                    //
                    if (post.comments.length > 0) {
                        post.comments.forEach(cmnt => {
                            let flComment = comment_likes.filter(v => v.post_id === cmnt.comment_id);
                            cmnt.likes = flComment ? flComment : [];

                            let fComment = flComment.find(v => v.owner_id === ownerId);
                            cmnt.hasLiked = fComment ? true : false;

                            let uftComment = owner[0].user_id === cmnt.owner_id ? owner : users;
                            let uComment = uftComment.find(v => v.user_id === cmnt.owner_id);
                            cmnt.owner = uComment ? uComment : null;
                        });
            
                        if (post.thread_posts) {
                            post.thread_posts.forEach(threadPost => {
                                LikeDeal(threadPost);
                            });
                        }
                    }
                }
                catch { }
            };

            posts.forEach(post => {
                if (post.post_thread.length > 0) {
                    let pt = [];
                    let threadPosts = post.post_thread
                        .map(threadId => {
                            let threadPost = posts.find(p => p.post_id === threadId);
                            if (threadPost) {
                                pt.push(threadId);
                                LikeDeal(threadPost);
                                // 
                                return threadPost;
                            }
                            return null;
                        })
                        .filter(threadPost => threadPost !== null);

                    let pushP = () => {
                        LikeDeal(post);
                        let postCopy = { ...post, thread_posts: threadPosts };
                        output.push(postCopy);
                    };

                    if (pt.length > 0) {
                        if (!pt.includes(post.post_id)) {
                            pushP();
                        }
                    } else {
                        pushP();
                    }

                } else {
                    let f = posts.find(v => JSON.stringify(v.post_thread).includes(post.post_id));
                    if (!f) {
                        LikeDeal(post);
                        output.push(post);
                    }
                }
            });

            // Ensure no duplicates in the output
            output = output.filter((v, i, a) => a.findIndex(t => t.post_id === v.post_id) === i);

            return output;
        } catch (error) {
            console.error(error);
            return null;
        }
    };


    useEffect(() => {
        setTimeout(() => {
            // console.clear();
            const combinedObject = {};

            reqdata.forEach(obj => {
                deepMerge(combinedObject, obj);
            });
            
            if (Object.keys(combinedObject).length > 0) {
                setdata([combinedObject]);

                let p = arrangePost(combinedObject.post, combinedObject.likes, combinedObject.users, combinedObject.post_comments, combinedObject.comment_likes)
                setpost(p)
                setusers(combinedObject.users);

            }
            if (owner && keys) {
                let contacts = owner[0].contacts
                if (contacts.length > 0) {
                    getChatMessages(contacts, 0)
                    // 
                    // socket.emit('join', {
                    //     room: owner[0].user_id
                    // })
                }
            }

        }, 2000)
    }, [reqdata, owner]);


    
    let pT = (val) => {
        return {
            owner_id: owner[0].user_id,
            message_id: Obj.uuid(),
            receivers_id: val.user_id,
            message_time: new Date().getTime(),
            who_sees: [],
            message_read: false,
            message_reactions: JSON.stringify([]),
            is_restrict: false,
            edited: false,
            is_reply: '',
            message_thread: JSON.stringify(files.flatMap(v => v.id)),
        }
    };

    let handleSubmit = async (val, action) => {
        let helpbtns_view = document.querySelector('.helpbtns_view')
        if ((input.trim().length > 0 || files.length > 0) && helpbtns_view) {

            let pt = pT(val)
            // 
            pt.action_type = false
            pt.message = JSON.stringify({
                text: input,
                length: input.trim().length
            })
            pt.is_main_message = 'true'
            pt.message_type = 'text'
            pt.is_reply = action ? action.v.message_id : ''
            pt.action_type = action ? action.type : ''
            pt.edited = action ? true : false
            pt.message_id = action ? action.type !== 'reply' ? action.v.message_id : pt.message_id : pt.message_id
            // 

            // 
            let jo = {
                data: Obj.encDec(JSON.stringify(pt), keys.p),
                k: 'p'
            }
            //

            setinput('')

            if (action) {
              
                let u = [...users];
                let f = u.find(v => v.user_id === val.user_id);
                if (f) {
                    let c = f.chats.find(v => v.message_id === action.v.message_id)
                    if (c) {
                        if (action.type === 'reply') {
                            pt.message_thread = JSON.parse(pt.message_thread)
                            pt.message_reactions = JSON.parse(pt.message_reactions)
                            // pt.who_sees = JSON.parse(pt.who_sees)
                            pt.messages = JSON.parse(pt.message)
                            // 
                            f.chats = [...f.chats, pt];
                            setusers(u);
                            // 
                            helpbtns_view.scrollIntoView({ behavior: 'smooth' })

                            // socket.emit('chat', {
                            //     to: val.user_id,
                            //     jo
                            // })

                            let dt = await Obj.sL(jo, null, `chat`);
                            if (dt) {
                                setinput('')
                                setsubs(false)
                
                            }
                        }
                        else {
                            c.messages = {
                                text: input,
                                length: input.trim().length
                            }
                            c.edited = true
                            setusers(u)

                            // socket.emit('chat', {
                            //     to: val.user_id,
                            //     jo
                            // })

                            let dt = await Obj.sL(jo, null, `chat`);
                            if (dt) {
                                setinput('')
                                setsubs(false)
                
                            }
                        }
                    }
                }

            }
            else {
                                
                let u = [...users];
                let f = u.find(v => v.user_id === val.user_id);
                if (f) {
                    pt.message_thread = JSON.parse(pt.message_thread)
                    pt.message_reactions = JSON.parse(pt.message_reactions)
                    // pt.who_sees = JSON.parse(pt.who_sees)
                    pt.messages = JSON.parse(pt.message)
                    // 
                    f.chats = [...f.chats, pt];
                    setusers(u);
                    // 
                    helpbtns_view.scrollIntoView({ behavior: 'smooth' })
                }

                // socket.emit('chat', {
                //     to: val.user_id,
                //     jo
                // });
            
                let dt = await Obj.sL(jo, null, `chat`);
                if (dt) {
                    setinput('')
                    setsubs(false)
                
                }
            }
        }
    };

    // GET CHAT MESSAGES
    let getChatMessages = async (contacts, index) => {
        if (index <= contacts.length) {
            let getid = contacts[index]
            // 
            let jo = {
                owner_id: owner[0].user_id,
                contact_id: getid.id,
                next_page: 1
            }
            // 
            let fncR = async (hasNext) => {
                let dj = {
                    data: Obj.encDec(JSON.stringify(jo), keys.p),
                    k: 'p'
                };
                let dt = await Obj.sL(dj, true, `getchats`);
                if (dt) {
                    let uu = users
                    let u = uu.find(v => v.user_id === jo.contact_id)
                    if (u) {
                        u.chats = u.chats ? u.chats : []
                        let ch = u.chats.find(v => dt.some(a => a.message_id === v.message_id))
                        if (!ch) {
                            u.chats = [...u.chats, ...dt]
                            setusers(uu)
                        }
                    }
                }
            }
            // 
            fncR(0)
        }
        else {

        }
    }

    // useEffect(() => {
    //     try {
    //         socket.on('disconnect', () => {
    //             socket.connect()
    //         })
    //         socket.on('reset', e => {
    //             alert('reset time')
    //         })
    //         socket.on('chat_data', data => {
    //             console.log(data)
    //         })
    //     }
    //     catch { }
    // }, [])


    return (

        
        <>
            <Connect.Provider value={{ external, setexternal, files, setfiles, input, setinput, subs, setsubs, handleSubmit, is_chat, setis_chat, isv, setisv, data, setdata, users, setusers, post, setpost, CImg, GetFiles, imgF, setimgF }}>
                {
                    (owner || []).map((v, k) => {
                        return (
                            <div key={k} className=" fixed top-0 left-0 w-full h-full overflow-hidden touch-none flex items-center justify-start">
                                <Nav />
                                <div className="viewpaths relative h-full bg-[var(--basebg)] w-full z-[1000000000] ">
                                    <div
                                        className="MainHomepage overflow-x-hidden overflow-y-auto flex gap-2 items-center justify-start flex-col w-full h-full pt-2 pl-2 pr-2 pb-2">

                                        <div className="boldTextCt p-5 flex items-center justify-center flex-wrap">
                                            <div className="iconhere">
                                                <Img className=" h-20 w-20 min-w-20 min-h-20" src="http://163.238.35.165/~amara/PROJECT/php/Icons/favicon.ico"
                                                    alt="" />
                                            </div>
                                            <div className="boldTxt uppercase text-center text-3xl">
                                                TALKATIVE
                                            </div>
                                        </div>

                                        <div className="centerDataset w-full max-w-[600px] min-w-[300px]">

                                            <div
                                                className="contentToaddd grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); bg-[var(--border)] p-2 brd shadow-lg rounded-lg">
                                                <div className="profileSide p-2 flex items-center justify-start gap-2 w-full">
                                                    <i
                                                        className="bi opennav hidden bi-list h-10 w-10 max-[800px]:flex items-center justify-center text-center text-lg cursor-pointer hover:bg-[var(--border)]"></i>
                                                    <div className="usImage h-10 w-10 min-w-10 max-h-10 overflow-hidden rounded-full">
                                                        <Picture val={v} profilepic={v.info[0].profilepic} />
                                                    </div>
                                                    <div data-bs-toggle="modal" data-bs-target="#photo"
                                                        className="contenttoadd capitalize overflow-hidden line-clamp-1 max-[323px]:text-sm w-full bg-[var(--basebg)] cursor-pointer pl-2 pr-2 pt-2 pb-2 rounded-full">
                                                        What's on your mind, {v.name.split(/\s+/)[0]}?
                                                    </div>
                                                    <i onClick={e => {
                                                        LogOut()
                                                    }}
                                                        className="bi logoutbtn  bg-danger hidden bi-box-arrow-left h-10 w-10 min-h-10 rounded-full min-w-10 max-[800px]:flex items-center justify-center text-center text-lg cursor-pointer hover:bg-[var(--border)]"></i>
                                                </div>
                                                <hr />
                                                <div className="gridElement p-1 flex max-[323px]:flex-wrap items-center justify-between">
                                                    <div data-bs-toggle="modal" data-bs-target="#photo"
                                                        className="iconOne1 gap-1 hover:bg-[var(--basebg)] bbl w-full flex items-center justify-center p-2 cursor-pointer">
                                                        <i className="bi bi-images"></i>
                                                        <span>Photo/Video</span>
                                                    </div>
                                                    <div data-bs-toggle="modal" data-bs-target="#photo"
                                                        className="iconOne1 gap-1 hover:bg-[var(--basebg)] w-full flex items-center justify-center p-2 cursor-pointer">
                                                        <i className="bi bi-emoji-smile"></i>
                                                        <span>Feeling/Activity</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {
                                                data.length > 0 ?

                                                    <>
                                                        {
                                                            post.length > 0 ?
                                                                (post || []).map((val, key) => {
                                                                    return <Posts val={val} key={key} />
                                                                }) :
                                                                <>
                                                                    <div className="postnota text-center flex items-center justify-center p-2 mt-2 flex-col gap-2 opacity-[.6]">
                                                                        <i className="bi bi-emoji-frown text-5xl" />
                                                                        <span>No post available. Be the first.</span>
                                                                    </div>
                                                                </>
                                                        }
                                                    </>
                                                    :
                                                    <>
                                                        <div className="memicc flex top-0 left-0 w-full h-full items-center justify-center flex-col">
                                                            <Loader />
                                                        </div>
                                                    </>
                                                            
                                            }

                                            <div className="modal fade p-2" id="photo" tabIndex="-1" aria-labelledby="photoLabel" aria-hidden="true">
                                                <Post />
                                            </div>


                                        </div>


                                    </div>
                                    {
                                        is_chat ?
                                            <div className="chatbox_hera bg-[var(--mainBg)] absolute z-[100000000000] top-0 left-0 w-full h-full">
                                                <Chat />
                                            </div> : ''
                                    }

                                    {
                                        external ?
                                            <>
                                                <div className="chatbox_hera bg-[var(--mainBg)] absolute z-[100000000000] top-0 left-0 w-full h-full">
                                                    <Nav isextrnal={[external]} />
                                                </div>
                                            </>
                                            : ''
                                    }
                                </div>
                                
                            </div>
                        )
                    })
                }
            </Connect.Provider>
        </>

    );
};