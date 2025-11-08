<?php
// Legacy PHP contact endpoint (archived). Renamed to avoid filename conflict with serverless function.
// Original file moved here on migration to Vercel serverless API (contact.js).

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// The implementation is identical to the previous contact.php and kept as an archival copy.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) { $data = $_POST; }

$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$message = isset($data['message']) ? trim($data['message']) : '';

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
    exit;
}

// Minimal archival response
echo json_encode(['success' => true, 'message' => 'Legacy PHP endpoint preserved (no live sending on Vercel).']);
?>
