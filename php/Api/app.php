<?php


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './vendor/phpmailer/phpmailer/src/Exception.php';
require './vendor/phpmailer/phpmailer/src/PHPMailer.php';
require './vendor/phpmailer/phpmailer/src/SMTP.php';

$mail = new PHPMailer(true);

// 

include ('./Headers.php');
include ('./Functions.php');
include "../Db/db.php";


// print_r($c->get_result());

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$request_uri = $_SERVER['REQUEST_URI'];
// Spaces ...
$fn = new Functions($conn, $mail);
// 
function destroy($req, $res, $isText, $status)
{
    try {
        if ($isText) {
            http_response_code($status);
            header('Content-Type: ' . (is_array($isText) ? 'application/json' : 'text/html'));
            // 
            echo is_array($isText) ? json_encode($isText) : $isText;
        } else {
            http_response_code(500);
        }
    } catch (Exception $e) {
        http_response_code(404);
    }
}

$auth = isset($_SERVER['HTTP_A']) ? $_SERVER['HTTP_A'] : null;
$islogin = isset($_SERVER['HTTP_ISLOGIN']) ? $_SERVER['HTTP_ISLOGIN'] : null;

if ($auth) {
    if (preg_match("#/v/#", $request_uri)) {
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'get') {
            $fn->getV($_SERVER, 'destroy', $auth, 1, null);
        } else {
            http_response_code(500);
        }
    } else if (preg_match("#/k/#", $request_uri)) {
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'get') {
            $fn->getV($_SERVER, 'destroy', $auth, null, null);
        } else {
            http_response_code(500);
        }
    } else if (preg_match("#/sl/#", $request_uri)) {
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'post') {
            $f = $fn->getV($_SERVER, 'destroy', $auth, null, true);
            // // 
            if ($f) {
                $fn->sL($_SERVER, 'destroy', $data, null, $islogin === 'true' ? true : null);
            } else {
                http_response_code(401);
            }
        } else {
            http_response_code(401);
            include ('./About.html');
        }
    } else if (preg_match("#/f/#", $request_uri)) {
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'post') {
            $f = $fn->getV($_SERVER, 'destroy', $auth, null, true);
            // // 
            if ($f) {
                $ep = 'https://api226.vercel.app/decrypt';
                $d = $fn->isAuth($data, $ep, $_SERVER, true, $data);
                if ($d) {
                    $j = json_decode($d, true);
                    // 
                    $d = $fn->isExist($j['email'], true, $j['istrue'], null);
                    if ($d) {
                        if ($d['v_code'] === $j['vcode']) {
                            $v_code = '';
                            $gt = $j['email'];
                            $isv = true;
                            // 
                            $q = "UPDATE users SET is_verified = ?, v_code = ? WHERE email = ?";
                            $st = $conn->prepare($q);
                            $st->bind_param('iss', $isv, $v_code, $gt);
                            // 
                            $sent = $fn->SendEmail($j['email'], 'Welcome to Talkative 🗣️🗣️🗣️🗣️💬🗨️, Your account has been verified.', 'Hi ' . $d['name'] . ', <br> <p> Your email has been verified, Now you can login to your account. Enjoy your time. </p>');
                            if ($sent) {
                                // 
                                $st->execute();
                                $st->close();
                                // 
                                echo json_encode(array("success" => true), true);
                                http_response_code(200);
                            } else {
                                http_response_code(401);
                            }

                        } else {
                            echo "Invalid verification code.";
                            http_response_code(422);
                        }
                    } else {
                        echo "Un-verified data provided";
                        http_response_code(422);
                    }
                } else {
                    http_response_code(401);
                }
            } else {
                http_response_code(401);
            }
        } else {
            http_response_code(401);
            include ('./About.html');
        }
    } else if (preg_match("#/re/#", $request_uri)) {
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'get') {
            $f = $fn->getV($_SERVER, 'destroy', $auth, null, true);
            // // 
            if ($f) {
                $d = $fn->isExist($_GET['to'], true, false, null);
                if ($d) {
                    // This might result into email spamming. That's Y I added a one click action then clear the session after submit.
                    // I know updating the v_code is not secure cuz. any one can change their email to someones email to update. but this is a class proj...
                    $v_code = substr(str_replace('-', '', $fn->uuid()), 0, 6);
                    $gt = $_GET['to'];
                    // 
                    $q = "UPDATE users SET v_code = ? WHERE email = ?";
                    $st = $conn->prepare($q);
                    $st->bind_param('ss', $v_code, $gt);
                    $sent = $fn->SendEmail($d['email'], 'Account Email Verification Resent. From Talkative, 🫡🫡🫡', 'Hi ' . $d['name'] . ', <br> Below is your resent account verification code to unlock your account. <br> Use this code <strong style="font-size: 30px; color: blue;">' . $v_code . '</strong> to unlock your account. Now. <br> <hr> If this email was not sent by you, ignore.');
                    if ($sent) {
                        // 
                        $st->execute();
                        $st->close();
                        // 
                        echo json_encode(array("success" => true), true);
                        http_response_code(200);
                    } else {
                        http_response_code(401);
                    }
                } else {
                    http_response_code(401);
                }
            } else {
                http_response_code(401);
            }
        } else {
            http_response_code(401);
            include ('./About.html');
        }
    } else if (preg_match("#/owner#", $request_uri)) {
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'get') {
            $f = $fn->getV($_SERVER, 'destroy', $auth, null, true);
            // // 
            if ($f) {
                $where = 'user_id';
                $d = $fn->isExist($_GET['id'], true, true, $where);
                if ($d) {
                    $d['password'] = null;
                    $d['v_code'] = null;
                    $d['info'] = json_decode($d['info'], true);
                    $d['alert'] = json_decode($d['alert'], true);
                    $d['login_track'] = json_decode($d['login_track'], true);
                    $d['contacts'] = json_decode($d['contacts'], true);
                    $d['device_access'] = json_decode($d['device_access'], true);
                    $d['id'] = '';
                    $d['is_verified'] = $d['is_verified'] ? true : false;
                    $d['account_pin'] = strlen(trim($d['account_pin'])) > 0 ? true : false;
                    // 
                    header('content-type: application/json');
                    echo json_encode([$d], true);
                    // 
                } else {
                    echo 'logout';
                    http_response_code(401);
                }
            } else {
                http_response_code(401);
            }
        } else {
            http_response_code(401);
            include ('./About.html');
        }
    } else if (preg_match("#/post#", $request_uri)) {
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'post') {
            $f = $fn->getV($_SERVER, 'destroy', $auth, null, true);
            // // 
            if ($f) {
                $ep = 'https://api226.vercel.app/decrypt';
                $d = $fn->isAuth($data, $ep, $_SERVER, true, $data);
                if ($d) {
                    $j = json_decode($d, true);
                    // 
                    $where = 'user_id';
                    $d = $fn->isExist($j['owner_id'], true, true, $where);
                    if ($d) {
                        if ($j['action_type']) {
                            $wh = "WHERE owner_id = ? AND post_id = ?";
                            $upd = $j['type'];

                            if (preg_match('/\b(post_privacy|allow_comments|delete)\b/i', $upd)) {
                                $sql = $upd === 'delete' ? "DELETE FROM post $wh" : "UPDATE post SET $upd = ? $wh";
                                $stmt = $conn->prepare($sql);
                                // 
                                if (!$stmt) {
                                    http_response_code(502);
                                    echo "🥺🥺🥺 Unable to perform action.";
                                    exit;
                                }

                                if ($j['type'] === 'delete') {
                                    $stmt->bind_param('ss', $j['owner_id'], $j['post_id']);
                                } else {
                                    $init = $j['initial'];
                                    if ($upd === 'allow_comments') {
                                        $nini = $init ? false : true;
                                        $stmt->bind_param('iss', $nini, $j['owner_id'], $j['post_id']);
                                    } else {
                                        $nini = $init ? 'private' : 'public';
                                        $stmt->bind_param('sss', $nini, $j['owner_id'], $j['post_id']);
                                    }
                                }

                                if (!$stmt->execute()) {
                                    http_response_code(502);
                                    echo "🥺🥺🥺 Unable to access your account";
                                    exit;
                                }

                                $stmt->close();
                                destroy($_REQUEST, 'destroy', array("success" => true), 200);

                            } else {
                                http_response_code(401);
                            }

                        } else {
                            $stmt = $conn->prepare("INSERT INTO post (post_id, post_thread, is_main_post, post_time, owner_id, post_privacy, allow_comments, allow_repost, post_body, post_locked, post_type, has_repost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                            // 
                            if (!$stmt) {
                                http_response_code(502);
                                echo "🥺🥺🥺 Unable to post.";
                                exit;
                            }
                            $postlock = false;
                            $rpost = '';
                            $ar = $j['post_thread'];
                            $stmt->bind_param('ssssssiisiss', $j['post_id'], json_encode($ar), $j['is_main_post'], $j['post_time'], $j['owner_id'], $j['privacy'], $j['allowcm'], $j['allowrp'], json_encode($j['text']), $postlock, $j['post_type'], $rpost);
                            if ($j['islast']) {
                                $sent = $fn->SendEmail($d['email'], '🎊🎊🎊🎊 New post added 🎊🎊🎊🎊', 'Hey ' . $d['name'] . ', <br> <br> Your new post has been uploaded 🎊🎊🎊🎊🎊🎊🎊🎊🎊. <br> <br> <a target="_blank" href="">View Post</a> <br><br> <h1>EMAIL FROM TALKATIVE.</h1>');
                            }
                            // 
                            if (!$stmt->execute()) {
                                http_response_code(502);
                                echo "🥺🥺🥺 Unable to access your account";
                                exit;
                            }

                            $stmt->close();
                            destroy($_REQUEST, 'destroy', array("success" => true), 200);
                        }
                    } else {
                        echo 'logout';
                        http_response_code(401);
                    }
                } else {
                    http_response_code(401);
                }

            } else {
                http_response_code(401);
            }
        } else {
            http_response_code(401);
            include ('./About.html');
        }
    } else if (preg_match("#/data#", $request_uri)) {
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'post') {
            $f = $fn->getV($_SERVER, 'destroy', $auth, null, true);
            if ($f) {
                // error_reporting(1);
                $ep = 'https://api226.vercel.app/decrypt';
                $d = $fn->isAuth($data, $ep, $_SERVER, true, $data);
                if ($d) {
                    $j = json_decode($d, true);
                    $next_index = isset($j['next_index']) ? intval($j['next_index']) : 0;
                    $limit = 50;  // Number of records per page
                    $offset = $next_index * $limit;

                    $where = 'user_id';
                    $d = $fn->isExist($j['owner_id'], true, true, $where);
                    if ($d) {
                        $c = json_decode($d['contacts'], true);

                        // GET USERS, I did this to save time..
                        $sql = "SELECT * FROM users WHERE user_id != ? LIMIT ? OFFSET ?";
                        $stmt = $conn->prepare($sql);
                        $stmt->bind_param('sii', $d['user_id'], $limit, $offset);
                        $stmt->execute();
                        $result = $stmt->get_result();

                        $users = array();
                        if ($result->num_rows > 0) {
                            while ($row = $result->fetch_assoc()) {

                                $row['password'] = null;
                                $row['v_code'] = null;
                                $row['email'] = null;
                                $row['hidden_id'] = null;
                                $row['info'] = json_decode($row['info'], true);
                                $row['alert'] = null;
                                $row['login_track'] = null;
                                $row['contacts'] = null;
                                $row['device_access'] = null;
                                $row['id'] = '';
                                $row['is_verified'] = null;
                                $row['account_pin'] = null;

                                $users[] = $row;
                            }
                        }
                        $has_more_users = $result->num_rows == $limit;

                        // Get posts
                        $pv = 'public';
                        $issl = false;
                        $sql = "SELECT p.* FROM post p LEFT JOIN likes l ON p.post_id = l.post_id AND l.owner_id = ? WHERE (p.owner_id = ? AND p.post_privacy != ? OR p.post_privacy = ? ) AND p.post_locked = ? ORDER BY COALESCE(l.like_id, 0) DESC, p.post_id DESC LIMIT ? OFFSET ?";
                        $stmt = $conn->prepare($sql);
                        $stmt->bind_param('ssssiii', $d['user_id'], $d['user_id'], $pv, $pv, $issl, $limit, $offset);
                        $stmt->execute();
                        $result = $stmt->get_result();

                        $post = array();
                        if ($result->num_rows > 0) {
                            while ($row = $result->fetch_assoc()) {
                                $row['post_body'] = json_decode($row['post_body'], true);
                                $row['post_thread'] = json_decode($row['post_thread'], true);
                                $row['allow_comments'] = $row['allow_comments'] ? true : false;
                                $row['allow_repost'] = $row['allow_repost'] ? true : false;
                                $row['post_locked'] = $row['post_locked'] ? true : false;
                                $row['post_privacy'] = $row['post_privacy'] === 'public' ? true : false;
                                $row['id'] = null;
                                // 
                                $post[] = $row;
                            }
                        }
                        $has_more_posts = $result->num_rows == $limit;

                        // Get Comments
                        $sql = "SELECT * FROM post_comments LIMIT ? OFFSET ?";
                        $stmt = $conn->prepare($sql);
                        $stmt->bind_param('ii', $limit, $offset);
                        $stmt->execute();
                        $result = $stmt->get_result();

                        $post_comments = array();
                        if ($result->num_rows > 0) {
                            while ($row = $result->fetch_assoc()) {
                                $row['comment_body'] = json_decode($row['comment_body'], true);
                                $post_comments[] = $row;
                            }
                        }
                        $has_more_comments = $result->num_rows == $limit;

                        // Get Likes
                        $sql = "SELECT * FROM likes LIMIT ? OFFSET ?";
                        $stmt = $conn->prepare($sql);
                        $stmt->bind_param('ii', $limit, $offset);
                        $stmt->execute();
                        $result = $stmt->get_result();

                        $likes = array();
                        if ($result->num_rows > 0) {
                            while ($row = $result->fetch_assoc()) {
                                $likes[] = $row;
                            }
                        }
                        $has_more_likes = $result->num_rows == $limit;

                        // comment_likes
                        $sql = "SELECT * FROM comment_likes LIMIT ? OFFSET ?";
                        $stmt = $conn->prepare($sql);
                        $stmt->bind_param('ii', $limit, $offset);
                        $stmt->execute();
                        $result = $stmt->get_result();

                        $comment_likes = array();
                        if ($result->num_rows > 0) {
                            while ($row = $result->fetch_assoc()) {
                                $comment_likes[] = $row;
                            }
                        }
                        $has_more_comment_likes = $result->num_rows == $limit;

                        // Determine if there's more data to fetch
                        $has_more_data = $has_more_users || $has_more_posts || $has_more_comments || $has_more_likes || $has_more_comment_likes;
                        $next_index = $has_more_data ? $next_index + 1 : null;

                        $output = array(
                            'users' => $users,
                            'post' => $post,
                            'post_comments' => $post_comments,
                            'likes' => $likes,
                            'next_index' => $next_index,
                            'comment_likes' => $comment_likes
                        );

                        header('Content-Type: application/json');
                        echo json_encode($output);
                    } else {
                        echo 'logout';
                        http_response_code(401);
                    }
                } else {
                    http_response_code(401);
                }
            } else {
                http_response_code(401);
            }
        } else {
            http_response_code(401);
            include ('./About.html');
        }


    } else if (preg_match("#/like#", $request_uri)) {
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'post') {
            $f = $fn->getV($_SERVER, 'destroy', $auth, null, true);
            // // 
            if ($f) {
                error_reporting(1);
                $ep = 'https://api226.vercel.app/decrypt';
                $d = $fn->isAuth($data, $ep, $_SERVER, true, $data);
                if ($d) {
                    $j = json_decode($d, true);
                    // 
                    $where = 'user_id';
                    $d = $fn->isExist($j['owner_id'], true, true, $where);
                    if ($d) {
                        $lk = !$j['like_type'] ? 'comment_likes' : 'likes';
                        $slq = "SELECT * FROM $lk WHERE owner_id = ? AND post_id = ?";
                        $sqlm = $conn->prepare($slq);

                        if (!$sqlm) {
                            http_response_code(502);
                            echo "🥺🥺🥺 Unable to like.";
                            exit;
                        }

                        $sqlm->bind_param("ss", $j['owner_id'], $j['post_id']);
                        if (!$sqlm->execute()) {
                            http_response_code(502);
                            echo "🥺🥺🥺 Unable to access your account";
                            exit;
                        }
                        // 
                        $result = $sqlm->get_result();
                        if ($result->num_rows > 0) {
                            $sqlm->close();
                            // 
                            $stmt = $conn->prepare("DELETE FROM $lk WHERE owner_id = ? AND post_id = ?");
                            if (!$stmt) {
                                http_response_code(502);
                                echo "🥺🥺🥺 Unable to Unlike.";
                                exit;
                            }

                            $stmt->bind_param("ss", $j['owner_id'], $j['post_id']);
                            if (!$stmt->execute()) {
                                http_response_code(502);
                                echo "🥺🥺🥺 Unable to Unlike.";
                                $stmt->close();
                                exit;
                            }

                            $stmt->close();
                            destroy($_REQUEST, 'destroy', array("success" => true), 200);


                        } else {
                            $stmt = $conn->prepare("INSERT INTO $lk (like_id, owner_id, post_id, liked_time) VALUES (?, ?, ?, ?)");
                            // 
                            if (!$stmt) {
                                http_response_code(502);
                                echo "🥺🥺🥺 Unable to post.";
                                exit;
                            }

                            $stmt->bind_param('ssss', $j['like_id'], $j['owner_id'], $j['post_id'], $j['liked_time']);

                            if (!$stmt->execute()) {
                                http_response_code(502);
                                echo "🥺🥺🥺 Unable to access your account";
                                exit;
                            }

                            $stmt->close();
                            destroy($_REQUEST, 'destroy', array("success" => true), 200);
                        }
                    } else {
                        echo "Invalid";
                        http_response_code(404);
                    }
                } else {
                    http_response_code(402);
                }

            } else {
                http_response_code(403);
            }
        } else {
            http_response_code(401);
            include ('./About.html');
        }
    } else if (preg_match("#/comment#", $request_uri)) {
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'post') {
            $f = $fn->getV($_SERVER, 'destroy', $auth, null, true);
            // // 
            if ($f) {
                error_reporting(1);
                $ep = 'https://api226.vercel.app/decrypt';
                $d = $fn->isAuth($data, $ep, $_SERVER, true, $data);
                if ($d) {
                    $j = json_decode($d, true);
                    // 
                    $where = 'user_id';
                    $d = $fn->isExist($j['owner_id'], true, true, $where);
                    if ($d) {
                        if ($j['action_type']) {
                            $where = $j['isAdmin'] ? "WHERE comment_id = ?" : "WHERE comment_id = ? AND owner_id = ?";
                            $sql = $j['action_type'] === 'delete' ? "DELETE FROM post_comments $where" : "UPDATE post_comments SET comment_body = ? $where";
                            $stmt = $conn->prepare($sql);

                            if (!$stmt) {
                                http_response_code(502);
                                echo "🥺🥺🥺 Unable to post.";
                                exit;
                            }

                            if ($j['action_type'] === 'delete') {
                                if ($j['isAdmin']) {
                                    $vard = $j['comment_id'];
                                    $stmt->bind_param('s', $vard);
                                } else {
                                    $comment_id = $j['comment_id'];
                                    $owner_id = $j['owner_id'];
                                    $stmt->bind_param('ss', $comment_id, $owner_id);
                                }
                            } else {
                                $comment_body = json_encode($j['comment_body']);
                                // 
                                if ($j['isAdmin']) {
                                    $comment_id = $j['comment_id'];
                                    $stmt->bind_param('ss', $comment_body, $comment_id);
                                } else {
                                    $comment_id = $j['comment_id'];
                                    $owner_id = $j['owner_id'];
                                    $stmt->bind_param('sss', $comment_body, $comment_id, $owner_id);
                                }
                            }

                            if (!$stmt->execute()) {
                                http_response_code(502);
                                echo "🥺🥺🥺 Unable to execute.";
                                exit;
                            }

                            $stmt->close();
                            destroy($_REQUEST, 'destroy', array("success" => true), 200);
                        } else {
                            $stmt = $conn->prepare("INSERT INTO post_comments (post_id, comment_id, comment_type, owner_id, comment_body, is_reply, comment_time) VALUES (?, ?, ?, ?, ?, ?, ?)");
                            // 
                            if (!$stmt) {
                                http_response_code(502);
                                echo "🥺🥺🥺 Unable to post.";
                                exit;
                            }
                            $postlock = false;
                            $rpost = '';
                            $stmt->bind_param('sssssss', $j['post_id'], $j['comment_id'], $j['comment_type'], $j['owner_id'], json_encode($j['comment_body']), $j['is_reply'], $j['comment_time']);

                            if (!$stmt->execute()) {
                                http_response_code(502);
                                echo "🥺🥺🥺 Unable to access your account";
                                exit;
                            }

                            $stmt->close();
                            destroy($_REQUEST, 'destroy', array("success" => true), 200);
                        }
                    } else {
                        echo 'logout';
                        http_response_code(401);
                    }
                } else {
                    http_response_code(401);
                }

            } else {
                http_response_code(401);
            }
        } else {
            http_response_code(401);
            include ('./About.html');
        }
    } else if (preg_match("#/user_update#", $request_uri)) {
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'post') {
            $f = $fn->getV($_SERVER, 'destroy', $auth, null, true);
            // // 
            if ($f) {
                error_reporting(1);
                $ep = 'https://api226.vercel.app/decrypt';
                $d = $fn->isAuth($data, $ep, $_SERVER, true, $data);
                if ($d) {
                    $j = json_decode($d, true);
                    // 
                    $where = 'user_id';
                    $d = $fn->isExist($j['owner_id'], true, true, $where);
                    if ($d) {
                        $where = "WHERE user_id = ? AND hidden_id = ? AND cookie_id = ? AND is_verified = ? AND is_locked = ?";

                        if (!preg_match('/\b(email|pass|device|user_id|account_pin|device_access|cookie_id)\b/i', $j['where'])) {

                            $wh = $j['where'];
                            $sql = "UPDATE users SET $wh = ? $where";
                            $stmt = $conn->prepare($sql);

                            if (!$stmt) {
                                http_response_code(502);
                                echo "🥺🥺🥺 Unable to post.";
                                exit;
                            }
                            $isl = '';
                            $isv = $j['is_verified'];
                            $stmt->bind_param('ssssis', $j['update'], $j['user_id'], $j['hidden_id'], $j['cookie_id'], $isv, $isl);

                            if (!$stmt->execute()) {
                                http_response_code(502);
                                echo "🥺🥺🥺 Unable to execute.";
                                exit;
                            }

                            $stmt->close();
                            destroy($_REQUEST, 'destroy', array("success" => true), 200);

                        } else {
                            http_response_code(401);
                        }
                    } else {
                        echo 'logout';
                        http_response_code(401);
                    }
                } else {
                    http_response_code(401);
                }

            } else {
                http_response_code(401);
            }
        } else {
            http_response_code(401);
            include ('./About.html');
        }
    } else if (preg_match("#/chat#", $request_uri)) {
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'post') {
            $f = $fn->getV($_SERVER, 'destroy', $auth, null, true);
            // // 
            if ($f) {
                error_reporting(1);
                $ep = 'https://api226.vercel.app/decrypt';
                $d = $fn->isAuth($data, $ep, $_SERVER, true, $data);
                if ($d) {
                    $j = json_decode($d, true);
                    // 
                    $where = 'user_id';
                    $d = $fn->isExist($j['owner_id'], true, true, $where);
                    if ($d) {
                        $m = $fn->isExist($j['receivers_id'], true, true, $where);
                        if ($m) {
                            $uj = json_decode($m['contacts'], true);
                            $oj = json_decode($d['contacts'], true);
                            // 
                            $chb = array_filter($uj, function ($contact) use ($j) {
                                return isset ($contact['id'], $contact['blocked']) && $contact['id'] === $j['owner_id'] && $contact['blocked'] === true;
                            });
                            $cob = array_filter($oj, function ($contact) use ($j) {
                                return isset ($contact['id'], $contact['blocked']) && $contact['id'] === $j['receivers_id'] && $contact['blocked'] === true;
                            });
                            // 
                            $is_restrict = !empty($chb) || !empty($cob) ? true : false;
                            $who_sees = !empty($chb) || !empty($cob) ? json_encode([$j['owner_id']]) : json_encode($j['who_sees']);
                            $read = $j['message_read'];
                            // 
                            // 
                            if ($j['action_type']) {
                                if ($j['action_type'] === 'delete') {
                                    $st = $j['onlyme'];
                                    if ($st) {

                                        $sl = "SELECT * FROM chats WHERE ((owner_id = ? AND receivers_id = ?) OR (receivers_id = ? AND owner_id = ?)) AND message_id = ?";
                                        $stm = $conn->prepare($sl);
                                        $stm->bind_param('sssss', $j['contact_id'], $j['owner_id'], $j['contact_id'], $j['owner_id'], $j['message_id']);
                                        $stm->execute();
                                        $result = $stm->get_result();
                                        if ($result->num_rows > 0) {
                                            while ($row = $result->fetch_assoc()) {
                                                if (!stripos($row['who_sees'], $j['owner_id'])) {
                                                    // 
                                                    $js = json_decode($row['who_sees'], true);
                                                    $ist = 1;
                                                    $js[] = $j['owner_id'];
                                                    $tr = json_encode($js);
                                                    $dl = "UPDATE chats SET is_restrict = ?, who_sees = ? WHERE ((owner_id = ? AND receivers_id = ?) OR (receivers_id = ? AND owner_id = ?)) AND message_id = ?";
                                                    $ini = $conn->prepare($dl);

                                                    $ini->bind_param('sssssss', $ist, $tr, $j['owner_id'], $j['contact_id'], $j['contact_id'], $j['owner_id'], $j['message_id']);
                                                    $ini->execute();
                                                    $ini->close();
                                                    // 
                                                    http_response_code(200);
                                                    echo "Only your contact can see this message from now on. til they also remove it..";
                                                }
                                            }
                                        } else {
                                            http_response_code(404);
                                            echo "Unable to delete.";
                                        }
                                        $stm->close();
                                    } else {

                                        $sq = "DELETE FROM chats WHERE owner_id = ? AND receivers_id = ? AND message_id = ?";
                                        $pr = $conn->prepare($sq);
                                        $pr->bind_param('sss', $j['owner_id'], $j['contact_id'], $j['message_id']);
                                        $pr->execute();
                                        $pr->close();
                                        // 
                                        http_response_code(200);
                                        echo "Message has been permanently erased.";

                                    }
                                } else {
                                    $ed = $j['edited'];
                                    $sq = "UPDATE chats SET messages =?, edited = ? WHERE owner_id = ? AND receivers_id = ? AND message_id = ?";
                                    $pr = $conn->prepare($sq);
                                    $pr->bind_param('sisss', $j['message'], $ed, $j['owner_id'], $j['receivers_id'], $j['message_id']);
                                    $pr->execute();
                                    $pr->close();
                                    // 
                                    http_response_code(200);
                                    echo "Your message has been edited..";
                                }
                            } else {
                                $sql = $j['action_type'] ? "" : "INSERT INTO chats (message_id, owner_id, receivers_id, message_time, who_sees, message_read, message_reactions, message_type, messages, is_restrict, edited, is_reply, message_thread, is_main_message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                $stmt = $conn->prepare($sql);
                                // 
                                $stmt->bind_param('sssssisssiisss', $j['message_id'], $j['owner_id'], $j['receivers_id'], $j['message_time'], $who_sees, $read, $j['message_reactions'], $j['message_type'], $j['message'], $is_restrict, $j['edited'], $j['is_reply'], $j['message_thread'], $j['is_main_message']);
                                // 
                                if (!$stmt->execute()) {
                                    http_response_code(401);
                                    echo "Failed to send";
                                }
                                $stmt->close();
                                echo "Message sent.";
                            }
                            // 
                        } else {
                            http_response_code(401);
                        }
                    } else {
                        echo 'logout';
                        http_response_code(401);
                    }
                } else {
                    http_response_code(401);
                }

            } else {
                http_response_code(401);
            }
        } else {
            http_response_code(401);
            include ('./About.html');
        }
    } else if (preg_match("#/getchats#", $request_uri)) {
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'post') {
            $f = $fn->getV($_SERVER, 'destroy', $auth, null, true);
            // // 
            if ($f) {
                error_reporting(1);
                $ep = 'https://api226.vercel.app/decrypt';
                $d = $fn->isAuth($data, $ep, $_SERVER, true, $data);
                if ($d) {
                    $j = json_decode($d, true);
                    // 
                    $where = 'user_id';
                    $d = $fn->isExist($j['owner_id'], true, true, $where);
                    if ($d) {
                        $page = $j['next_page'];
                        $perPage = 1000;

                        $offset = ($page - 1) * $perPage;

                        $sql = "SELECT * FROM chats WHERE (owner_id = ? AND receivers_id = ?) OR (receivers_id = ? AND owner_id = ?) LIMIT ? OFFSET ?";
                        $stmt = $conn->prepare($sql);
                        $stmt->bind_param('ssssii', $j['contact_id'], $j['owner_id'], $j['contact_id'], $j['owner_id'], $perPage, $offset);
                        $stmt->execute();
                        $result = $stmt->get_result();

                        if ($result->num_rows > 0) {
                            $chats = array();
                            while ($row = $result->fetch_assoc()) {
                                $row['message_thread'] = json_decode($row['message_thread'], true);
                                $row['message_reactions'] = json_decode($row['message_reactions'], true);
                                $row['messages'] = json_decode($row['messages'], true);
                                $row['message_read'] = $row['message_read'] ? true : false;
                                $row['edited'] = $row['edited'] ? true : false;
                                $row['is_restrict'] = $row['is_restrict'] ? true : false;
                                // 
                                if ($row['is_restrict']) {
                                    if (!strpos($row['who_sees'], $j['owner_id'])) {
                                        $row['who_sees'] = json_decode($row['who_sees'], true);
                                        $chats[] = $row;
                                    }
                                } else {
                                    $row['who_sees'] = json_decode($row['who_sees'], true);
                                    $chats[] = $row;
                                }
                            }
                            if (!empty($chats)) {
                                // $nj = ["next_page" => $offset + $result->num_rows, "data" => $chats];
                                echo json_encode($chats);
                            }
                        } else {
                            http_response_code(200);
                            echo json_encode([]);
                        }

                        $stmt->close();

                    } else {
                        echo 'logout';
                        http_response_code(401);
                    }
                } else {
                    http_response_code(401);
                }

            } else {
                http_response_code(401);
            }
        } else {
            http_response_code(401);
            include ('./About.html');
        }
    } else {
        http_response_code(404);
        include ('./About.html');
    }
} else {
    http_response_code(500);
    include ('./About.html');
}