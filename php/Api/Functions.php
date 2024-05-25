<?php
error_reporting(0);

class Functions
{

    private $conn;
    private $mail;

    public function __construct($conn, $mail)
    {
        $this->conn = $conn;
        $this->mail = $mail;
    }

    function isAuth($enc, $enpoint, $req, $ispost, $hasbody)
    {
        try {
            $url = $enpoint;
            $ch = curl_init($url);
            // 
            $isAuth = isset($req['HTTP_ISAUTH']) ? $req['HTTP_ISAUTH'] : 'false';
            $k = isset($req['HTTP_K']) ? $req['HTTP_K'] : 'null';
            // 

            $headers = array(
                'A: ' . $enc,
                'User-Agent: ' . $req['HTTP_USER_AGENT'],
                'accept-language: ' . $req['HTTP_ACCEPT_LANGUAGE'],
                'referer: ' . $req['HTTP_REFERER'],
                'isAuth: ' . $isAuth,
                'k: ' . $k,
                'content-type: application/json'
            );

            if ($hasbody) {
                $body = array('data' => $hasbody['data'], 'k' => $hasbody['k']);
                $jsonData = json_encode($body);
                // 
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                // 
            } else {
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPGET, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            }
            //
            $response = curl_exec($ch);
            //
            curl_close($ch);
            //
            if ($response) {
                return $response;
            } else {
                return null;
            }
        } catch (Exception $e) {
            return null;
        }
    }

    function getV($req, $res, $auth, $isv, $ispost)
    {
        try {
            if ($req) {
                if ($ispost) {
                    $ep = 'https://api226.vercel.app/v2';
                    return $this->isAuth($auth, $ep, $req, true, null);
                } else {
                    $d = explode(!$isv ? "/k/" : "/v/", $req['REQUEST_URI']);
                    if (isset($d[1])) {
                        $ep = !$isv ? 'https://api226.vercel.app/k/' . $d[1] . '' : 'https://api226.vercel.app/v/' . $d[1] . '';
                        echo $this->isAuth($auth, $ep, $req, null, null);
                    } else {
                        $res($req, $res, array("message" => "UnAuthorized Access"), 401);
                    }
                }
            } else {
                $res($req, $res, array("message" => "UnAuthorized Access"), 401);
            }
        } catch (Exception $e) {
            $res($req, $res, array("message" => "You don't have the given permission to access this endpoint!"), 401);
        }
    }

