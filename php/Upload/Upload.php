<?php
function create_directory($dir)
{
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
}
function attempt_upload($fileTmpName, $targetFilePath)
{
    return move_uploaded_file($fileTmpName, $targetFilePath);
}

if ($_FILES && isset($_POST['date']) && isset($_POST['user_id']) && isset($_POST['uid']) && isset($_POST['index'])) {
    $date = $_POST['date'];
    $u_id = $_POST['user_id'];
    $uid = $_POST['uid'];
    $index = $_POST['index'];
    // 
    $targetDir = "Files/" . $u_id . "/" . $date . "/";

    create_directory($targetDir);

    $file = $_FILES['file'];
    $fileTmpName = $file['tmp_name'];
    $fileError = $file['error'];

    if ($fileError === 0) {
        $uniqueName = $uid . "_" . $index;
        $targetFilePath = $targetDir . $uniqueName;

        $uploadSuccess = false;
        $attempts = 0;
        $maxAttempts = 3;

        while ($attempts < $maxAttempts && !$uploadSuccess) {
            if (attempt_upload($fileTmpName, $targetFilePath)) {
                $uploadSuccess = true;
                header('content-type: application/json');
                echo json_encode(array('success' => true, 'file_path' => $date . "/" . $uid));
            } else {
                $attempts++;
            }
        }

        if (!$uploadSuccess) {
            http_response_code(500);
            echo "Failed to upload file after {$maxAttempts} attempts.";
        }
    } else {
        http_response_code(400);
        echo "Error uploading file: " . $fileError;
    }
} else {
    http_response_code(400);
    echo "No file or date provided.";
}
?>