<?php

$request_uri = strtolower($_SERVER['REQUEST_URI']);
if (strpos($request_uri, "/log/") !== false) {
    header('Location: http://163.238.35.165/~amara/PROJECT/php/UI/Index.php?endpoint=login.php');
    exit;
}

?>

<div
    class="containerCenter transition-all z-[1000000000000000] p-2 bg-[var(--mainBg)] rounded-lg shadow-lg brd h-fit w-full max-w-[600px] max-h-[600px]">
    <div class="boldTextsay">
        <div class="ainsk text-lg text-center transition-all p-2 dark:text-[green] text-[var(--mainCl)]"></div>
        <hr>
        <div class="smtxMX line-clamp-1 text-[green] text-center p-2"></div>
    </div>
    <div class="inputfielsa p-3 flex items-center justify-start gap-2 flex-col w-full">
        <div class="colT w-full flex items-center justify-center gap-2">
            <div class="inputbox1 w-full flex-col justify-start gap-1 flex items-start">
                <label class=" p-1 w-full" for="">Email</label>
                <input placeholder="Email ??@gmail.com" class=" text-[green] text-sm p-2 email" type="text" name=""
                    id="">
            </div>
        </div>
        <div class="colT w-full flex items-center gap-2 justify-center">
            <div class="inputbox1 w-full flex-col flex justify-start gap-1  items-start">
                <label class=" p-1 w-full" for="">password:</label>
                <input placeholder="●●●●●●●●" class=" text-[green] text-sm p-2 password" type="text" name="" id="">
            </div>
        </div>
    </div>
    <div class="buttonSubmitnow p-2 w-full">
        <div class="submitbtn brd p-2 text-center cursor-pointer hover:bg-[var(--border)] w-full rounded-lg shadow-lg">
            Login Now</div>
    </div>
    <div class="alreadyhaveBtn flex items-center justify-center text-center p-2 gap-2">
        <div class="leftT">
            Don't have an account?
        </div>
        <a href="?endpoint=signup.php" class="addm link-primary cursor-pointer hover:underline">
            Signup
        </a>
    </div>
    <div class="alreadyhaveBtn flex items-center justify-center text-center p-2 gap-2">
        <div class="leftT">
            I forgot my password.
        </div>
        <a href="?endpoint=forgot.php" class="addm link-primary cursor-pointer hover:underline">
            Reset
        </a>
    </div>
</div>

<script>
let hasSub
let SendAuth = async () => {
    let submitbtn = document.querySelector('.submitbtn')

    let norm = `Create an account`
    let sub = `Sending....`

    if (submitbtn) {
        try {
            // submitbtn.classList.add('dis')
            // submitbtn.innerHTML = sub
            // hasSub = true;
            // 
            var [email, password] = ['email', 'password'].map(
                id => document.querySelector(`.${id}`).value);
            // 
            // To prevent Sniffing and Spoofing (MMA (Man in the middle attack)) of the users info while making the request, I'm encrypting the object then decrypting it in the server side.
            let data = {
                email,
                password,
                device: {
                    device: Obj.Window(),
                    time: new Date().getTime(),
                    type: 'default'
                },
                date: new Date().getTime()
            }
            // 
            let jo = {
                data: Obj.encDec(JSON.stringify(data), keys.u),
                k: 'u'
            }
            let lg = await Obj.sL(jo, true)
            if (lg) {
                let au = Obj.Window().split(/\s+/).join('')
                sessionStorage.setItem(`auth`, Obj.encDec(lg.user_id, au))
                // 
                let sstore = await fetch(`?endpoint=sessions.php&data=${lg.user_id}&sn=user_id`)
                let r = await sstore.text()
                // 
                window.location.reload()

            } else {
                showToast(
                    `Unable to logg you in.`
                )
                submitbtn.classList.remove('dis')
                submitbtn.innerHTML = norm
                hasSub = null
            }
        } catch (e) {
            showToast(`Unable to log you in. we had touble.`)
            submitbtn.classList.remove('dis')
            submitbtn.innerHTML = norm
            hasSub = null
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.submitbtn').addEventListener('click', function() {
        if (!hasSub) {
            var [email, password] = ['email', 'password'].map
                (
                    id => document.querySelector(`.${id}`).value);

            if (!/^[^\s@]+@gmail\.com$/.test(email)) return showToast(
                "Please enter a valid Gmail address.");
            if (!/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/\d/.test(
                    password))
                return showToast(
                    "Password must contain at least one uppercase letter, one symbol, and one number."
                );

            if (keys) {
                SendAuth()
            } else {
                alert(`Sorry! we're unable to get your session connection id. Please reload this page.`)
            }
        }
    });
});
</script>