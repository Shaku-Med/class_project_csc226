<?php

$request_uri = strtolower($_SERVER['REQUEST_URI']);

if (strpos($request_uri, "/auth/") !== false) {
    header('Location: http://163.238.35.165/~amara/PROJECT/php/UI/Index.php?endpoint=verify.php');
    exit;
}
if (!isset($_SESSION['verify'])) {
    header('Location: http://163.238.35.165/~amara/PROJECT/php/UI/Index.php');
    exit;
}

?>

<div
    class="containerCenter transition-all z-[1000000000000000] p-2 bg-[var(--mainBg)] rounded-lg shadow-lg brd h-fit w-full max-w-[600px] max-h-[600px] verifyme">
    <div class="verifyContainer text-center">
        <div class="boldTxts uppercase font-bold text-2xl p-2">
            Verify Your Account
        </div>
        <hr>
        <div class="infoS p-2 text-sm opacity-[.6]">
            You will be redirected to the login page after you've verified your accout to login.
        </div>
        <div class="accounttov brd bg-[var(--border)] mb-2">
            <?php echo isset($_SESSION['verify']) ? $_SESSION['verify'] : '' ?>
        </div>
        <div class="dinslatay brd p-2 mt-2 cursor-pointer mb-2 hover:scale-[.98] active:scale-[.90] transition-all">
            Didn't get the code? Resend.
        </div>
        <hr>
    </div>
    <div class="inputBOx">
        <div class="inputContainer p-2">
            <input placeholder="Type your code here." class=" p-2 vcode" type="text" name="" id="">
        </div>
        <div class="submitBtn">
            <div class="buttonSubmitnow p-2 w-full">
                <div
                    class="submitbtn brd p-2 text-center cursor-pointer hover:bg-[var(--border)] w-full rounded-lg shadow-lg">
                    Verify Account
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    let onetime;
    document.querySelector('.dinslatay').addEventListener('click', e => {
        if (!onetime) {
            onetime = true;
            // 
            let ob = Obj.rS(`<?php echo isset($_SESSION['verify']) ? $_SESSION['verify'] : '' ?>`)
            if (ob) {
                showToast(
                    "Check your email, your new code has been sent.",
                    'success'
                );
            }
        } else {
            showToast(
                "Please reload your page to do another request."
            );
        }
    });
    document.querySelector('.submitbtn').addEventListener('click', async e => {
        var [vcode] = ['vcode'].map(id => document.querySelector(`.${id}`).value);
        if (vcode.trim().length > 0 && vcode.trim().length === 6) {

            let data = {
                vcode,
                email: `<?php echo isset($_SESSION['verify']) ? $_SESSION['verify'] : '' ?>`,
                istrue: false
            }

            let jo = {
                data: Obj.encDec(JSON.stringify(data), keys.r),
                k: 'r',
            }

            let sl = await Obj.sL(jo, null, `f`)
            if (sl) {
                <?php unset($_SESSION['verify']) ?>
                // 
                let a = document.createElement('a')
                a.href = `?endpoint=login.php`
                a.target = `_self`
                a.click()
            } else {
                showToast(
                    "Ouch! something went wrong."
                );
            }
        } else {
            showToast(
                "Please enter a valid verification code."
            );
        }
    });
});
</script>