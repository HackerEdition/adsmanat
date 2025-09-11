-- Verification codes schema for ADSMANAT
-- Creates a table to store per-user, per-task short-link verification codes

CREATE TABLE IF NOT EXISTS verification_codes (
	id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	task_key VARCHAR(64) NOT NULL,
	tg_id BIGINT NULL,
	client_id VARCHAR(64) NULL,
	code VARCHAR(16) NOT NULL,
	status ENUM('pending','used','expired') NOT NULL DEFAULT 'pending',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	expires_at TIMESTAMP NULL DEFAULT NULL,
	INDEX idx_task_user (task_key, tg_id, client_id),
	INDEX idx_status (status),
	INDEX idx_created (created_at)
);

-- Optional safety: expire old pending codes periodically (run via cron, if desired)
-- UPDATE verification_codes SET status = 'expired' WHERE status = 'pending' AND expires_at IS NOT NULL AND expires_at < NOW();

