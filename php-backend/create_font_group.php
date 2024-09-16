<?php
require 'header.php';
require 'database.php';

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$db = new Database();
$conn = $db->getConnection();

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['group_name']) && isset($data['fonts'])) {
    $group_name = $conn->real_escape_string($data['group_name']);
    $fonts = $data['fonts'];


    $stmt = $conn->prepare("INSERT INTO font_groups (name) VALUES (?)");
    $stmt->bind_param("s", $group_name);
    $stmt->execute();
    $group_id = $stmt->insert_id;
    $stmt->close();

    $stmt = $conn->prepare("INSERT INTO font_group_fonts (group_id, font_id) VALUES (?, ?)");
    foreach ($fonts as $font) {
        $font_id = intval($font['font_id']);
        $stmt->bind_param("ii", $group_id, $font_id);
        $stmt->execute();
    }
    $stmt->close();

    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data']);
}

$conn->close();
?>
