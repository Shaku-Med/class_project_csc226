<?php
    session_start();

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $title = $_POST["title"];
        $author = $_POST["author"];
        $year = $_POST["year"];

        if (empty($title) || empty($author) || empty($year) || !preg_match("/^\d{4}$/", $year) || intval($year) < 2000 || intval($year) > date("Y")) {
            http_response_code(500);
            print('Invalid Data Input.');
        } elseif (count(explode(" ", trim($author))) < 2) {
            http_response_code(500);
            print('Please enter the full name of the Author to continue.');
        } else {
            $book = $_POST;
            
            if (!isset($_SESSION['book'])) {
                $_SESSION['book'] = array();
            }
            
            $_SESSION['book'][] = $book;
            
            header("Location: http://163.238.35.165/~amara/H4/books.php");
        }
    }
    else {
        die();
    }
?>