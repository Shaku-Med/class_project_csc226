<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,viewport-fit=cover">
    <title>Student Information</title>
     <link rel="stylesheet" href="http://163.238.35.165/~amara/H1/index.css">
    <link rel="shortcut icon" href="http://163.238.35.165/~amara/H1/logo.png" type="image/x-icon">
    <link rel="apple-touch-icon" href="http://163.238.35.165/~amara/H1/logo.png">
    <style>
        body {
            display: flex; 
            align-items: center;
            justify-content: center;
        }
        table {
            border-collapse: collapse;
            width: 80%;
            margin: 20px auto;
            background-color: var(--maiinBg);
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--border);
            color: var(--mainCl);
        }
        th {
            background: var(--border)
        }
        tr{
            background-color: var(--maiinBg);
        }
        
        td:nth-child(2) {
            background-color: var(--maiinBg);
        }        
        tr:hover {
            background-color: var(--dim);
        }
        .container {
            width: 100%;
            max-width: 80%;
            margin: 20px auto;
            background-color: var(--dim);
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 20px;
            max-height: 600px;
            overflow-x: hidden;
            overflow-y: auto;
            transition: .3s ease-in-out;
            min-width: 250px;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
            word-break: break-all;
        }

        @media screen and (max-height: 500px) {
           .container  {
               max-height: 300px;
           } 
        }
    </style>
</head>
<body>
    <div class="container">
        <?php
            $name = "Mohamed Amara";
            $credits = 15;
            $decimalValue = 3.14;
            $age = 19;

            echo "<table>";
            echo "<tr><th>Type</th><th>Value</th></tr>";
            echo "<tr><td>" . gettype($name) . "</td><td>$name</td></tr>";
            echo "<tr><td>" . gettype($credits) . "</td><td>$credits</td></tr>";
            echo "<tr><td>" . gettype($decimalValue) . "</td><td>$decimalValue</td></tr>";
            echo "<tr><td>" . gettype($age) . "</td><td>$age</td></tr>";
            echo "</table>";

            echo "<h2>Welcome, $name!</h2>";
            if ($credits >= 12) {
                echo "<p>FULL TIME STUDENT</p>";
            } else {
                echo "<p>PART TIME STUDENT</p>";
            }

            echo "<h3>Server Information:</h3>";
            echo "<p>File Name: " . $_SERVER['SCRIPT_FILENAME'] . "</p>";
            echo "<p>Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
            echo "<p>Host IP Address: " . $_SERVER['SERVER_ADDR'] . "</p>";
            echo "<p>User Agent: " . $_SERVER['HTTP_USER_AGENT'] . "</p>";
            echo "<p>YOUR IP ADDRESS (IPv4): " . $_SERVER['REMOTE_ADDR'] . "</p>";
            echo "<p>Current Date: " . date("F j, Y, g:i a") . "</p>";

            $headers = getallheaders();
            echo "<h3>Request Headers:</h3>";
            foreach ($headers as $header => $value) {
                echo "<p>$header: $value </p>";
            }        

            // File upload form
            echo "<h3>Upload Files:</h3>";
            echo '<form action="upload.php" method="post" enctype="multipart/form-data">';
            echo '<input type="file" name="fileToUpload[]" id="fileToUpload" multiple>';
            echo '<input type="submit" value="Upload Files" name="submit">';
            echo '</form>';
        ?>
    </div>
</body>
</html>
