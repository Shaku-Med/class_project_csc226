let Likes = ({ val, tpy }) => {
    const { post, setpost } = useContext(Connect);
    // 
    let Like = async (type) => {
        try {
            if (keys && ownerId && val) {
                let RecursiveUpdate = (posts, pg) => {
                    return posts.map(item => {
                        if (item.post_id === pg.post_id) {
                            item.hasLiked = item.hasLiked ? false : true;
                            let index = item.likes.findIndex(v => v.owner_id === pg.owner_id);
                            if (index !== -1) {
                                item.likes.splice(index, 1);
                            } else {
                                item.likes.push(pg);
                            }
                        }
                                
                        if (item.post_thread && item.post_thread.length > 0) {
                            item.thread_posts = RecursiveUpdate(item.thread_posts, pg);
                        }
        
                        return item;
                    });
                };
                // 
                let pg = {
                    like_id: Obj.uuid(),
                    owner_id: ownerId,
                    post_id: tpy === 'comment' ? val.comment_id : val.post_id,
                    liked_time: new Date().getTime(),
                    type: type,
                    like_type: tpy === 'comment' ? false : true
                }
                let updatedPosts = RecursiveUpdate(post, pg);
                setpost(updatedPosts)
                
                let jo = {
                    data: Obj.encDec(JSON.stringify(pg), keys.p),
                    k: 'p'
                }
                // 
                await Obj.sL(jo, null, `like`);
            }
        }
        catch { }
    };
    // 
    return (
        <div
            onClick={e => Like('like')}
            className={`likedbtn active:scale-[.98] transition-all cursor-pointer hover:bg-[var(--basebg)] p-2 w-full flex items-center justify-center gap-2 text-center  ${val.hasLiked ? 'text-primary' : ''}`}>
            <i className={`bi ${val.hasLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`}></i>
            <span>{val.hasLiked ? `Liked` : `Like`}</span>
        </div>
    )
};
