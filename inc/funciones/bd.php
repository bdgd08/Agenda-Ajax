<?php

define('DB_USUARIO', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');
define('DB_NOMBRE', 'agendaphp');

$conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE);

//Si sale 1 la conexión a la base de datos se dio, si no sale nada o cero es porque no xd
// echo $conn->ping();


 ?>
