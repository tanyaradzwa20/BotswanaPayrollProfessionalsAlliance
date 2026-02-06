<?php
// Import PHPMailer classes into the global namespace
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load environment variables from .env file
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        // Remove quotes if present
        if (preg_match('/^"(.*)"$/', $value, $matches)) {
            $value = $matches[1];
        } elseif (preg_match("/^'(.*)'$/", $value, $matches)) {
            $value = $matches[1];
        }
        
        $_ENV[$name] = $value;
        putenv("$name=$value");
    }
    return true;
}

// Load .env file
loadEnv(__DIR__ . '/.env');

// Load PHPMailer files
require __DIR__ . '/PHPMailer/Exception.php';
require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';

// Security headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Set default response
$response = ['success' => false, 'message' => 'An unknown error occurred.'];

// Check if form was submitted via POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Get and sanitize form data
$name = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$membership = isset($_POST['membership']) ? trim(strip_tags($_POST['membership'])) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = "Name is required";
}

if (empty($email)) {
    $errors[] = "Email is required";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format";
}

if (empty($membership)) {
    $errors[] = "Membership type is required";
}

if (empty($message)) {
    $errors[] = "Message is required";
}

// If there are validation errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => implode(", ", $errors)]);
    exit;
}

// Map membership type to readable text
$membership_types = [
    'trainee' => 'Payroll Trainee Membership',
    'professional' => 'Payroll Professional Membership',
    'corporate' => 'Payroll Corporate Membership',
    'inquiry' => 'General Inquiry'
];

$membership_text = isset($membership_types[$membership]) ? $membership_types[$membership] : $membership;

// Prepare email using PHPMailer
$mail = new PHPMailer(true);

try {
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host       = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['SMTP_USER'];
    $mail->Password   = $_ENV['SMTP_PASS'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $_ENV['SMTP_PORT'];
    
    // Recipients
    $mail->setFrom($_ENV['SMTP_USER'], 'BPPA Website');
    $mail->addAddress('info@bppabw.com', 'BPPA');
    $mail->addReplyTo($email, $name);
    
    // Content
    $mail->isHTML(false);
    $mail->Subject = 'BPPA Contact Form: ' . $membership_text;
    $mail->Body    = "New contact form submission from BPPA website\n\n" .
                    "Name: " . $name . "\n" .
                    "Email: " . $email . "\n" .
                    "Phone: " . ($phone ?: 'Not provided') . "\n" .
                    "Membership Type: " . $membership_text . "\n\n" .
                    "Message:\n" . $message . "\n\n" .
                    "---\n" .
                    "Sent from BPPA Contact Form\n" .
                    "Date: " . date('Y-m-d H:i:s');
    
    $mail->send();
    http_response_code(200);
    $response['success'] = true;
    $response['message'] = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
    
} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = "Sorry, there was an error sending your message. Please try again or contact us directly at info@bppabw.com. Error: {$mail->ErrorInfo}";
}

// Send JSON response
echo json_encode($response);
?>
