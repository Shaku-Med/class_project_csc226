let Posts = ({ val }) => {
    const { users, setpost, post, is_chat, setis_chat, external, setexternal  } = useContext(Connect);
    //

    let DbUpdate = async (obj) => {
        try {
            let jj = {
                data: Obj.encDec(JSON.stringify(obj), keys.p),
                k: 'p'
            };
            await Obj.sL(jj, null, `post`);
        }
        catch { }
    };

    let postAction = (type, id, initial) => {
        const alertType = type !== 'delete'
            ? window.confirm(`Are you sure you want to perform this action? \n\n This action is Immediate. \n \n OK(YES) or CANCEL(NO)`)
            : window.confirm(`Are you sure you want to delete this post? This action cannot be recovered. \n\n Do you consent to this? \n \n OK(YES) or CANCEL(NO)`);

        if (alertType) {

                        // 
            let obj = {
                post_id: id,
                initial,
                type,
                owner_id: owner[0].user_id,
                action_type: true
            }
            DbUpdate(obj)

            setpost(prevPosts => {
                const updatedPosts = [...prevPosts];
                const postIndex = updatedPosts.findIndex(post => post.owner_id === owner[0].user_id && post.post_id === id);
                if (postIndex !== -1) {
                    if (type === 'delete') {
                        updatedPosts.splice(postIndex, 1);
                    } else {
                        updatedPosts[postIndex] = {
                            ...updatedPosts[postIndex],
                            [type]: initial ? false : true
                        };
                    }
                }
                return updatedPosts;
            });
        }
    };
    
    return (
        <div className="postAdded min-w-[300px] bg-[var(--border)] p-2 rounded-lg  mt-2">

            <div className={`profileSide bb p-2 flex ${val.post_thread.length < 1 ? 'items-center' : 'items-start'} justify-start gap-2 w-full`}>
                {
                    val.owner ?
                        <div className="usImage h-10 w-10 min-w-10 max-h-10 overflow-hidden rounded-full">
                            <Picture val={val.owner} profilepic={val.owner.info[0].profilepic} />
                        </div> : ''
                }
                <div className={`contenttoadd flex items-start justify-between gap-1 w-full`}>
                    <div className="contentT w-full">
                        <div onClick={e => setexternal(val.owner)} className="usName text-sm w-fit hover:underline cursor-pointer opacity-[.7] line-clamp-1">
                            {
                                val.owner ?
                                    val.owner.name : 'Private _ Account'
                            }
                        </div>
                        <div className="messageAdded text-xs opacity-[.5]">
                            {val.post_thread.length < 1 ? '' : val.post_body.text}
                        </div>
                        <div className="postPriv flex items-center justify-between gap-2 p-1 text-xs opacity-[.6]">
                            <div className="dateonepart flex items-center justify-start gap-1">
                                {
                                    val.post_privacy ?
                                        <i title="Post is made public" className="bi bi-globe" /> :
                                        <i title="Private post, only your can see this post." className="bi bi-lock" />
                                }
                                <span>{Obj.DetMinDate(parseInt(val.post_time))}</span>
                            </div>
                            <div className="date">
                                {new Date(parseInt(val.post_time)).toLocaleTimeString().replace(/:\d{2}(?=\s[AP]M)/, '')}
                            </div>
                        </div>
                    </div>

                    <div className="usseroptioonDropdown">
                        <div className="dropdown">
                            <i className="bi bi-three-dots-vertical hover:bg-[var(--basebg)] flex items-center justify-center h-5 w-5 overflow-hidden rounded-full brd cursor-pointer"
                                type="button" data-bs-toggle="dropdown" aria-expanded="false"></i>
                            <ul className="dropdown-menu w-[200px]">
                                {/* <div
                                    className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                    <i className="bi bi-copy p-1 flex items-center justify-center"></i>
                                    <span>Copy Link</span>
                                </div>
                                <div
                                    className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                    <i className="bi bi-share p-1 flex items-center justify-center"></i>
                                    <span>Share</span>
                                </div> */}
                                {
                                    val.owner_id !== owner[0].user_id ?
                                        <div
                                            onClick={val.owner_id !== owner[0].user_id ? e => setis_chat(val.owner_id) : e => {}}
                                            className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                            <i className="bi bi-chat-dots p-1 flex items-center justify-center"></i>
                                            <span>Message Owner</span>
                                        </div> : ''
                                }
                                {
                                    val.owner_id === owner[0].user_id ?
                                        <>
                                            <div
                                                onClick={e => postAction(`post_privacy`, val.post_id, val.post_privacy)}
                                                className={`contentBts ${!val.post_privacy ? 'text-danger' : ''} flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat`}>
                                                <i className="bi bi-lock p-1 flex items-center justify-center"></i>
                                                <span>{val.post_privacy ? `Make Private` : `Make Public`}</span>
                                            </div>
                                            <div
                                                onClick={e => postAction(`allow_comments`, val.post_id, val.allow_comments)}
                                                className={`contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat`}>
                                                <i className="bi bi-chat-dots p-1 flex items-center justify-center"></i>
                                                <span>{val.allow_comments ? `Disable Comments` : `Allow Comments`}</span>
                                            </div>
                                            
                                            <div
                                                onClick={e => postAction(`delete`, val.post_id)}
                                                className="contentBts text-danger flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                                <i className="bi bi-trash p-1 flex items-center justify-center"></i>
                                                <span>Delete Post</span>
                                            </div>
                                        </> : ``
                                }
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            {/* <hr /> */}

            {
                val.post_thread.length > 0 ?
                    <div className="gridImagepost mb-1">
                        {
                            (val.thread_posts.slice(0, 50) || []).map((v, k) => {
                                // console.log(v)
                                return (
                                    <div key={k} className="gridImage1 relative cursor-pointer hover:opacity-[.6] max-h-[300px] overflow-hidden rounded-md brd">
                                        {
                                            k + 1 === 50 ?
                                                <div className="amountMore absolute top-0 left-0 w-full h-full z-[1000000] bg-[var(--brd)] text-4xl font-bold text-center flex items-center justify-center p-2">
                                                    {val.thread_posts.length - 4 > 99 ? `99+` : `${val.thread_posts.length - 4}+`}
                                                </div> : ``
                                        }
                                        <Img id={v.post_id} v={v} type={v.post_type} len={v.post_body.len} className=" h-full w-full object-cover object-top"
                                            src={v.post_body.file}
                                            alt="" />
                                        {/*  */}
                                        {
                                            v.likes.length > 0 ?
                                                <div className="topinfo">{v.likes.length} {v.likes.length > 1 ? 'Likes' : 'Like'}</div> : ''
                                        }
                                        <div className="bottominfo transition-all flex items-center justify-between gap-2 w-full">
                                            <span className={"line-clamp-1"}>{Obj.DetMinDate(parseInt(v.post_time))}</span>
                                            <span className={"line-clamp-1 min-w-fit"}>{v.post_body.size}</span>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div> :
                    <div className={`post_bigM text-xl p-4 ${val.post_body.text.trim().length < 100 ? 'text-center' : ''}`}>
                        {val.post_body.text}
                    </div>
            }

            {/* <hr /> */}

            <div className="buttonSections flex items-center justify-between w-full">
                <div className="txMs gap-2 flex items-center justify-center w-full text-xs">
    
                    <span>{val.hasLiked ? `${`You ${val.likes.length < 2 ? `` : `and`} `}` : `${val.likes.length < 1 ? '' : val.likes.length}`}</span>
                                
                    <div className="dropdown dropup">
                        <span type="button" data-bs-toggle="dropdown" aria-expanded="false" className={`hover:underline cursor-pointer`}>{val.hasLiked ? `${val.likes.length < 2 ? `` : `(${val.likes.length - 1}) ${val.likes.length - 1 > 1 ? `others` : `more person`}`}` : `${val.likes.length > 1 ? 'Likes' : 'Like'}`}</span>
                        <ul className="dropdown-menu w-[200px] dropdown-bottom backdrop-blur-md brd shadow-lg bg-[var(--mainBg)]">
                            {
                                users.length > 0 ?
                                    (users.filter(v => val.likes.some(a => a.owner_id === v.user_id)) || []).map((v, k) => {
                                        return (
                                            <div
                                                onClick={e => setexternal(v)}
                                                key={k}
                                                className="contentBts flex items-center justify-start cursor-pointer gap-2 p-1 hover:bg-[var(--basebg)] cupidatat">
                                                <div className="usImage h-6 w-6 min-w-6 max-h-6 overflow-hidden rounded-full">
                                                    <Picture val={v} profilepic={v.info[0].profilepic} />
                                                </div>
                                                <span className={`line-clamp-1`}>{v.name}</span>
                                            </div>
                                        );
                                    })
                                    : ''
                            }
                        </ul>
                    </div>
                </div>
                {
                    val.allow_comments ?
                        <div className="txMs opacity-[.6] gap-2 flex items-center justify-center w-full text-xs">
                            <span>{val.comments.length}</span>
                            <span>{val.comments.length > 1 ? 'Comments' : 'Comment'}</span>
                        </div> : ''
                }
                <div className="txMs opacity-[.6] gap-2 flex items-center justify-center w-full text-xs">
                    {/* <span>20</span>
                    <span>Shares</span> */}
                </div>
            </div>

            <hr />

            <div className="buttonSections flex items-center justify-between w-full">
                <Likes val={val} />
                {
                    val.allow_comments ?
                        <Comment val={val} /> : ''
                }
                {/* <div
                    className="likedbtn active:scale-[.98] transition-all cursor-pointer hover:bg-[var(--basebg)] p-2 w-full flex items-center justify-center gap-2 text-center">
                    <i className="bi bi-share"></i>
                    <span>Share</span>
                </div> */}
            </div>

        </div>
    )
};