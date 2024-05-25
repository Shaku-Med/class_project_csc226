let getOwner = async(callback) => {
    try {
        let dt = await Obj.sL(null, null, `owner?id=${ownerId}`, true)
        if (dt) {
            if (callback) {
                callback(dt);
                GetData()
            }
        } else {
            showToast(`Sorry! we had touble figuring who you are.`)
        }
    } catch (e) {
        showToast(`Unable to fetch your data. We're requesting for them again, Please wait...`)
        setTimeout(getOwner, 2000)
    }
}

let GetData = async(nxt) => {
    try {
        let jo = {
            data: Obj.encDec(JSON.stringify({ owner_id: ownerId, next_index: nxt ? nxt : 0 }), keys.r),
            k: 'r'
        }
        let dt = await Obj.sL(jo, true, `data?id=${ownerId}`, null, true)
        if (dt) {
            if (dt.next_index) {
                GetData(dt.next_index + 1)
                    // 
                if (reqdata) {
                    reqdata.push(dt)
                } else {
                    reqdata = [dt];
                }
            } else {
                if (reqdata) {
                    reqdata.push(dt)
                } else {
                    reqdata = [dt];
                }
            }
        } else {
            showToast(`Sorry! we had touble figuring who you are.`)
        }
    } catch {
        showToast(`Unable to fetch your data. We're requesting for them again, Please wait...`)
        setTimeout(GetData, 2000)
    }
}


let Data = (callback) => {
    try {
        getOwner(callback)
    } catch (e) {
        if (callback) {
            callback(e, true)
        }
    }
}