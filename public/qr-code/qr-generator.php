<?php
require_once __DIR__ . '/vendor/autoload.php';
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
$options = new QROptions(
    [
        'eccLevel' => QRCode::ECC_L,
        'outputType' => QRCode::OUTPUT_MARKUP_SVG,
        'version' => 10,
    ]
);
$qrcode = (new QRCode($options))->render( get_permalink(strip_tags($payment_array->post_id, "")) . '&transactionRef=' . $payment_array->transactionRef);
?>

<img src='<?= $qrcode ?>' alt='QR Code' width='80' height='80'>