    function uuid(): string
    {
        $data = openssl_random_pseudo_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    function generateSalt()
    {
        return bin2hex(random_bytes(32));
    }

    function hashPassword($password, $salt)
    {
        $options = [
            'cost' => 12,
            'salt' => $salt
        ];
        // I HAD WANTED TO ENCRYPT THE PASSWORD AFTER HASHING TO MAKE INCASE A HACKER BREAKS IN TO THE DATABASE, THEY WOULD HAVE TO DECRYPT THE PASSWORDS FIRST B4 GUESSING THE PASSWORD (BRUTE FORCING)
        return password_hash($password, PASSWORD_BCRYPT, $options);
    }

    function verifyPassword($password, $hashedPassword)
    {
        return password_verify($password, $hashedPassword);
    }

    function isExist($email, $isResend, $istrue, $where)
    {
        $par = $isResend ? "SELECT * FROM users WHERE " . (!$where ? 'email' : $where) . " = ? AND is_verified = ?" : "SELECT COUNT(*) FROM users WHERE email = ?";
        // 
        $stmt = $this->conn->prepare($par);
        if (!$stmt) {
            http_response_code(502);
            echo "🥺🥺🥺 unable to find your data.";
            exit;
        }
        // 
        $count = 0;

        if ($isResend) {
            $isVerified = $istrue;
            $stmt->bind_param('ss', $email, $isVerified);
        } else {
            $stmt->bind_param('s', $email);
        }

        // 
        if (!$stmt->execute()) {
            http_response_code(502);
            echo "🥺🥺🥺 unable to find your data.";
            exit;
        }
        // 
        if (!$isResend) {
            $stmt->bind_result($count);
            $stmt->fetch();
            $stmt->close();

            return $count > 0;
        } else {
            $rl = $stmt->get_result();
            if ($rl->num_rows > 0) {
                $stmt->close();
                return $rl->fetch_assoc();
            } else {
                return null;
            }
        }
    }

    function SendEmail($email, $subject, $body)
    {
        try {
            $this->mail->isSMTP();
            $this->mail->Host = 'smtp.gmail.com';
            $this->mail->SMTPAuth = true;
            $this->mail->Username = 'mosesmafawundu@gmail.com';
            $this->mail->Password = 'tlotyjzerwuoewgx';
            $this->mail->SMTPSecure = 'tls';
            $this->mail->Port = 587;

            $this->mail->setFrom('mosesmafawundu@gmail.com', 'Talkative');
            $this->mail->addAddress($email);

            $this->mail->isHTML(true);
            $this->mail->Subject = $subject;
            $this->mail->Body = $body;

            $this->mail->send();
            // 
            return true;
        } catch (Exception $e) {
            return null;
        }
    }

    function sL($req, $res, $auth, $isv, $islogin)
    {
        // I wanted to add a corn-job, to automatically delete all unverified users 30 minutes after their signup. but that's a lot of work.
        // I'm gonna block them from login in instead and resend the verification code to their email on every login attempt. since this is just a school project....
        try {
            $ep = 'https://api226.vercel.app/decrypt';
            $d = $this->isAuth($auth, $ep, $req, true, $auth);
            if ($d) {
                $j = json_decode($d, true);
                $ix = $this->isExist($j['email'], $islogin ? true : false, $islogin ? true : false, null);
                if ($ix) {
                    if ($islogin) {
                        if ($ix['is_verified']) {
                            $pv = $this->verifyPassword($j['password'], $ix['password']);
                            if ($pv) {
                                $array = json_decode($ix['login_track'], true);
                                // 
                                $array[] = $j['device'];

                                $q = "UPDATE users SET login_track = ? WHERE email = ?";
                                $st = $this->conn->prepare($q);
                                $st->bind_param('ss', json_encode($array), $j['email']);

                                if (!$st->execute()) {
                                    http_response_code(502);
                                    echo "🥺🥺🥺 Content Failed.";
                                    exit;
                                }

                                $st->close();

                                $res($req, $res, array("success" => true, "user_id" => $ix['user_id']), 200);

                            } else {
                                http_response_code(401);
                                echo 'Wrong email or password, Please if you are having trouble logging in, reset your password.';
                            }
                        } else {
                            http_response_code(401);
                            echo 'You do not have access to this account, Please verify your email. before attempting to login.';
                        }
                    } else {
                        http_response_code(409);
                        echo 'Account already exist, please try logging in, or reset your password.';
                    }
                } else {
                    if ($islogin) {
                        http_response_code(404);
                        echo "Sorry, we did not find your account. \n \n This can be because your account is not verified or we don't have your account on file. \n\n If you don't have an account with us, please try creating one 😉😉😉";
                    } else {
                        $salt = $this->generateSalt();
                        $hashedPassword = $this->hashPassword($j['password'], $salt);

                        $stmt = $this->conn->prepare("INSERT INTO users (name, email, password, join_date, login_track, user_id, account_pin, device_access, hidden_id, cookie_id, alert, contacts, is_locked, is_verified, v_code, info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                        if (!$stmt) {
                            http_response_code(502);
                            echo "🥺🥺🥺 Unable to access your account";
                            exit;
                        }
                        $v_code = substr(str_replace('-', '', $this->uuid()), 0, 6);
                        // 
                        $null = '';
                        $isv = 0;
                        $nr = array("device" => $j['device']);
                        $stmt->bind_param('sssssssssssssiss', $j['name'], $j['email'], $hashedPassword, $j['date'], json_encode([$nr]), $this->uuid(), $null, json_encode([]), $this->uuid(), $this->uuid(), json_encode([]), json_encode([]), $null, $isv, $v_code, json_encode($j['info']));
                        $sent = $this->SendEmail($j['email'], 'Account Email Verification. From Talkative, 😉', 'Hi ' . $j['name'] . ', <br> Below is your account verification code to unlock your account. <br> Use this code <strong style="font-size: 30px; color: blue;">' . $v_code . '</strong> to unlock your account. <br> <hr> If this email was not sent by you, ignore.');

                        if ($sent) {
                            if (!$stmt->execute()) {
                                http_response_code(502);
                                echo "🥺🥺🥺 Unable to access your account";
                                exit;
                            }

                            $stmt->close();
                            $res($req, $res, array("success" => true), 200);
                        } else {
                            $stmt->close();
                            $res($req, $res, array("success" => true), 200);
                        }
                    }
                }
            } else {
                // FAKE RESPONSE TYPE. TELLING THE USER TO PAY : 🤣
                http_response_code(402);
            }
        } catch (Exception $e) {
            $res($req, $res, array("message" => "You don't have the given permission to access this endpoint!"), 401);
        }
    }
}