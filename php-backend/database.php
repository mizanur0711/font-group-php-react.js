<?php

class Database {
    private $conn;

    public function __construct() {
        $uri = "paste connection details from mail/readme.md";
        $fields = parse_url($uri);

        $servername = $fields['host'];
        $port = $fields['port'];
        $dbname = 'defaultdb';
        $user = $fields['user'];
        $password = $fields['pass'];

        // Build the DSN including SSL settings
        $dsn = "mysql:host=$servername;port=$port;dbname=$dbname";

        // Connect to the database
        $this->conn = new mysqli($servername, $user, $password, $dbname, $port);

        // Check connection
        if ($this->conn->connect_error) {
            die(json_encode(["success" => false, "message" => "Connection failed: " . $this->conn->connect_error]));
        }

        // Set SSL options if needed
        if (defined('MYSQLI_CLIENT_SSL')) {
            $this->conn->ssl_set(null, null, 'ca.pem', null, null);
        }
    }

    public function getConnection() {
        return $this->conn;
    }
}
?>
