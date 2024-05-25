<div id="root" class="w-full h-full">
    <div class="ftch relative h-full w-full text-center flex items-center justify-center flex-col gap-2 uppercase">
        <div class="boldTextCt flex flex-col items-center justify-center flex-wrap">
            <div class="iconhere">
                <img class=" h-[15rem] w-[15rem] min-w-[15rem] min-h-[15rem]"
                    src="http://163.238.35.165/~amara/PROJECT/php/Icons/favicon.ico" alt="" />
            </div>
            <div class="boldTxt absolute bottom-[40px] uppercase text-center text-2xl opacity-[.6] ">
                TALKATIVE
            </div>
        </div>
    </div>
</div>

<div class="Addts fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none">
    <?php include ("http://163.238.35.165/~amara/PROJECT/php/UI/Effects/Particles.php"); ?>
</div>

<script type="text/babel" src="http://163.238.35.165/~amara/PROJECT/php/UI/Main/Pages/Home/CT.js"></script>
<script type="text/babel" src="http://163.238.35.165/~amara/PROJECT/php/UI/Main/Pages/Home/Error.js"></script>
<script type="text/babel" src="http://163.238.35.165/~amara/PROJECT/php/UI/Main/Pages/Home/Likes.js"></script>
<script type="text/babel" src="http://163.238.35.165/~amara/PROJECT/php/UI/Main/Pages/Home/Comment.js"></script>
<script type="text/babel" src="http://163.238.35.165/~amara/PROJECT/php/UI/Main/Pages/Home/Data.js"></script>
<script type="text/babel" src="http://163.238.35.165/~amara/PROJECT/php/UI/Main/Pages/Home/Img.js"></script>
<script type="text/babel" src="http://163.238.35.165/~amara/PROJECT/php/UI/Main/Pages/Home/Picture.js"></script>
<script type="text/babel" src="http://163.238.35.165/~amara/PROJECT/php/UI/Main/Pages/Home/PV.js"></script>
<script type="text/babel" src="http://163.238.35.165/~amara/PROJECT/php/UI/Main/Pages/Home/chat.js"></script>
<script type="text/babel" src="http://163.238.35.165/~amara/PROJECT/php/UI/Main/Pages/Layouts/Nav/Prev.js"></script>
<script type="text/babel" src="http://163.238.35.165/~amara/PROJECT/php/UI/Main/Pages/Layouts/Nav/Nav.js"></script>
<script type="text/babel" src="http://163.238.35.165/~amara/PROJECT/php/UI/Main/Pages/Home/home.js"></script>
<script type="text/babel" src="http://163.238.35.165/~amara/PROJECT/php/UI/Main/Pages/Home/Posts.js"></script>
<!--  -->
<script type="text/babel">
    // 
    let owner;
    let reqdata;
    let ownerId = Obj.encDec(sessionStorage.getItem('auth'), Obj.Window().split(/\s+/).join(''), true)

    let Re = () => {
        if (keys) {
            let callBack = (data, e) => {
                const container = document.querySelector(`#root`);
                const root = ReactDOM.createRoot(container);
                if (e) {
                    root.render(<Error />)
                }
                else {
                    owner = data
                    root.render(<App />)
                }
            }
            // 
            Data(callBack)
        }
        else {
            setTimeout(Re, 1000)
        }
    }

    Re()

</script>