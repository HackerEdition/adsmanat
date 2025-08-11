-- Create tables for ADSMANAT
CREATE TABLE IF NOT EXISTS users (
  telegram_user_id BIGINT PRIMARY KEY,
  username VARCHAR(64) NULL,
  first_name VARCHAR(255) NULL,
  last_name VARCHAR(255) NULL,
  photo_url VARCHAR(512) NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS balances (
  telegram_user_id BIGINT PRIMARY KEY,
  tickets INT NOT NULL DEFAULT 0,
  adscoin INT NOT NULL DEFAULT 0,
  azn DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  updated_at DATETIME NOT NULL,
  CONSTRAINT fk_bal_user FOREIGN KEY (telegram_user_id) REFERENCES users(telegram_user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ad_counters (
  telegram_user_id BIGINT PRIMARY KEY,
  viewed_today INT NOT NULL DEFAULT 0,
  last_view_date DATE NOT NULL,
  CONSTRAINT fk_ad_user FOREIGN KEY (telegram_user_id) REFERENCES users(telegram_user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;