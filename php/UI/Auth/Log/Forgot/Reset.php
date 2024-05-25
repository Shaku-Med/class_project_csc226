<?php

$request_uri = strtolower($_SERVER['REQUEST_URI']);

if (strpos($request_uri, "/forgot/") !== false) {
    header('Location: http://163.238.35.165/~amara/PROJECT/php/UI/Index.php?endpoint=forgot.php');
    exit;
}

?>

<div
    class="containerCenter z-[1000000000000000] p-2 bg-[var(--mainBg)] rounded-lg shadow-lg brd h-fit w-full max-w-[600px] max-h-[600px]">
    <div class="boldTextsay">
        <div class="ainsk text-lg text-center transition-all p-2 dark:text-[green] text-[var(--mainCl)]"></div>
        <hr>
        <div class="smtxMX text-[green] text-center p-2"></div>
    </div>
    <div class="inputfielsa p-3 flex items-center justify-start gap-2 flex-col w-full">
        <div class="colT w-full flex items-center justify-center gap-2 flex-col">
            <div class="inputbox1 w-full flex-col justify-start gap-1 flex items-start">
                <label class=" p-1 w-full" for="">Account Email</label>
                <input placeholder="Email ??@gmail.com" class=" text-[green] text-sm p-2" type="text" name="" id="">
                <div class="sendcodeBtn brd cursor-pointer p-1 text-primary">
                    Send Code
                </div>
            </div>
            <div class="inputbox1 w-full flex-col justify-start gap-1 flex items-start">
                <label class=" p-1 w-full" for="">Verification Code Required:</label>
                <input placeholder="Email ??@gmail.com" class=" text-[green] text-sm p-2" type="text" name="" id="">
            </div>
        </div>
        <div class="colT w-full flex items-center gap-2 justify-center">
            <div class="inputbox1 w-full flex-col flex justify-start gap-1  items-start">
                <label class=" p-1 w-full" for="">New password:</label>
                <input placeholder="●●●●●●●●" class=" text-[green] text-sm p-2" type="text" name="" id="">
            </div>
        </div>
    </div>
    <div class="buttonSubmitnow p-2 w-full">
        <div class="submitbtn brd p-2 text-center cursor-pointer hover:bg-[var(--border)] w-full rounded-lg shadow-lg">
            I'm Done, Reset Now</div>
    </div>
    <div class="alreadyhaveBtn flex items-center justify-center text-center p-2 gap-2">
        <div class="leftT">
            I've changed my mind
        </div>
        <a href="?endpoint=login.php" class="addm link-primary cursor-pointer hover:underline">
            Try Login
        </a>
    </div>
</div>