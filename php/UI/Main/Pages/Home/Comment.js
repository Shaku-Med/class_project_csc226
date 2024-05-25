let ReCursive_C = ({ v, setisreply, vl, handleSend, setisedit }) => {
    const { external, setexternal, setis_chat} = useContext(Connect);
    const [view, setview] = useState(null);

    // Check if 'v' is defined
    if (!v) {
        return null;
    }

    return (
        <>
            <div className="comment_user p-1 w-full flex items-center justify-between gap-2">
                {
                    v.hasOwnProperty('owner') && (
                        <div className="cLeft flex items-center justify-start gap-2">
                            <div className="iconhere h-7 w-7 min-w-7 min-h-7 object-cover overflow-hidden rounded-full">
                                <Picture val={v.owner} profilepic={v.owner.info[0].profilepic} />
                            </div>
                            <div className="comment_name_info">
                                <div onClick={e => setexternal(v.owner)} className="comment_name line-clamp-1 hover:underline cursor-pointer">{v.owner.name}</div>
                                <div className="comment_time line-clamp-1 text-xs opacity-[.6]">{Obj.DetMinDate(v.comment_time)}</div>
                            </div>
                        </div>
                    )
                }
                <div className="c_right">
                    <div className="usseroptioonDropdown">
                        <div className="dropdown">
                            <i className="bi bi-three-dots-vertical hover:bg-[var(--basebg)] flex items-center justify-center h-5 w-5 overflow-hidden rounded-full brd cursor-pointer"
                                type="button" data-bs-toggle="dropdown" aria-expanded="false"></i>
                            <ul className="dropdown-menu">
                                {
                                    v.owner_id !== owner[0].user_id && (
                                        <div
                                            onClick={v.owner_id !== owner[0].user_id ? e => setis_chat(v.owner_id) : e => {}}
                                            className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                            <i className="bi bi-chat-dots p-1 flex items-center justify-center"></i>
                                            <span>Message Owner</span>
                                        </div>
                                    )
                                }
                                <div
                                    onClick={e => setisreply(v.comment_id)}
                                    className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                    <i className="bi bi-reply p-1 flex items-center justify-center"></i>
                                    <span>Reply</span>
                                </div>
                                {
                                    v.owner_id === owner[0].user_id && (
                                        <div
                                            onClick={e => {
                                                let obj = {
                                                    type: 'update',
                                                    isAdmin: false,
                                                    id: v.comment_id
                                                };
                                                setisedit(obj);
                                            }}
                                            className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                            <i className="bi bi-pen p-1 flex items-center justify-center"></i>
                                            <span>Edit</span>
                                        </div>
                                    )
                                }
                                {
                                    (vl.owner_id === owner[0].user_id || v.owner_id === owner[0].user_id) && (
                                        <div
                                            onClick={e => {
                                                if (window.confirm(`Are you sure you want to delete this comment?`)) {
                                                    let obj = {
                                                        type: 'delete',
                                                        isAdmin: vl.owner_id === owner[0].user_id,
                                                        id: v.comment_id
                                                    };
                                                    handleSend(obj);
                                                }
                                            }}
                                            className="contentBts text-danger flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                            <i className="bi bi-trash p-1 flex items-center justify-center"></i>
                                            <span>Delete</span>
                                        </div>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`squiz pl-6 pr-2 w-fit id_${v.comment_id}`}>
                <div className="commentBody select-text bg-[var(--basebg)] brd shadow-md p-2 rounded-lg">
                    <TextWithLinks text={v.comment_body.text || ''} />
                </div>
                {
                    v.hasOwnProperty('likes') ? (
                        <>
                            <div className="btnDo flex items-center justify-start gap-2 max-w-fit">
                                <Likes tpy={`comment`} val={v} />
                                <div onClick={e => setisreply(v.comment_id)} className="replBtn hover:underline cursor-pointer w-full">
                                    Reply
                                </div>
                            </div>
                            <div className="flexer flex items-center justify-between gap-2 p-1">
                                <span type="button" data-bs-toggle="dropdown" aria-expanded="false" className={`dis`}>{v.hasLiked ? `${v.likes.length < 2 ? `` : `(${v.likes.length - 1}) ${v.likes.length - 1 > 1 ? `others` : `more person`}`}` : `${v.likes.length > 1 ? 'Likes' : 'Like'}`}</span>
                            </div>
                        </>
                    ) : 'Reload to be able to do any-action'
                }
            </div>
            {
                v.hasOwnProperty('replies') && v.replies.length > 0 && (
                    <>
                        <div onClick={e => setview(view ? false : true)} className="collapseS pl-4 pr-4 hover:underline cursor-pointer w-fit">
                            <div className="spLikesList flex items-center justify-start gap-1">{v.replies.length > 1 ? `${v.replies.length} replies` : `${v.replies.length} reply`}</div>
                        </div>
                        {
                            view && v.replies.map((val, key) => {
                                return (
                                    <div key={key} className="commentone w-full bb p-1 bg-[var(--brd)]">
                                        <ReCursive_C setisedit={setisedit} handleSend={handleSend} vl={vl} setisreply={setisreply} v={val} />
                                    </div>
                                );
                            })
                        }
                    </>
                )
            }
        </>
    );
};


let ViewNComment = ({ v, setcomment, val }) => {
    const { post, setpost, users } = useContext(Connect);
    // 
    const [input, setinput] = useState("");
    const [c, setc] = useState([]);
    const [isreply, setisreply] = useState('');
    const [isedit, setisedit] = useState(null);
    // 
    const ch = useRef();
    //

    let ReHandle = (comments) => {
        // THIS DOESN'T GO RECURSIVELY....
        // const groupedComments = comments.reduce((acc, comment) => {
        //     const parentId = comment.is_reply;
        //     if (!acc[parentId]) acc[parentId] = [];
        //     acc[parentId].push(comment);
        //     return acc;
        // }, {});

        // return comments.map(comment => {
        //     comment.replies = groupedComments[comment.comment_id] || [];
        //     return comment;
        // }).filter(comment => comment.is_reply === '');

        const groupedComments = comments.reduce((acc, comment) => {
            const parentId = comment.is_reply;
            if (!acc[parentId]) acc[parentId] = [];
            acc[parentId].push(comment);
            return acc;
        }, {});

        function attachReplies(comment) {
            comment.replies = groupedComments[comment.comment_id] || [];
            comment.replies.forEach(reply => attachReplies(reply));
        }

        const topLevelComments = comments.filter(comment => comment.is_reply === '');
        topLevelComments.forEach(comment => attachReplies(comment));

        return topLevelComments;
    };

    
    useEffect(() => {
        if (v) {
            let cmt = ReHandle(v)
            if (cmt.length > 0) {
                let srt = cmt.sort((a, b) => new Date(b.comment_time) - new Date(a.comment_time))
                if (srt.length > 0) {
                    setc(srt.reverse());
                }
            }
            else {
                setc([])
            }
        }
    }, [v]);
    // 
    
    let RecursiveUpdate = (posts, pg, isupdate) => {
        return posts.map(item => {
            if (item.post_id === pg.post_id) {
                let who = isupdate ? isupdate : pg.comment_id
                let index = item.comments.findIndex(v => v.owner_id === pg.owner_id && v.comment_id === who);
                if (index !== -1) {
                    if (isupdate) {
                        item.comments[index].comment_body === pg.comment_body
                    }
                    else {
                        item.comments.splice(index, 1);
                    }
                } else {
                    item.comments.push(pg);
                }
            }
                                    
            if (item.post_thread && item.post_thread.length > 0) {
                item.thread_posts = RecursiveUpdate(item.thread_posts, pg);
            }
            
            return item;
        });
    };
    //

    let UpdateRealT = (pg, isupdate) => {
        let uc = [...c];
        pg.owner = owner[0]
        // 
        const updateComment = (comments, pg, isupdate) => {
            for (let i = 0; i < comments.length; i++) {
                let comment = comments[i];
                if (comment.comment_id === (isupdate ? isupdate : pg.comment_id)) {
                    if (isupdate) {
                        comment.comment_body = pg.comment_body;
                        return true;
                    } else {
                        comments.splice(i, 1);
                        return true;
                    }
                } else if (comment.replies && comment.replies.length > 0) {
                    if (updateComment(comment.replies, pg, isupdate)) {
                        return true;
                    }
                }
            }
            return false;
        };

        const addComment = (comments, pg) => {
            for (let comment of comments) {
                if (comment.comment_id === pg.is_reply) {
                    comment.replies.push(pg);
                    return true;
                } else if (comment.replies && comment.replies.length > 0) {
                    if (addComment(comment.replies, pg)) {
                        return true;
                    }
                }
            }
            return false;
        };

        if (isupdate) {
            if (!updateComment(uc, pg, isupdate)) {
                showToast(`Unable to update. In realtime.`);
            }
        } else {
            if (!updateComment(uc, pg, false)) {
                if (pg.is_reply) {
                    if (!addComment(uc, pg)) {
                        showToast(`Unable to add. Parent comment not found.`);
                    }
                } else {
                    uc.push(pg);
                }
            }
        }

        setc(uc);
    };

    let postcontainer = (isManual) => {
        return {
            comment_body: {
                text: input,
                length: input.trim().length
            },
            owner_id: owner[0].user_id,
            comment_time: new Date().getTime(),
            post_id: val.post_id,
            comment_id: Obj.uuid(),
            comment_type: 'text',
            is_reply: isreply,
            isAdmin: isManual ? isManual.isAdmin : null,
            action_type: isManual ? isManual.type : null
        }

    };
    
    let handleSend = async (isManual) => {
        if (input.trim().length > 0 && owner || isManual) {

            let pc = postcontainer(isManual)

            if (isManual) {
                pc.comment_id = isManual.id
                pc.comment_body = {
                    text: input,
                    length: input.trim().length
                }
            }

            let cd = RecursiveUpdate(post, pc, isManual ? isManual.type === 'update' ? isManual.id : null : null)
            setpost(cd)
            UpdateRealT(pc, isManual ? isManual.type === 'update' ? isManual.id : null : null)
            // 
            setinput('')

            let jo = {
                data: Obj.encDec(JSON.stringify(pc), keys.p),
                k: 'p'
            }
            // 
            await Obj.sL(jo, null, `comment`);
            //
            setisreply(null)
            setisedit(null)
        }
    };
    //

    // useEffect(() => { 
    //     if (ch.current) {
    //         // 
    //         setTimeout(() => {
    //             ch.current.scrollTo(0, ch.current.innerHeight)
    //         }, 200);
    //         // 
    //     }
    // }, [])
        
    return (
        <>
            <div className="comment_container p-2 fixed top-0 left-0 w-full h-full">
                <div onClick={e => setcomment(false)} className="clickoutsize fixed top-0 left-0 w-full h-full bg-[var(--basebg)] opacity-[.6] cursor-pointer" />
                <div className="ccommentup flex items-start justify-between flex-col rounded-lg shadow-md brd z-[1000000000] bg-[var(--border)] w-full h-full">
                    <div className="comment bb w-full flex items-center justify-between gap-2 p-1">
                        <div className="title text-lg p-1">Comment</div>
                        <i onClick={e => setcomment(false)} className="bi bi-x-lg h-7 rounded-full w-7 flex items-center justify-center text-lg cursor-pointer bg-danger text-white" />
                    </div>
                    <div ref={ch} className="comment_body h-full w-full overflow-x-hidden overflow-y-auto">
                        {
                            c.length > 0 ?
                                (c || []).map((v, k) => {
                                    return (
                                        <div keys={k} className="commentone w-full bb">
                                            <ReCursive_C setisedit={setisedit} handleSend={handleSend} vl={val} setisreply={setisreply} v={v}/>
                                        </div>
                                    )
                                }) :
                                <div className="cmta h-full flex items-center justify-center uppercase flex-col text-center p-2 w-full opacity-[.6] text-lg">
                                    This post has no comment, <br /> be the first
                                </div>
                        }
                    </div>
                    <div className="commentFoots w-full bt">
                        {
                            isreply || isedit ? 
                                <div onClick={e => {
                                    if (window.confirm(`Are you sure you want to cancel ${isedit ? 'Edit' : 'reply'}?`)) {
                                        setisreply(null)
                                        setisedit(null)
                                    }
                                }} className="replyTomessage p-2 brd text-center bg-[var(--mainBg)] rounded-md shadow-lg">
                            Ready to {isedit ? 'Edit' : 'reply'}.
                        </div> : ''
                        }
                        <div className="foot_ss flex items-center justify-between gap-2 p-2">
                            <div className="imputPath w-full">
                                <textarea autoFocus={isreply || isedit ? true : false} onChange={e => setinput(e.target.value)} value={input} placeholder={`Say something...`} className={` h-[60px]`} />
                            </div>
                            <div className="rotateMe subM">
                                <i onClick={input.trim().length > 0 ? isedit ? e => {
                                    handleSend(isedit)
                                } : e => {handleSend()} : e => { }} className={`bi bi-send bg-success text-white text-sm cursor-pointer brd h-10 w-10 flex items-center justify-center rounded-full overflow-hidden ${input.trim().length > 0 ? '' : 'dis'}`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

let Comment = ({ val }) => {
    const [comment, setcomment] = useState(false)
    // 
    return (
        <>
            <div
                onClick={e => setcomment(comment ? false : true)}
                className="likedbtn active:scale-[.98] transition-all cursor-pointer hover:bg-[var(--basebg)] p-2 w-full flex items-center justify-center gap-2 text-center">
                <i className="bi bi-chat"></i>
                <span>Comment</span>
            </div>
            {/*  */}
            {
                comment ? 
                    <ViewNComment val={val} v={val.comments} setcomment={setcomment}/> : ''
            }
        </>
    )
};