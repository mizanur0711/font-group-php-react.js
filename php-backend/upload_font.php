<?php
require 'header.php';
require 'vendor/autoload.php';
use FontLib\Font;
require 'database.php';

$db = new Database();
$conn = $db->getConnection();

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

function generateFontPreview($fontPath, $text = "Example Style") {
    $fontSize = 20;
    $imageWidth = 400;
    $imageHeight = 100;

    $image = imagecreatetruecolor($imageWidth, $imageHeight);
    if ($image === false) {
        return false;
    }

    $backgroundColor = imagecolorallocate($image, 255, 255, 255);
    $fontColor = imagecolorallocate($image, 0, 0, 0);
    imagefill($image, 0, 0, $backgroundColor);

    if (file_exists($fontPath)) {
        imagettftext($image, $fontSize, 0, 10, 40, $fontColor, $fontPath, $text);
    } else {
        imagedestroy($image);
        return false;
    }


    ob_start();
    imagejpeg($image);
    $imageData = ob_get_contents();
    ob_end_clean();

    imagedestroy($image);

    return $imageData;
}

if (isset($_FILES['font'])) {
    $fontFile = $_FILES['font'];
    $filename = $fontFile['name'];

    if ($fontFile['error'] !== UPLOAD_ERR_OK) {
        die(json_encode(["error" => "File upload error. Code: " . $fontFile['error']]));
    }

    $fileData = file_get_contents($fontFile['tmp_name']);
    if (!$fileData) {
        die(json_encode(["error" => "Failed to read the uploaded font file."]));
    }

    try {
        $font = \FontLib\Font::load($fontFile['tmp_name']);
        $font->parse();
        $fontName = $font->getFontFullName();
        $font->close();
    } catch (Exception $e) {
        $fontName = "Unknown";
    }

    $previewImageData = generateFontPreview($fontFile['tmp_name']);
    if (!$previewImageData) {
        die(json_encode(["error" => "Failed to generate font preview image."]));
    }

    $stmt = $conn->prepare("INSERT INTO fonts (filename, file_data, preview_image, font_name) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        die(json_encode(["error" => "SQL prepare failed: " . $conn->error]));
    }

    $stmt->bind_param("ssss", $filename, $fileData, $previewImageData, $fontName);

    if ($stmt->execute()) {
        echo json_encode(["status" => 'success', "message" => "Font and preview image uploaded successfully!", "fontName" => $fontName]);
    } else {
        echo json_encode(["error" => "Failed to upload font and preview image: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "No font file uploaded."]);
}

$conn->close();
?>
