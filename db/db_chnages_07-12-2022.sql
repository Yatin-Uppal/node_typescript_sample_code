
ALTER TABLE `charaka_202207271321`.`user_product_replacements_groups` 
ADD COLUMN `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP AFTER `product_id`,
ADD COLUMN `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

ALTER TABLE `charaka_202207271321`.`user_product_replacements_groups` 
CHANGE COLUMN `group_id` `group_id` BIGINT NOT NULL AUTO_INCREMENT ,
CHANGE COLUMN `product_id` `product_id` BIGINT NOT NULL ;


ALTER TABLE `charaka_202207271321`.`user_product_formulations` 
ADD COLUMN `created_by` bigint  DEFAULT NULL AFTER `created_at`,
ADD COLUMN `updated_by` bigint DEFAULT NULL AFTER `updated_at`;


ALTER TABLE `charaka_202207271321`.`user_product_replacements_groups` 
ADD COLUMN `created_by` bigint  DEFAULT NULL AFTER `created_at`,
ADD COLUMN `updated_by` bigint DEFAULT NULL AFTER `updated_at`;


--------------------------------------------------------------------------------------------------------

CREATE TABLE `charaka`.`user_product_formulations` (
  `formulation_id` BIGINT NOT NULL AUTO_INCREMENT,
  `formulation_name` VARCHAR(100) NOT NULL,
  `product_id` BIGINT NOT NULL,
  `status` TINYINT NULL DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`formulation_id`));


CREATE TABLE `charaka`.`user_product_formulation_details` (
  `formulation_id` BIGINT NOT NULL,
  `replacement_group_id` BIGINT NULL DEFAULT '0',
  `additives_plant_replacement_id` BIGINT NULL DEFAULT '0',
  `additive_id` BIGINT NULL DEFAULT '0',
  `percentage` BIGINT NOT NULL);



  CREATE TABLE `user_product_formulation_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_product_id` bigint unsigned DEFAULT NULL,
  `user_product_formulation_id` bigint unsigned DEFAULT NULL,
  `comment` text,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB ;


CREATE TABLE `user_product_formulation_log_files` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_product_formulation_log_id` bigint unsigned DEFAULT NULL,
  `file` varchar(45) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `user_product_formulation_log_tags` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_product_formulation_log_id` bigint unsigned DEFAULT NULL,
  `tag` varchar(100) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;