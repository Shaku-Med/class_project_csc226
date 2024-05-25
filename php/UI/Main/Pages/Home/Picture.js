let Picture = ({ profilepic, isall, val, className }) => {
    // 
    const [img, setimg] = useState([])
    //

    let rlMe = () => {
        const swiper = new Swiper('.swiper', {
            direction: 'horizontal',
            loop: false,

            pagination: {
                el: '.swiper-pagination',
            },

            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    };
    
    let getPP = (pic) => {
        try {
            let flt = pic.sort((a, b) => new Date(b.time) - new Date(a.time))
            let rtObj = flt.length > 0 ? isall ? flt : [flt[0]] : []
            // 
            return rtObj
        }
        catch {
            return []
        }
    };
    
    useEffect(() => {
        try {
            if (profilepic && val) {
                let pp = getPP(profilepic)
                setimg(pp)
                // 
                if (pp.length > 1) {
                    rlMe()
                }
            }
        } catch { }
    }, [profilepic, val]);

    return (
        <>
            {
                (img || []).map((v, k) => {
                    if (img.length > 1) {
                        return (
                            <div className="swiper-slide w-full h-full">
                                <Img key={k} id={v.time} isprofile={val.user_id} type={v.type} len={v.len} className={`${className ? className : 'h-full w-full object-cover object-top'}`}
                                    src={v.file}
                                    alt="" />
                            </div>
                        )
                    }
                    else {
                        return (
                            <Img key={k} id={v.time} isprofile={val.user_id} type={v.type} len={v.len} className={`${className ? className : 'h-full w-full object-cover object-top'}`}
                                src={v.file}
                                alt="" />
                        )
                    }
                })
            }
        </>
    )
};