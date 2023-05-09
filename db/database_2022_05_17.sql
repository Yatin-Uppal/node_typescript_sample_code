CREATE DATABASE  IF NOT EXISTS `thelivegreen_dev` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `thelivegreen_dev`;
-- MySQL dump 10.13  Distrib 5.7.38, for Linux (x86_64)
--
-- Host: 92.204.242.38    Database: thelivegreen_dev
-- ------------------------------------------------------
-- Server version	8.0.29-0ubuntu0.20.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `additives`
--

DROP TABLE IF EXISTS `additives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `public_id` varchar(20) DEFAULT NULL,
  `number` varchar(20) DEFAULT NULL,
  `max_level` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `additives_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4379 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the basic details of additives';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_activity_logs`
--

DROP TABLE IF EXISTS `additives_activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `additive_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `activity_log` varchar(255) DEFAULT NULL,
  `ip` varchar(20) DEFAULT NULL,
  `user_agent` varchar(100) DEFAULT NULL,
  `header_request` text,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `additive_id` (`additive_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `additives_activity_logs_ibfk_1` FOREIGN KEY (`additive_id`) REFERENCES `additives` (`id`),
  CONSTRAINT `additives_activity_logs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table is to store any activity being done on the Additives by any user.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_food_categories`
--

DROP TABLE IF EXISTS `additives_food_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_food_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `additive_id` bigint unsigned DEFAULT NULL,
  `food_category_id` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `additive_id` (`additive_id`),
  KEY `additives_food_category_ibfk_2` (`food_category_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `additives_food_categories_ibfk_1` FOREIGN KEY (`additive_id`) REFERENCES `additives` (`id`),
  CONSTRAINT `additives_food_categories_ibfk_2` FOREIGN KEY (`food_category_id`) REFERENCES `food_categories` (`id`),
  CONSTRAINT `additives_food_categories_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_food_categories_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This is a mapping table between additives and food categories tables';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_functionalities`
--

DROP TABLE IF EXISTS `additives_functionalities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_functionalities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `additive_id` bigint unsigned DEFAULT NULL,
  `functionality_id` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `additive_id` (`additive_id`),
  KEY `function_id` (`functionality_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `additives_functionalities_ibfk_1` FOREIGN KEY (`additive_id`) REFERENCES `additives` (`id`),
  CONSTRAINT `additives_functionalities_ibfk_2` FOREIGN KEY (`functionality_id`) REFERENCES `functionalities` (`id`),
  CONSTRAINT `additives_functionalities_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_functionalities_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This is a mapping table between additives and functionalities tables';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_organoleptic_sensory_properties`
--

DROP TABLE IF EXISTS `additives_organoleptic_sensory_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_organoleptic_sensory_properties` (
  `id` bigint unsigned DEFAULT NULL,
  `additive_id` bigint unsigned DEFAULT NULL,
  `form_shape_size` varchar(50) DEFAULT NULL,
  `taste_purge_trap` varchar(50) DEFAULT NULL,
  `juiciness` varchar(50) DEFAULT NULL,
  `greasiness` varchar(50) DEFAULT NULL,
  `texture` varchar(50) DEFAULT NULL,
  `hardness` varchar(50) DEFAULT NULL,
  `plasticity` varchar(50) DEFAULT NULL,
  `elasticity` varchar(50) DEFAULT NULL,
  `smell` varchar(50) DEFAULT NULL,
  `color_appearance` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  KEY `additive_id` (`additive_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `additives_organoleptic_sensory_properties_ibfk_1` FOREIGN KEY (`additive_id`) REFERENCES `additives` (`id`),
  CONSTRAINT `additives_organoleptic_sensory_properties_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_organoleptic_sensory_properties_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the Organoleptic properties of additives.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_physicochemical_mechanical_properties`
--

DROP TABLE IF EXISTS `additives_physicochemical_mechanical_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_physicochemical_mechanical_properties` (
  `id` bigint unsigned DEFAULT NULL,
  `additive_id` bigint unsigned DEFAULT NULL,
  `melting_freezing_point` varchar(50) DEFAULT NULL,
  `boiling_point` varchar(50) DEFAULT NULL,
  `pka` varchar(50) DEFAULT NULL,
  `ph_maximum_concentration` varchar(50) DEFAULT NULL,
  `moisture` varchar(50) DEFAULT NULL,
  `coefficent_of_expansion` varchar(50) DEFAULT NULL,
  `porosity` varchar(50) DEFAULT NULL,
  `density` varchar(50) DEFAULT NULL,
  `flammability` varchar(50) DEFAULT NULL,
  `thermal_stability` varchar(50) DEFAULT NULL,
  `viscosity` varchar(50) DEFAULT NULL,
  `gelification_emulsification` varchar(50) DEFAULT NULL,
  `crystallization` varchar(50) DEFAULT NULL,
  `adhesive_strength` varchar(50) DEFAULT NULL,
  `cohesive_strength` varchar(50) DEFAULT NULL,
  `leavening_power` varchar(50) DEFAULT NULL,
  `mic_mlc_microbial` varchar(50) DEFAULT NULL,
  `oxidation` varchar(50) DEFAULT NULL,
  `compressive_strength` varchar(50) DEFAULT NULL,
  `tensile_strength` varchar(50) DEFAULT NULL,
  `shear_resistance` varchar(50) DEFAULT NULL,
  `others` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  KEY `additive_id` (`additive_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `additives_physicochemical_mechanical_properties_ibfk_1` FOREIGN KEY (`additive_id`) REFERENCES `additives` (`id`),
  CONSTRAINT `additives_physicochemical_mechanical_properties_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_physicochemical_mechanical_properties_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the Physicochemical and Mechanical properties of additives.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_plant_replacements`
--

DROP TABLE IF EXISTS `additives_plant_replacements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_plant_replacements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `combination_group_id` bigint unsigned NOT NULL,
  `additive_id` bigint unsigned NOT NULL,
  `plant_id` bigint unsigned NOT NULL,
  `additive_tasks_id` bigint unsigned DEFAULT NULL,
  `functionality_id` int DEFAULT NULL,
  `food_category_id` int DEFAULT NULL,
  `product_category_id` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `functionality_justification` text,
  `nutritional_health_benefits` text,
  `bioactive_compounds_responsible` text,
  `taxonomical_justification` text,
  `additional_comments` text,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`combination_group_id`,`additive_id`,`plant_id`,`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `additive_tasks_id` (`additive_tasks_id`),
  KEY `functionality_id` (`functionality_id`),
  KEY `food_category_id` (`food_category_id`),
  KEY `product_category_id` (`product_category_id`),
  KEY `id` (`id`),
  CONSTRAINT `additives_plant_replacements_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_plant_replacements_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_plant_replacements_ibfk_6` FOREIGN KEY (`additive_tasks_id`) REFERENCES `additives_tasks` (`id`),
  CONSTRAINT `additives_plant_replacements_ibfk_7` FOREIGN KEY (`functionality_id`) REFERENCES `functionalities` (`id`),
  CONSTRAINT `additives_plant_replacements_ibfk_8` FOREIGN KEY (`food_category_id`) REFERENCES `food_categories` (`id`),
  CONSTRAINT `additives_plant_replacements_ibfk_9` FOREIGN KEY (`product_category_id`) REFERENCES `product_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the plant replacements of an additive';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_plant_replacements_regions`
--

DROP TABLE IF EXISTS `additives_plant_replacements_regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_plant_replacements_regions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `combination_id` bigint unsigned DEFAULT NULL,
  `region_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `region_id` (`region_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `combination_id` (`combination_id`),
  CONSTRAINT `additives_plant_replacements_regions_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`),
  CONSTRAINT `additives_plant_replacements_regions_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_plant_replacements_regions_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_plant_replacements_regions_ibfk_4` FOREIGN KEY (`combination_id`) REFERENCES `additives_plant_replacements` (`combination_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_product_categories`
--

DROP TABLE IF EXISTS `additives_product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_product_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `additive_id` bigint unsigned DEFAULT NULL,
  `product_category_id` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `additive_id` (`additive_id`),
  KEY `product_category_id` (`product_category_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `additives_product_categories_ibfk_1` FOREIGN KEY (`additive_id`) REFERENCES `additives` (`id`),
  CONSTRAINT `additives_product_categories_ibfk_2` FOREIGN KEY (`product_category_id`) REFERENCES `product_categories` (`id`),
  CONSTRAINT `additives_product_categories_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_product_categories_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This is a mapping table between additives and product categories tables';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_properties`
--

DROP TABLE IF EXISTS `additives_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_properties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `additive_id` bigint unsigned DEFAULT NULL,
  `additives_property_category_id` int DEFAULT NULL,
  `property_name` varchar(50) DEFAULT NULL,
  `property_value` float DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `additive_id` (`additive_id`),
  KEY `additive_properties_ibfk_2` (`additives_property_category_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `additives_properties_ibfk_1` FOREIGN KEY (`additive_id`) REFERENCES `additives` (`id`),
  CONSTRAINT `additives_properties_ibfk_2` FOREIGN KEY (`additives_property_category_id`) REFERENCES `additives_properties_categories` (`id`),
  CONSTRAINT `additives_properties_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_properties_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the current approved properties data related to additives';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_properties_categories`
--

DROP TABLE IF EXISTS `additives_properties_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_properties_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `additives_properties_categories_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_properties_categories_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the list of all the unique properties categories of additives';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_properties_versions`
--

DROP TABLE IF EXISTS `additives_properties_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_properties_versions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `additive_property_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `property_name` varchar(255) DEFAULT NULL,
  `property_value` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT NULL,
  `approved_rejected_by` bigint unsigned DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `additive_property_id` (`additive_property_id`),
  KEY `user_id` (`user_id`),
  KEY `approved_rejected_by` (`approved_rejected_by`),
  CONSTRAINT `additives_properties_versions_ibfk_1` FOREIGN KEY (`additive_property_id`) REFERENCES `additives_properties` (`id`),
  CONSTRAINT `additives_properties_versions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_properties_versions_ibfk_3` FOREIGN KEY (`approved_rejected_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store all the versions of the properties being added by different users to be validated by the validator.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_regions`
--

DROP TABLE IF EXISTS `additives_regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_regions` (
  `id` bigint unsigned DEFAULT NULL,
  `additive_id` bigint unsigned DEFAULT NULL,
  `region_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `additives_id` (`additive_id`),
  KEY `region_id` (`region_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `additives_regions_ibfk_1` FOREIGN KEY (`additive_id`) REFERENCES `additives` (`id`),
  CONSTRAINT `additives_regions_ibfk_2` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`),
  CONSTRAINT `additives_regions_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_regions_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This is a mapping table between additives and regions tables';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_synonyms`
--

DROP TABLE IF EXISTS `additives_synonyms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_synonyms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `additive_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `additive_id` (`additive_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `additives_synonyms_ibfk_1` FOREIGN KEY (`additive_id`) REFERENCES `additives` (`id`),
  CONSTRAINT `additives_synonyms_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_synonyms_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This is a mapping table between additives and synonyms tables';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_synonyms_languages`
--

DROP TABLE IF EXISTS `additives_synonyms_languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_synonyms_languages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `additive_synonym_id` bigint unsigned DEFAULT NULL,
  `language_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `additive_id` (`additive_synonym_id`),
  KEY `language_id` (`language_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `additives_synonyms_languages_ibfk_2` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`),
  CONSTRAINT `additives_synonyms_languages_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_synonyms_languages_ibfk_4` FOREIGN KEY (`additive_synonym_id`) REFERENCES `additives_synonyms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This is a mapping table between additive synonyms and languages tables';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_tasks`
--

DROP TABLE IF EXISTS `additives_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_tasks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `additive_id` bigint unsigned DEFAULT NULL,
  `assigned_to` bigint unsigned DEFAULT NULL,
  `research_stage_id` int DEFAULT NULL,
  `comment` text,
  `due_date` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `additive_id` (`additive_id`),
  KEY `assigned_by` (`created_by`),
  KEY `assigned_to` (`assigned_to`),
  KEY `current_research_stage_id` (`research_stage_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `additives_tasks_ibfk_1` FOREIGN KEY (`additive_id`) REFERENCES `additives` (`id`),
  CONSTRAINT `additives_tasks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_tasks_ibfk_3` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_tasks_ibfk_5` FOREIGN KEY (`research_stage_id`) REFERENCES `research_stages` (`id`),
  CONSTRAINT `additives_tasks_ibfk_6` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50745 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store tasks being assigned to users for an additive.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `additives_tasks_feedbacks`
--

DROP TABLE IF EXISTS `additives_tasks_feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additives_tasks_feedbacks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `additive_tasks_id` bigint unsigned DEFAULT NULL,
  `feedback` text,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `additive_tasks_id` (`additive_tasks_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `additives_tasks_feedbacks_ibfk_1` FOREIGN KEY (`additive_tasks_id`) REFERENCES `additives_tasks` (`id`),
  CONSTRAINT `additives_tasks_feedbacks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_tasks_feedbacks_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `food_categories`
--

DROP TABLE IF EXISTS `food_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `food_categories_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `food_categories_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will contain all the unique food categories';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `functionalities`
--

DROP TABLE IF EXISTS `functionalities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `functionalities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `functionalities_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `functionalities_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the list of unique functionalities an additive or a plant can have.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `languages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `short_code` varchar(4) DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `languages_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `languages_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will contain the list of the languages';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants`
--

DROP TABLE IF EXISTS `plants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `scientific_name` varchar(100) DEFAULT NULL,
  `part_of_the_plant` varchar(20) DEFAULT NULL,
  `species` varchar(50) DEFAULT NULL,
  `genus` varchar(50) DEFAULT NULL,
  `family` varchar(50) DEFAULT NULL,
  `image_link` text,
  `status` tinyint(1) DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `edible_rating` varchar(100) DEFAULT NULL,
  `description` text,
  `edible_parts` varchar(255) DEFAULT NULL,
  `source_database` varchar(255) DEFAULT NULL,
  `source_database_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `plants_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `plants_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4489 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the basic details of plants';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants_activity_logs`
--

DROP TABLE IF EXISTS `plants_activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plants_activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `plant_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `activity_log` varchar(255) DEFAULT NULL,
  `ip` varchar(20) DEFAULT NULL,
  `user_agent` varchar(100) DEFAULT NULL,
  `header_request` text,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plant_id` (`plant_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `plants_activity_logs_ibfk_1` FOREIGN KEY (`plant_id`) REFERENCES `plants` (`id`),
  CONSTRAINT `plants_activity_logs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table is to store any activity being done on the plants by any user.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants_food_categories`
--

DROP TABLE IF EXISTS `plants_food_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plants_food_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plant_id` bigint unsigned DEFAULT NULL,
  `food_category_id` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plant_id` (`plant_id`),
  KEY `product_category_id` (`food_category_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `plants_food_categories_ibfk_1` FOREIGN KEY (`plant_id`) REFERENCES `plants` (`id`),
  CONSTRAINT `plants_food_categories_ibfk_2` FOREIGN KEY (`food_category_id`) REFERENCES `food_categories` (`id`),
  CONSTRAINT `plants_food_categories_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `plants_food_categories_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This is a mapping table between plants and food categories tables';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants_functionalities`
--

DROP TABLE IF EXISTS `plants_functionalities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plants_functionalities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plant_id` bigint unsigned DEFAULT NULL,
  `plant_part_id` bigint unsigned DEFAULT NULL,
  `functionality_id` int DEFAULT NULL,
  `source` text,
  `source_id` int DEFAULT NULL,
  `source_link` text,
  `editable_parts` text,
  `comment` text,
  `bio_active_compounds` text,
  `explanation` text,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plant_id` (`plant_id`),
  KEY `function_id` (`functionality_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `plants_functionalities_ibfk_1` FOREIGN KEY (`plant_id`) REFERENCES `plants` (`id`),
  CONSTRAINT `plants_functionalities_ibfk_2` FOREIGN KEY (`functionality_id`) REFERENCES `functionalities` (`id`),
  CONSTRAINT `plants_functionalities_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `plants_functionalities_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This is a mapping table between plants and functionalities tables';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants_images`
--

DROP TABLE IF EXISTS `plants_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plants_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plant_id` bigint unsigned DEFAULT NULL,
  `file_name` varchar(250) DEFAULT NULL,
  `file_path` varchar(250) DEFAULT NULL,
  `default` tinyint(1) DEFAULT '1',
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants_nutrional_properties`
--

DROP TABLE IF EXISTS `plants_nutrional_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plants_nutrional_properties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `plant_id` bigint unsigned DEFAULT NULL,
  `plant_part_id` bigint unsigned DEFAULT NULL,
  `calories` varchar(50) DEFAULT NULL,
  `proteins` varchar(50) DEFAULT NULL,
  `net_carbohydrates` varchar(50) DEFAULT NULL,
  `free_sugars` varchar(50) DEFAULT NULL,
  `sodium` varchar(50) DEFAULT NULL,
  `total_fats` varchar(50) DEFAULT NULL,
  `saturated_fats` varchar(50) DEFAULT NULL,
  `mono_insaturated_fats` varchar(50) DEFAULT NULL,
  `poly_insaturated_fats` varchar(50) DEFAULT NULL,
  `trans_fats` varchar(50) DEFAULT NULL,
  `cholesterol` varchar(50) DEFAULT NULL,
  `total_fiber` varchar(50) DEFAULT NULL,
  `soluble_fiber` varchar(50) DEFAULT NULL,
  `insoluble_fiber` varchar(50) DEFAULT NULL,
  `vitamins` varchar(50) DEFAULT NULL,
  `minerals` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plant_id` (`plant_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `plants_nutrional_properties_ibfk_1` FOREIGN KEY (`plant_id`) REFERENCES `plants` (`id`),
  CONSTRAINT `plants_nutrional_properties_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `plants_nutrional_properties_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the nutritional properties of plants.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants_organoleptic_sensory_properties`
--

DROP TABLE IF EXISTS `plants_organoleptic_sensory_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plants_organoleptic_sensory_properties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `plant_id` bigint unsigned DEFAULT NULL,
  `plant_part_id` bigint unsigned DEFAULT NULL,
  `form_shape_size` varchar(50) DEFAULT NULL,
  `taste_purge_trap` varchar(50) DEFAULT NULL,
  `juiciness` varchar(50) DEFAULT NULL,
  `greasiness` varchar(50) DEFAULT NULL,
  `texture` varchar(50) DEFAULT NULL,
  `hardness` varchar(50) DEFAULT NULL,
  `plasticity` varchar(50) DEFAULT NULL,
  `elasticity` varchar(50) DEFAULT NULL,
  `smell` varchar(50) DEFAULT NULL,
  `sound` varchar(50) DEFAULT NULL,
  `color_appearance` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plant_id` (`plant_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `plants_organoleptic_sensory_properties_ibfk_1` FOREIGN KEY (`plant_id`) REFERENCES `plants` (`id`),
  CONSTRAINT `plants_organoleptic_sensory_properties_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `plants_organoleptic_sensory_properties_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the organoleptic and sensory properties of plants.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants_parts`
--

DROP TABLE IF EXISTS `plants_parts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plants_parts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants_physicochemical_properties`
--

DROP TABLE IF EXISTS `plants_physicochemical_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plants_physicochemical_properties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `plant_id` bigint unsigned DEFAULT NULL,
  `plant_part_id` bigint unsigned DEFAULT NULL,
  `melting_freezing_point` varchar(50) DEFAULT NULL,
  `boiling_point` varchar(50) DEFAULT NULL,
  `pka` varchar(50) DEFAULT NULL,
  `ph_maximum_concentration` varchar(50) DEFAULT NULL,
  `ec` varchar(50) DEFAULT NULL,
  `moisture` varchar(50) DEFAULT NULL,
  `coefficent_of_expansion` varchar(50) DEFAULT NULL,
  `porosity` varchar(50) DEFAULT NULL,
  `density` varchar(50) DEFAULT NULL,
  `flammability` varchar(50) DEFAULT NULL,
  `thermal_stability` varchar(50) DEFAULT NULL,
  `viscosity` varchar(50) DEFAULT NULL,
  `gelification_emulsification` varchar(50) DEFAULT NULL,
  `crystallization` varchar(50) DEFAULT NULL,
  `adhesive_strength` varchar(50) DEFAULT NULL,
  `cohesive_strength` varchar(50) DEFAULT NULL,
  `leavening_power` varchar(50) DEFAULT NULL,
  `mic_mlc_microbial` varchar(50) DEFAULT NULL,
  `oxidation` varchar(50) DEFAULT NULL,
  `compressive_strength` varchar(50) DEFAULT NULL,
  `tensile_strength` varchar(50) DEFAULT NULL,
  `shear_resistance` varchar(50) DEFAULT NULL,
  `impact` varchar(50) DEFAULT NULL,
  `others` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plant_id` (`plant_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `plants_physicochemical_properties_ibfk_1` FOREIGN KEY (`plant_id`) REFERENCES `plants` (`id`),
  CONSTRAINT `plants_physicochemical_properties_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `plants_physicochemical_properties_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the Physicochemical properties of plants.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants_product_categories`
--

DROP TABLE IF EXISTS `plants_product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plants_product_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plant_id` bigint unsigned DEFAULT NULL,
  `product_category_id` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plant_id` (`plant_id`),
  KEY `product_category_id` (`product_category_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `plants_product_categories_ibfk_1` FOREIGN KEY (`plant_id`) REFERENCES `plants` (`id`),
  CONSTRAINT `plants_product_categories_ibfk_2` FOREIGN KEY (`product_category_id`) REFERENCES `product_categories` (`id`),
  CONSTRAINT `plants_product_categories_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `plants_product_categories_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This is a mapping table between plants and product categories tables';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants_regions`
--

DROP TABLE IF EXISTS `plants_regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plants_regions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `plant_id` bigint unsigned DEFAULT NULL,
  `region_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plant_id` (`plant_id`),
  KEY `region_id` (`region_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `plants_regions_ibfk_1` FOREIGN KEY (`plant_id`) REFERENCES `plants` (`id`),
  CONSTRAINT `plants_regions_ibfk_2` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`),
  CONSTRAINT `plants_regions_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `plants_regions_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants_tasks`
--

DROP TABLE IF EXISTS `plants_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plants_tasks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `plant_id` bigint unsigned DEFAULT NULL,
  `assigned_to` bigint unsigned DEFAULT NULL,
  `research_stage_id` int DEFAULT NULL,
  `comment` text,
  `due_date` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plant_id` (`plant_id`),
  KEY `assigned_by` (`created_by`),
  KEY `assigned_to` (`assigned_to`),
  KEY `current_research_stage_id` (`research_stage_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `plants_tasks_ibfk_1` FOREIGN KEY (`plant_id`) REFERENCES `plants` (`id`),
  CONSTRAINT `plants_tasks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `plants_tasks_ibfk_3` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`),
  CONSTRAINT `plants_tasks_ibfk_5` FOREIGN KEY (`research_stage_id`) REFERENCES `research_stages` (`id`),
  CONSTRAINT `plants_tasks_ibfk_6` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store tasks being assigned to users for an plant.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plants_tasks_feedbacks`
--

DROP TABLE IF EXISTS `plants_tasks_feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plants_tasks_feedbacks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `plant_tasks_id` bigint unsigned DEFAULT NULL,
  `feedback` text,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plant_tasks_id` (`plant_tasks_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `plants_tasks_feedbacks_ibfk_1` FOREIGN KEY (`plant_tasks_id`) REFERENCES `plants_tasks` (`id`),
  CONSTRAINT `plants_tasks_feedbacks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `plants_tasks_feedbacks_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `product_categories_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `product_categories_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will contain all the unique product categories';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `region_type` varchar(20) DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `regions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `regions_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table contains the name of all the regions.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `research_stages`
--

DROP TABLE IF EXISTS `research_stages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `research_stages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `research_stages_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `research_stages_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store different stages of research';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT 'This column will contain names of user roles like "Admin", "Validator", "Researcher" etc.',
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `updated_by` (`updated_by`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  CONSTRAINT `roles_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will be used to store unique list of roles which can be assigned to the users';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `source`
--

DROP TABLE IF EXISTS `source`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `source` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text,
  `description` text,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `statuses`
--

DROP TABLE IF EXISTS `statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the list of unique status an additive or a plant can have.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL COMMENT 'This column contain unique email Id of the user.',
  `first_name` varchar(50) DEFAULT NULL COMMENT 'This column contain first name of the user.',
  `last_name` varchar(50) DEFAULT NULL COMMENT 'This column contain last name of the user.',
  `password` varchar(100) DEFAULT NULL COMMENT 'This column contain hashed password of the user account',
  `remember_token` varchar(100) DEFAULT NULL COMMENT 'This column contain a token, that will help the platform to remember the user, in case user checked the "Remember me" checkbox during login.',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'If the value of this column is 0, this means the user is inactive, and if the value is 1 then user is active.',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the basic details of users for authentication purpose';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users_profiles`
--

DROP TABLE IF EXISTS `users_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_by` bigint unsigned NOT NULL,
  `updated_by` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `users_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `users_profiles_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `users_profiles_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table will store the user''s detailed profile information';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users_roles`
--

DROP TABLE IF EXISTS `users_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `users_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `users_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `users_roles_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `users_roles_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-17 16:22:25
