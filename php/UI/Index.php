<?php
error_reporting(0);
session_start();
?>

<!doctype html>
<html lang="en">

<head>
    <?php include ("./Header/Header.php"); ?>
</head>

<body class="fixed top-0 left-0 overflow-hidden h-full w-full bg-[var(--mainBg)]">
    <?php
    try {
        if (isset($_SESSION['user_id'])) {
            include ('./Main/Main.php');
        } else {
            include ('./Auth/Login.php');
        }
    } catch (Exception $e) {
    }
    ?>

    <script src="http://163.238.35.165/~amara/PROJECT/php/Scripts/script.js"></script>

    <script>
        function showToast(message, type = "error") {
            Toastify({
                text: message,
                duration: 10000,
                close: true,
                gravity: "bottom", // top, bottom, left, right
                position: "center", // left, center, right
                backgroundColor: type === "success" ? "green" : "red"
            }).showToast();
        }
    </script>

    <?php
    try {
        if (isset($_SESSION['user_id'])) {
            echo '
              <script>
                CheckAuth("' . $_SESSION['user_id'] . '")
                setInterval(() => {
                    CheckAuth("' . $_SESSION['user_id'] . '")
                }, 2000)
              </script>
            ';
        }
    } catch (Exception $e) {

    }
    ?>

    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous">
        </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"
        integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" crossorigin="anonymous">
        </script>
</body>

</html>