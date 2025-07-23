<?php
/**
 * Timezone Helper for Vietnam (UTC+7)
 * Provides functions to handle time in Vietnam timezone
 */

function getVietnamDateTime($format = 'Y-m-d H:i:s') {
    date_default_timezone_set('Asia/Ho_Chi_Minh');
    return date($format);
}

function getVietnamTimestamp() {
    date_default_timezone_set('Asia/Ho_Chi_Minh');
    return time();
}

function getVietnamDate($format = 'Y-m-d') {
    date_default_timezone_set('Asia/Ho_Chi_Minh');
    return date($format);
}

function getVietnamDateTimeForDB() {
    date_default_timezone_set('Asia/Ho_Chi_Minh');
    return date('Y-m-d H:i:s');
}

function logWithVietnamTime($message, $logFile = 'debug.log') {
    date_default_timezone_set('Asia/Ho_Chi_Minh');
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
}

// Set default timezone for the entire application
date_default_timezone_set('Asia/Ho_Chi_Minh');
?>
