<?php
require 'header.php';
require 'database.php';

$db = new Database();
$conn = $db->getConnection();

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$response = ['status' => 'error'];

$stmt = $conn->prepare("SELECT id, filename, font_name, preview_image FROM fonts");
if (!$stmt) {
    die(json_encode(['status' => 'error', 'message' => 'Failed to prepare SQL statement: ' . $conn->error]));
}

$stmt->execute();
$stmt->bind_result($id, $filename, $font_name, $preview_image);

$fonts = [];
while ($stmt->fetch()) {
    $fonts[] = [
        'id' => $id,
        'filename' => $filename,
        'font_name' => $font_name,
        'preview_image' => base64_encode($preview_image) // Encode binary image data to Base64
    ];
}

$stmt->close();
$conn->close();

echo json_encode(['status' => 'success', 'fonts' => $fonts]);
?>
