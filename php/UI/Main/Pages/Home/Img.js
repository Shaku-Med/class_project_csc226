let Img = ({ src, alt, className, onClick, id, len, type, v, isprofile }) => {
    const { CImg, GetFiles, imgF, setimgF } = useContext(Connect);
    const [load, setload] = useState(true);
    const [im, setim] = useState(null);

    let GI = (is_exist) => {
        try {
            if (is_exist) {
                setim(is_exist)
            }
            else {
                if (src.match(/\b(?:https?|blob):\/\/\S+/)) {
                    setim(src)
                }
                else {
                    if (len) {
                        let callBack = (psh) => {

                            let totalSize = psh.reduce((acc, chunk) => acc + chunk.length, 0);
                                
                            const concatenatedArrayBuffer = new Uint8Array(totalSize);
                            let offset = 0;
                            psh.forEach(chunk => {
                                concatenatedArrayBuffer.set(new Uint8Array(chunk), offset);
                                offset += chunk.length;
                            });

                            let b = new Uint8Array(concatenatedArrayBuffer)
                            let bl = new Blob([b], { type: type })
            
                            let rlu = URL.createObjectURL(bl)
                            setim(rlu);

                            let ab = imgF
                            let ob = {
                                id: id,
                                url: rlu
                            }
                            ab.push(ob)
                            setimgF(ab)

                        }
                        GetFiles(src, callBack, len, `http://163.238.35.165/~amara/PROJECT/php/Upload/Files/${isprofile ? isprofile : v.owner_id}/`)
                    }
                }
            }
        }
        catch { }
    }

    useEffect(() => {
        try {
            if (id) {
                let N = CImg(id)
                GI(N)
            }
            else {
                setim(src)
            }
        }
        catch { }
    }, [])

    return (
        <>
            {
                im ?
                    <>
                        {type ?
                            type.includes('image') ?
                                <div onContextMenu={e => e.preventDefault()} className={className}>
                                    <img loading="lazy" onError={e => setload(null)} className={className} src={im} alt={alt} />
                                </div> :
                                <div onContextMenu={e => e.preventDefault()} className={className}>
                                    <video controls playsInline onError={e => setload(null)} className={`${className} object-contain`} src={im} alt={alt} />
                                </div> :
                            <div onContextMenu={e => e.preventDefault()} className={className}>
                                <img loading="lazy" onError={e => setload(null)} className={className} src={im} alt={alt} />
                            </div>
                        }
                    </> :
                    <div className={`${className} loaddingStage overflow-hidden text-center p-2 bg-[var(--mainBg)]`}>
                        Processing file. Please wait...
                    </div>
            }
        </>
    )
};