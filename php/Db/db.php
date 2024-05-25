<?php
include 'dc.php';

$conn = mysqli_connect($host, $username, $password, $database);

function reconnect(&$connection, $host, $username, $password, $database)
{
    mysqli_close($connection);
    try {
        $connection = mysqli_connect($host, $username, $password, $database);
        if (!$connection) {
            sleep(5);
            reconnect($connection, $host, $username, $password, $database);
        }
    } catch (Exception $e) {
        sleep(5);
        reconnect($connection, $host, $username, $password, $database);
    }
}


if ($conn->connect_error) {
    reconnect($conn, $host, $username, $password, $database);
}