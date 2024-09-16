<?php
require 'header.php';
require 'database.php';

$db = new Database();
$conn = $db->getConnection();

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

if (isset($_POST['id'])) {
    $id = intval($_POST['id']);

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

$conn->close();
?>
