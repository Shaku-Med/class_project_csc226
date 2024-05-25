<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css"
        integrity="sha384-r4NyP46KrjDleawBgD5tp8Y7UzmLA05oM1iAEQ17CSuDqnUK2+k9luXQOfXJCJ4I" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <!--  -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&amp;display=swap"
        rel="stylesheet">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <!--  -->
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
        integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous">
    </script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js"
        integrity="sha384-oesi62hOLfzrys4LxRF63OJCXdXDipiYWBnvTl9Y9/TRlw5xlKIEHpNyvvDShgf/" crossorigin="anonymous">
    </script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://cdn.tailwindcss.com"></script>

    <script defer src="https://unpkg.com/axios/dist/axios.min.js"></script>

    <link rel="stylesheet" href="https://clp-one.vercel.app/static/css/main.508625f0.css">

    <title>Books</title>

    <link defer rel="stylesheet" href="style.css">

    <link rel="shortcut icon" href="logo.ico" type="image/x-icon">
    <link rel="apple-touch-icon" href="logo.ico">

</head>

<body>

    <table class="w-full fixed top-0 left-0 h-full overflow-auto">
        <tr class="">
            <th>#</th>
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
            <th>ID</th>
        </tr>
        <?php
            require("./output.php");
            // 
            if(isset($_SESSION['book'])){
                bookOut($_SESSION['book'], true, null);
            }
            else {
                echo `<h1 clas="font-bold text-center p-2 w-full">NO BOOK FOUND</h1>`;
            }
        ?>
    </table>


</body>

</html>