/*
SQLyog Ultimate v10.00 Beta1
MySQL - 5.5.5-10.4.20-MariaDB : Database - charaka
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `user_product_additive_replacements` */

DROP TABLE IF EXISTS `user_product_additive_replacements`;

CREATE TABLE `user_product_additive_replacements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_product_id` bigint(20) unsigned DEFAULT NULL,
  `replacement_combination_group_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_product_id` (`user_product_id`),
  KEY `replacement_combination_group_id` (`replacement_combination_group_id`),
  CONSTRAINT `user_product_additive_replacements_ibfk_1` FOREIGN KEY (`user_product_id`) REFERENCES `user_products` (`id`),
  CONSTRAINT `user_product_additive_replacements_ibfk_2` FOREIGN KEY (`replacement_combination_group_id`) REFERENCES `additives_plant_replacements` (`combination_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `user_product_additive_replacements` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
