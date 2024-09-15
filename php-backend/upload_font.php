<?php
require 'vendor/autoload.php'; // Ensure you have the correct path to autoload.php
use FontLib\Font\TrueType;

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "password";
$dbname = "font-group";

// Connect to the database
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Function to generate a preview image
function generateFontPreview($fontPath, $text = "Example Style") {
    $fontSize = 20;
    $imageWidth = 400;
    $imageHeight = 100;

    // Create a blank image
    $image = imagecreatetruecolor($imageWidth, $imageHeight);
    if ($image === false) {
        die(json_encode(["error" => "Failed to create image."]));
    }

    $backgroundColor = imagecolorallocate($image, 255, 255, 255); // White background
    $fontColor = imagecolorallocate($image, 0, 0, 0); // Black text
    imagefill($image, 0, 0, $backgroundColor);

    // Load the font and add text to image
    if (file_exists($fontPath)) {
        imagettftext($image, $fontSize, 0, 10, 40, $fontColor, $fontPath, $text);
    } else {
        imagedestroy($image);
        die(json_encode(["error" => "Font file not found."]));
    }

    // Capture the image output and save to variable
    ob_start();
    imagejpeg($image); // Output image as JPEG
    $imageData = ob_get_contents();
    ob_end_clean();

    imagedestroy($image);

    return $imageData;
}

// Check if file was uploaded
if (isset($_FILES['font'])) {
    $fontFile = $_FILES['font'];
    $filename = $fontFile['name'];
    $fileData = file_get_contents($fontFile['tmp_name']);

    // Check if file data was successfully read
    if (!$fileData) {
        die(json_encode(["error" => "Failed to read the uploaded font file."]));
    }

    // Determine font name using the FontLib library
    try {
        $font = \FontLib\Font::load($fontFile['tmp_name']);
        $font->parse();
        $fontName = $font->getFontFullName();
        $font->close();
    } catch (Exception $e) {
        $fontName = "Unknown";
    }

    // Generate font preview image
    $previewImageData = generateFontPreview($fontFile['tmp_name']);

    // Prepare SQL statement to insert the font data and preview image into the database
    $stmt = $conn->prepare("INSERT INTO fonts (filename, file_data, preview_image, font_name) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        die(json_encode(["error" => "SQL prepare failed: " . $conn->error]));
    }

    // Use "sssb" for string, binary, string, and string data binding
    $stmt->bind_param("ssss", $filename, $fileData, $previewImageData, $fontName);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Font and preview image uploaded successfully!", "fontName" => $fontName]);
    } else {
        echo json_encode(["error" => "Failed to upload font and preview image: " . $stmt->error]);
    }

    // Close statement
    $stmt->close();
} else {
    echo json_encode(["error" => "No font file uploaded."]);
}

// Close the database connection
$conn->close();
?>
