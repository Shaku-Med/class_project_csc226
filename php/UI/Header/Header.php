<?php
$request_uri = strtolower($_SERVER['REQUEST_URI']);
$is_chat_page = !strpos($request_uri, 'login') && !strpos($request_uri, 'signup');
$title = isset($_SESSION['user_id']) ? 'Talkative' : ($is_chat_page ? 'Talkative' : 'Login / Signup');
$description = "Join $title, your ultimate online chatting destination. Connect with like-minded individuals, engage in lively conversations, and share your thoughts on a wide range of topics!";
$keywords = "$title, online chatting, chat rooms, connect with people, conversations, community";
$application_name = $title;
?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover">
    <!-- GOOGLE DORKING HELPER AND COLORATIONS. -->
    <meta name="theme-color" content="#fff" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
    <meta property="og:title" content="Silvi" />
    <meta property="og:type" content="article" />
    <meta property="og:image" content="http://163.238.35.165/~amara/PROJECT/php/Icons/favicon.ico" />
    <meta property="og:description" content="<?php echo $description ?>" />
    <meta name="description" content="<?php echo $description ?>" />
    <meta name="keywords" content="<?php echo $keywords ?>">
    <meta name="author" content="medzy amara" />
    <meta name="copyright" content="@medzy.amara.1" />
    <meta name="application-name" content="<?php echo $application_name ?>" />
    <!-- LINK TREE (😉)(ICONS and others.) -->
    <link rel="canonical" href="http://163.238.35.165/~amara/PROJECT/php/UI/Index.php">
    <title><?php echo $title ?></title>
    <link rel="shortcut icon" href="http://163.238.35.165/~amara/PROJECT/php/Icons/favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" href="http://163.238.35.165/~amara/PROJECT/php/Icons/favicon.ico">
    <link rel="manifest" href="http://163.238.35.165/~amara/PROJECT/php/icons/manifest.json">
    <!-- BOOTSTRAP LIBRARIES AND styles -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <!-- TAILWINDCSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/typify.js@1.1.9/dist/typify.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
    <script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
    <!--  -->
    <!--  -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.8/axios.min.js"
        integrity="sha512-PJa3oQSLWRB7wHZ7GQ/g+qyv6r4mbuhmiDb8BjSFZ8NZ2a42oTtAq5n0ucWAwcQDlikAtkub+tPVCw4np27WCg=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <!--  -->
    <script src="https://cdn.jsdelivr.net/npm/party-js@latest/bundle/party.min.js"></script>
    <script src="http://163.238.35.165/~amara/PROJECT/php/Scripts/Functions.js"></script>
    <!--  -->
    <link rel="stylesheet" href="http://163.238.35.165/~amara/PROJECT/php/UI/Styles/App.css" defer>

    <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
    <!--  -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
    <script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>
    <!--  -->

    <!-- <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script> -->
    <script src="http://163.238.35.165/~amara/PROJECT/php/Scripts/development.js" crossorigin></script>
    <script src="http://163.238.35.165/~amara/PROJECT/php/Scripts/rdom.js" crossorigin></script>
    <script src="http://163.238.35.165/~amara/PROJECT/php/Scripts/babel.js"></script>


    <!-- Normalize CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
    <!-- Cropper CSS -->
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/cropper/2.3.4/cropper.min.css'>
    <!-- Cropper JS -->
    <script src='https://cdnjs.cloudflare.com/ajax/libs/cropperjs/0.8.1/cropper.min.js'></script>

    <!-- PURIFY HTML -->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.4/purify.min.js"
        integrity="sha512-W5fT2qIB5mnnYGQpzMLesMO7UmqtR7o712igk1FUXP+ftlu94UYDAngTS83l+0s3MwRmtqGDyWncZfiUjsCNHw=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    <!-- SWIPER -->

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

    <!-- SOCKET SERVER -->

    <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"
        integrity="sha384-2huaZvOR9iDzHqslqwpR87isEmrfxqyWOF7hr7BY6KG0+hVKLoEXMPUJw3ynWuhO" crossorigin="anonymous">
        </script>



</head>