-- ADSMANAT Database Schema
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `if0_39059246_adcmanat` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `if0_39059246_adcmanat`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `telegram_id` bigint(20) NOT NULL UNIQUE,
    `username` varchar(255) DEFAULT NULL,
    `first_name` varchar(255) NOT NULL,
    `last_name` varchar(255) DEFAULT NULL,
    `photo_url` text DEFAULT NULL,
    `language` varchar(10) DEFAULT 'az',
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` tinyint(1) DEFAULT 1,
    PRIMARY KEY (`id`),
    KEY `idx_telegram_id` (`telegram_id`),
    KEY `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User balances table
CREATE TABLE IF NOT EXISTS `user_balances` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `bilet_balance` int(11) DEFAULT 0,
    `adscoin_balance` int(11) DEFAULT 0,
    `azn_balance` decimal(10,3) DEFAULT 0.000,
    `ad_count` int(11) DEFAULT 0,
    `last_ad_date` date DEFAULT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_id` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ad watching history
CREATE TABLE IF NOT EXISTS `ad_history` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `ad_type` varchar(50) DEFAULT 'standard',
    `reward` int(11) DEFAULT 1,
    `watched_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `ip_address` varchar(45) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_watched_at` (`watched_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Wheel spins history
CREATE TABLE IF NOT EXISTS `wheel_spins` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `bilet_cost` int(11) DEFAULT 1,
    `adscoin_won` int(11) DEFAULT 0,
    `azn_won` decimal(10,3) DEFAULT 0.000,
    `spun_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_spun_at` (`spun_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task completions
CREATE TABLE IF NOT EXISTS `task_completions` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `task_type` varchar(50) NOT NULL,
    `task_id` varchar(100) DEFAULT NULL,
    `reward` int(11) DEFAULT 0,
    `completed_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `verification_code` varchar(20) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_task_type` (`task_type`),
    KEY `idx_completed_at` (`completed_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Withdrawal requests
CREATE TABLE IF NOT EXISTS `withdrawal_requests` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `platform` varchar(50) NOT NULL,
    `account_number` varchar(100) NOT NULL,
    `amount_adscoin` int(11) NOT NULL,
    `amount_azn` decimal(10,3) NOT NULL,
    `status` enum('pending','approved','rejected') DEFAULT 'pending',
    `requested_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `processed_at` timestamp NULL DEFAULT NULL,
    `admin_notes` text DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_status` (`status`),
    KEY `idx_requested_at` (`requested_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events participation
CREATE TABLE IF NOT EXISTS `event_participations` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `event_id` varchar(50) NOT NULL,
    `event_name` varchar(255) NOT NULL,
    `reward` int(11) DEFAULT 0,
    `participated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `status` enum('active','completed','expired') DEFAULT 'active',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_event_id` (`event_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity logs
CREATE TABLE IF NOT EXISTS `activity_logs` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) DEFAULT NULL,
    `action` varchar(100) NOT NULL,
    `details` text DEFAULT NULL,
    `ip_address` varchar(45) DEFAULT NULL,
    `user_agent` text DEFAULT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_action` (`action`),
    KEY `idx_created_at` (`created_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verification codes
CREATE TABLE IF NOT EXISTS `verification_codes` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `code` varchar(20) NOT NULL,
    `task_type` varchar(50) NOT NULL,
    `is_used` tinyint(1) DEFAULT 0,
    `expires_at` timestamp NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_code` (`code`),
    KEY `idx_expires_at` (`expires_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- System settings
CREATE TABLE IF NOT EXISTS `system_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL UNIQUE,
    `setting_value` text NOT NULL,
    `description` text DEFAULT NULL,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default system settings
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `description`) VALUES
('daily_ad_limit', '20', 'Maximum ads per day per user'),
('bilet_to_adscoin_rate', '1', 'Bilet to ADSCOIN conversion rate'),
('adscoin_to_azn_rate', '0.001', 'ADSCOIN to AZN conversion rate'),
('min_withdrawal_adscoin', '3000', 'Minimum withdrawal amount in ADSCOIN'),
('wheel_spin_cost', '1', 'Cost in bilet for wheel spin'),
('app_version', '1.0.0', 'Current app version'),
('maintenance_mode', '0', 'Maintenance mode (0=off, 1=on)')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- Create indexes for better performance
CREATE INDEX `idx_users_created_at` ON `users`(`created_at`);
CREATE INDEX `idx_ad_history_date` ON `ad_history`(DATE(`watched_at`));
CREATE INDEX `idx_wheel_spins_date` ON `wheel_spins`(DATE(`spun_at`));
CREATE INDEX `idx_task_completions_date` ON `task_completions`(DATE(`completed_at`));
CREATE INDEX `idx_withdrawal_requests_date` ON `withdrawal_requests`(DATE(`requested_at`));

-- Create views for common queries
CREATE OR REPLACE VIEW `user_stats` AS
SELECT 
    u.id,
    u.telegram_id,
    u.username,
    u.first_name,
    ub.bilet_balance,
    ub.adscoin_balance,
    ub.azn_balance,
    ub.ad_count,
    ub.last_ad_date,
    u.created_at
FROM `users` u
LEFT JOIN `user_balances` ub ON u.id = ub.user_id
WHERE u.is_active = 1;

-- Create view for daily ad counts
CREATE OR REPLACE VIEW `daily_ad_counts` AS
SELECT 
    user_id,
    DATE(watched_at) as ad_date,
    COUNT(*) as ad_count
FROM `ad_history`
GROUP BY user_id, DATE(watched_at);

-- Create view for withdrawal summary
CREATE OR REPLACE VIEW `withdrawal_summary` AS
SELECT 
    user_id,
    COUNT(*) as total_requests,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_requests,
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_requests,
    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_requests,
    SUM(amount_azn) as total_withdrawn_azn
FROM `withdrawal_requests`
GROUP BY user_id;