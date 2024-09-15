<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "password";
$dbname = "font-group";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
} else {
    echo json_encode(["status" => "success", "message" => "Connected to the database successfully!"]);
}

// Close connection
$conn->close();
?>
