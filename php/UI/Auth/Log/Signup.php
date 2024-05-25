<?php

$request_uri = strtolower($_SERVER['REQUEST_URI']);

if (strpos($request_uri, "/log/") !== false) {
    header('Location: http://163.238.35.165/~amara/PROJECT/php/UI/Index.php?endpoint=signup.php');
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
                <label class=" p-1 w-full" for="">Name:</label>
                <input placeholder="Your FulLName" class=" text-[green] text-sm p-2 name" type="text" name="" id="">
            </div>
            <div class="inputbox1 w-full flex-col justify-start gap-1 flex items-start">
                <label class=" p-1 w-full" for="">Email</label>
                <input placeholder="Email ??@gmail.com" class=" text-[green] text-sm p-2 email" type="text" name=""
                    id="">
            </div>
        </div>
        <div class="colT w-full flex items-center gap-2 justify-center">
            <div class="inputbox1 w-full flex-col flex justify-start gap-1  items-start">
                <label class=" p-1 w-full" for="">New password:</label>
                <input placeholder="●●●●●●●●" class=" text-[green] text-sm p-2 password" type="text" name="" id="">
            </div>
            <div class="inputbox1 w-full flex-col  justify-start gap-1 flex items-start">
                <label class=" p-1 w-full" for="">Confirm:</label>
                <input placeholder="●●●●●●●●" class=" text-[green] text-sm p-2 confirm_password" type="text" name=""
                    id="">
            </div>
        </div>
    </div>
    <div class="buttonSubmitnow p-2 w-full">
        <div class="submitbtn brd p-2 text-center cursor-pointer hover:bg-[var(--border)] w-full rounded-lg shadow-lg">
            Create an account
        </div>
    </div>
    <div class="alreadyhaveBtn flex items-center justify-center text-center p-2 gap-2">
        <div class="leftT">
            Already have an account?
        </div>
        <a href="?endpoint=Login.php" class="addm link-primary cursor-pointer hover:underline">
            Login
        </a>
    </div>
</div>


<script>
// To prevent multiple requests. Some users might open their debugger and edit the element to remove the class that is preventing them from clicking multiple times. So I add a stop point 🤣🤣🤣
let hasSub
let SendAuth = async () => {
    let submitbtn = document.querySelector('.submitbtn')

    let norm = `Create an account`
    let sub = `Sending....`

    if (submitbtn) {
        try {
            submitbtn.classList.add('dis')
            submitbtn.innerHTML = sub
            hasSub = true;
            // 
            var [name, email, password] = ['name', 'email', 'password'].map(
                id => document.querySelector(`.${id}`).value);
            // 
            // To prevent Sniffing and Spoofing (MMA (Man in the middle attack)) of the users info while making the request, I'm encrypting the object then decrypting it in the server side.
            let data = {
                name,
                email,
                password,
                device: {
                    device: Obj.Window(),
                    time: new Date().getTime(),
                    type: 'main'
                },
                date: new Date().getTime(),
                info: [{
                        profilepic: []
                    },
                    {
                        others: []
                    }
                ]
            }
            // 
            let jo = {
                data: Obj.encDec(JSON.stringify(data), keys.u),
                k: 'u'
            }
            let sl = await Obj.sL(jo)
            if (sl) {
                let sstore = await fetch(`?endpoint=sessions.php&data=${data.email}&sn=verify`)
                let r = await sstore.text()
                // 
                let a = document.createElement('a')
                a.href = `?endpoint=Verify.php`
                a.target = `_self`
                a.click()
            } else {
                showToast(
                    `Sorry! we were unable to create your account. Please try again. Make sure to reload first.`
                )
                submitbtn.classList.remove('dis')
                submitbtn.innerHTML = norm
                hasSub = null
            }
        } catch (e) {
            showToast(`Unable to sign you up. we had touble.`)
            submitbtn.classList.remove('dis')
            submitbtn.innerHTML = norm
            hasSub = null
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.submitbtn').addEventListener('click', function() {
        if (!hasSub) {
            var [name, email, password, confirm] = ['name', 'email', 'password', 'confirm_password'].map
                (
                    id => document.querySelector(`.${id}`).value);

            if (!/^(\S+\s){1,}\S+$/.test(name)) return showToast(
                "Please enter your full name with at least two words.");
            if (!/^[^\s@]+@gmail\.com$/.test(email)) return showToast(
                "Please enter a valid Gmail address.");
            if (!/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/\d/.test(
                    password))
                return showToast(
                    "Password must contain at least one uppercase letter, one symbol, and one number."
                );
            if (password !== confirm) return showToast("Passwords do not match.");

            if (keys) {
                SendAuth()
            } else {
                alert(`Sorry! we're unable to get your session connection id. Please reload this page.`)
            }
        }
    });
});
</script>