-- ADSMANAT Database Setup
-- Use this SQL to create the necessary tables

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    profile_photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_balance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    tickets INT DEFAULT 0,
    adscoin INT DEFAULT 0,
    azn DECIMAL(10,3) DEFAULT 0.000,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ad_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    views_today INT DEFAULT 0,
    last_view_date DATE,
    total_views INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS withdrawals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10,3),
    m10_number VARCHAR(20),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks_completed (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    task_type VARCHAR(50),
    task_id VARCHAR(50),
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);