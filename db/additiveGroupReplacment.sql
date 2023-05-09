CREATE TABLE `additives_group_replacement_properties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `additives_group_replacement_id` bigint unsigned DEFAULT NULL,
  `melting_freezing_point` decimal(10,2) DEFAULT NULL,
  `ph_maximum_concentration` varchar(255) DEFAULT NULL,
  `emulsion_stability` decimal(10,2) DEFAULT NULL,
  `emulsion_ability` decimal(10,2) DEFAULT NULL,
  `hlb` int DEFAULT NULL,
  `zeta_potential` decimal(10,2) DEFAULT NULL,
  `antioxidant_acitivity` varchar(50) DEFAULT NULL,
  `viscosity` varchar(255) DEFAULT NULL,
  `water_holding_capacity` decimal(10,2) DEFAULT NULL,
  `oil_holding_capacity` decimal(10,2) DEFAULT NULL,
  `relative_sweetness` decimal(10,2) DEFAULT NULL,
  `glycemic_index` decimal(10,2) DEFAULT NULL,
  `moisture` varchar(255) DEFAULT NULL,
  `titrable_acidity` varchar(255) DEFAULT NULL, 
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the properties of additives_group_replacement.';

CREATE TABLE env_setting (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  flag_name varchar(50) DEFAULT NULL,
  flag_value tinyint DEFAULT False,
  app_name varchar(50) DEFAULT NULL,
  comments varchar(100) DEFAULT NULL,
  created_by bigint unsigned DEFAULT NULL,
  updated_by bigint unsigned DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY created_by (created_by),
  KEY updated_by (updated_by)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ;


CREATE TABLE `additives_replacements_tag` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `additive_id` bigint unsigned NOT NULL,
  `additives_plant_replacement_id` int unsigned DEFAULT NULL,
  `additives_group_replacement_id` int unsigned DEFAULT NULL,  
  `product_category` int DEFAULT NULL,
  `food_category` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the food and product category tag';

CREATE TABLE `additives_group_replacement` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_name` varchar(45) NOT NULL,
  `additive_id` bigint unsigned NOT NULL,
  `is_approved` tinyint unsigned  NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `additives_group_replacement_log_files` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `additive_replacement_group_log_id` bigint unsigned NOT NULL,
  `file` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `additives_group_replacement_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `additive_id` bigint DEFAULT NULL,
  `additive_replacement_group_id` int DEFAULT NULL,
  `comment` text,
  `status` tinyint DEFAULT '1',
  `created_by` bigint NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` bigint NOT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `additives_group_replacement_plants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `additives_group_replacement_id` int NOT NULL,
  `additives_plant_replacement_id` int NOT NULL,
  `plant_extraction_id` int unsigned DEFAULT NULL,
  `plant_functionality_id` int DEFAULT NULL,
  `percentage` decimal(10,2) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=225 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store all the plants for group repacemnt of additive';

CREATE TABLE `additives_group_replacement_tags` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `additives_group_replacement_id` int NOT NULL,
  `tag` varchar(100) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


ALTER TABLE additives
ADD COLUMN utraprocessed_reason VARCHAR(245) NULL AFTER is_animal_based;

