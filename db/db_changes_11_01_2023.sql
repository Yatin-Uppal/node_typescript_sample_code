ALTER TABLE `charaka_202207271321`.`additives_group_replacement_plants` 
ADD COLUMN `additives_plant_replacement_id` INT NOT NULL AFTER `additives_group_replacement_id`;


CREATE TABLE `charaka_202207271321`.`additive_group_replacement_log_files` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_product_replacement_group_log_id` BIGINT UNSIGNED NULL,
  `file` VARCHAR(255) NULL,
  `status` TINYINT NULL DEFAULT '1',
  `created_by` BIGINT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` BIGINT NULL,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));


ALTER TABLE `charaka_202207271321`.`additive_group_replacement_log_files` 
RENAME TO  `charaka_202207271321`.`additives_group_replacement_log_files` ;

ALTER TABLE `charaka_202207271321`.`additives_group_replacement_log_files` 
CHANGE COLUMN `user_product_replacement_group_log_id` `additive_replacement_group_log_id` BIGINT UNSIGNED NULL DEFAULT NULL ;

ALTER TABLE `charaka_202207271321`.`additives_group_replacement_log_files` 
DROP COLUMN `updated_by`,
DROP COLUMN `created_by`;

ALTER TABLE `charaka_202207271321`.`additives_group_replacement_log_files` 
CHANGE COLUMN `additive_replacement_group_log_id` `additive_replacement_group_log_id` BIGINT UNSIGNED NOT NULL ;


CREATE TABLE `charaka_202207271321`.`additives_group_replacement_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `additive_id` BIGINT NULL DEFAULT NULL,
  `additive_replacement_group_id` INT NULL DEFAULT NULL,
  `comment` TEXT NULL DEFAULT NULL,
  `status` TINYINT NULL DEFAULT '1',
  `created_by` BIGINT NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` BIGINT NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));

ALTER TABLE `charaka_202207271321`.`additives_group_replacement_logs` 
CHANGE COLUMN `created_by` `created_by` BIGINT NOT NULL ,
CHANGE COLUMN `updated_by` `updated_by` BIGINT NOT NULL ;

CREATE TABLE `charaka_202207271321`.`additives_replacement_group_log_images` (
  `id` INT NOT NULL,
  `additive_replacement_group_log_id` BIGINT NULL DEFAULT NULL,
  `image` VARCHAR(45) NULL DEFAULT NULL,
  `status` TINYINT NULL DEFAULT '1',
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`));
