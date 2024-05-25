<?php

$request_uri = strtolower($_SERVER['REQUEST_URI']);

if (strpos($request_uri, "/auth/") !== false) {
    header('Location: http://163.238.35.165/~amara/PROJECT/php/UI/Index.php');
    exit;
}

?>

<div class="mainContainer p-2 z-[1000] fixed top-0 left-0 w-full h-full flex items-center justify-center">
    <?php
    $request_uri = strtolower($_SERVER['REQUEST_URI']);
    $is_chat_page = !strpos($request_uri, 'signup.php');
    include (strpos($request_uri, 'sessions') ? './Auth/Log/sessions.php' : (strpos($request_uri, 'verify') ? './Auth/Verify.php' : ($is_chat_page ? (strpos($request_uri, 'forgot') ? './Auth/Log/Forgot/Reset.php' : './Auth/Log/Login.php') : './Auth/Log/Signup.php')));
    ?>

</div>

<script>
    try {
        const typingText = Typify('.ainsk', {
            text: ['$: sudo login or signup now.', '$: sudo su', '$: sudo access your account',
                '$: sudo secure request transfer from you to us.', '$: sudo become a member now.',
                '$: aircrack-ng map my account for updates.', '$: nano type/html, echo access granted.'
            ],
            delay: 100,
            loop: true,
            cursor: true,
            stringDelay: 1000,
        });

        const textElement = document.querySelector('.smtxMX');
        if (textElement) {
            const originalText = `SecurePasswords`;

            const scrambleText = () => {
                textElement.innerText = [...originalText].map(char => Math.random() < 0.5 ? String.fromCharCode(Math
                    .random() * 94 + 33) : char).join('');
                console.log()
            };

            setInterval(scrambleText, 200);
        }
    } catch { }
</script>

<?php include ("./Effects/Matrix.php"); ?>