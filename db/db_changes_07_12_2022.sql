CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_product_id` BIGINT UNSIGNED,
  `title` text,
  `description` text,
  `document_path` varchar(255) DEFAULT '',
  `status` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT UNSIGNED DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`user_product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `support_tickets_comments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`BIGINT UNSIGNED,
  `support_ticket_id` BIGINT UNSIGNED,
  `comment` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `created_by` BIGINT UNSIGNED,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` BIGINT UNSIGNED,
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`support_ticket_id`),
  KEY `user_id` (`user_id`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;