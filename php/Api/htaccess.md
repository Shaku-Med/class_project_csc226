<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /Project

    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^(.*)$ php/Api/app.php [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^(.*)$ php/Api/app.php [L]

</IfModule>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>

DirectoryIndex index.php
