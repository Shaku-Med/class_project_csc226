# CODE REMOVED

### `FUNCTIONs.php`

### I removed this code, because I don't know how to use the same Crypto in php. I tried doing research but I don't have enough time to complete my research b4 the due date.

```php


    function encDec($data, $key, $isdec) {
    try {
        $iv = openssl_random_pseudo_bytes(16);

        if ($isdec) {
            $d = openssl_decrypt($data, 'AES-256-CBC', $key, 0, $iv);
            if ($d && $d !== '') {
                $dd = openssl_decrypt($d, 'AES-256-CBC', $key, 0, $iv);
                if ($dd) {
                    return $dd;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            $d = openssl_encrypt(openssl_encrypt($data, 'AES-256-CBC', $key, 0, $iv), 'AES-256-CBC', $key, 0, $iv);
            return $d;
        }
    } catch (Exception $e) {
        error_log($e);
        return null;
    }
}

```
