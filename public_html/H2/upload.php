<?php
$targetDir = "File/"; 
$uploadOk = 1;

foreach ($_FILES["fileToUpload"]["name"] as $key => $value) {
    $targetFile = $targetDir . basename($_FILES["fileToUpload"]["name"][$key]);
    $fileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    if (file_exists($targetFile)) {
        echo "Sorry, file already exists.";
        $uploadOk = 0;
    }

    if ($_FILES["fileToUpload"]["size"][$key] > 5000000) {
        echo "Sorry, your file is too large.";
        $uploadOk = 0;
    }

    $allowedFileTypes = array("txt", "pdf", "doc", "docx", "jpg", "jpeg", "png", "gif", "mp4", "avi", "mov", "mp3", "wav");
    if (!in_array($fileType, $allowedFileTypes)) {
        echo "Sorry, only TXT, PDF, DOC, DOCX, JPG, JPEG, PNG, GIF, MP4, AVI, MOV, MP3, WAV files are allowed.";
        $uploadOk = 0;
    }

    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
    } else {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"][$key], $targetFile)) {
            echo "The file ". basename( $_FILES["fileToUpload"]["name"][$key]). " has been uploaded.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
}
?>

