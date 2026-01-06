<?php
// Подключаем файл с секретами
// Символ @ нужен, чтобы не было ошибки, если файла нет (хотя он должен быть)
require_once __DIR__ . '/config.php';

/* Переменные $telegram_token и $telegram_chat_id теперь доступны здесь */

// Проверка на всякий случай
if (!isset($telegram_token) || !isset($telegram_chat_id)) {
    echo json_encode(['success' => false, 'error' => 'Config missing']);
    exit;
}

$token = $telegram_token;
$chat_id = $telegram_chat_id;

// Получаем JSON данные от React
$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    $name = $data['name'];
    $phone = $data['phone'];
    $method = $data['method']; // 'courier', 'postal', 'pickup'
    $address = $data['address'] ?? 'Не указан';
    $comment = $data['comment'] ?? 'Нет';
    $items = $data['items'];
    $total = $data['total'];

    // Формируем красивый текст для Телеграма
    // Разные иконки для разных способов доставки
    $deliveryIcon = '🚚';
    $methodText = 'Доставка по Гродно';
    
    if ($method === 'postal') {
        $deliveryIcon = '📦';
        $methodText = 'Почта (Беларусь)';
    } elseif ($method === 'pickup') {
        $deliveryIcon = '🏃';
        $methodText = 'Самовывоз';
    }

    $msg = "🍯 <b>НОВЫЙ ЗАКАЗ!</b>\n\n";
    $msg .= "👤 <b>Имя:</b> " . strip_tags($name) . "\n";
    $msg .= "📞 <b>Телефон:</b> " . strip_tags($phone) . "\n";
    $msg .= $deliveryIcon . " <b>Способ:</b> " . $methodText . "\n";
    
    if ($method !== 'pickup') {
        $msg .= "🏠 <b>Адрес:</b> " . strip_tags($address) . "\n";
    }
    
    if ($comment !== 'Нет' && $comment !== '') {
        $msg .= "💬 <b>Комментарий:</b> " . strip_tags($comment) . "\n";
    }

    $msg .= "\n🛒 <b>КОРЗИНА:</b>\n";
    
    foreach ($items as $item) {
        // Форматируем строку товара: "Мёд Липа (500г) x 2 шт = 50 BYN"
        $variant = $item['variant']['size'];
        $sum = $item['price'] * $item['quantity'];
        $msg .= "— " . $item['name'] . " (" . $variant . ") x " . $item['quantity'] . " шт\n";
    }

    $msg .= "\n💰 <b>ИТОГО: " . $total . " BYN</b>";

    // Отправляем запрос в Telegram API
    $url = "https://api.telegram.org/bot{$token}/sendMessage";
    $params = [
        'chat_id' => $chat_id,
        'text' => $msg,
        'parse_mode' => 'HTML'
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $result = curl_exec($ch);
    curl_close($ch);

    // Ответ сайту, что все ок
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'No data']);
}
?>