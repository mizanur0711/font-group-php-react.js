<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "password";
$dbname = "font-group";

// Connect to the database
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Check if `id` is set in the POST request
if (isset($_POST['id'])) {
    $id = intval($_POST['id']);

    // Prepare the SQL statement to delete the font
    $stmt = $conn->prepare("DELETE FROM fonts WHERE id = ?");
    if ($stmt) {
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Font deleted successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error executing delete query: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "SQL statement preparation failed: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No ID provided"]);
}

// Close the database connection
$conn->close();
?>
