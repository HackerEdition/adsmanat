-- MySQL schema for verification codes and task completions

CREATE TABLE IF NOT EXISTS verification_codes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id VARCHAR(64) NOT NULL,
  task_key VARCHAR(32) NOT NULL,
  code VARCHAR(16) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  created_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  used TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX idx_session_task (session_id, task_key, used),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS task_completions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id VARCHAR(64) NOT NULL,
  task_key VARCHAR(32) NOT NULL,
  completed_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_session_task (session_id, task_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

