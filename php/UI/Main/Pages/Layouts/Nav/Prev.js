let Prev = ({ v, setimgprev }) => {
    return (
        <div className="profiles_show fixed top-0 left-0 w-full h-full transition-all bg-[var(--mainBg)]">
            <div onClick={e => setimgprev(null)} className="content_x z-[100000000] cursor-pointer bg-danger text-white h-10 w-10 flex items-center justify-center brd rounded-full shadow-lg absolute right-[20px] top-[20px]">
                <i className="bi bi-x-lg" />
            </div>
            <div className="profile_content swiper w-full h-full">
                <div className="swiper-wrapper">
                    <Picture className={` object-contain w-full h-full`} val={v} profilepic={v.info[0].profilepic} isall={true} />
                </div>
                {/*  */}
                <div className="swiper-pagination"></div>
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>
            </div>
        </div>
    )
};