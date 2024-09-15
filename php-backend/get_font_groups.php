<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


$servername = "localhost";
$username = "root";
$password = "password";
$dbname = "font-group";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Query to get font groups and the comma-separated font names
$query = "
    SELECT fg.id, fg.name AS group_name,
        GROUP_CONCAT(f.font_name ORDER BY f.font_name ASC SEPARATOR ', ') AS font_names,
        COUNT(fgf.font_id) AS font_count
    FROM font_groups fg
    LEFT JOIN font_group_fonts fgf ON fg.id = fgf.group_id
    LEFT JOIN fonts f ON fgf.font_id = f.id
    GROUP BY fg.id
";

$result = $conn->query($query);

$groups = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $groups[] = $row;
    }
}

echo json_encode(["status" => "success", "groups" => $groups]);

$conn->close();
?>
