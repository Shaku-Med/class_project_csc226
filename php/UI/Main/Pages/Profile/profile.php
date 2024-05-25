<?php
$request_uri = strtolower($_SERVER['REQUEST_URI']);

if (strpos($request_uri, "/main/") !== false) {
    header('Location: http://163.238.35.165/~amara/PROJECT/php/UI/Index.php?endpoint=profile.php');
    exit;
}

?>


<div class="adnkkkeya">
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident facilis blanditiis et dicta, asperiores non
    repellat molestiae esse pariatur vitae laborum voluptatem laudantium optio, odio magni dolores eius possimus fugit!
</div>