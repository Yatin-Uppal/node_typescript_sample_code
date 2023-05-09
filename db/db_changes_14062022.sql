ALTER TABLE `additives_plant_replacements_regions` DROP FOREIGN KEY additives_plant_replacements_regions_ibfk_4;
ALTER TABLE `user_product_additive_replacements` DROP FOREIGN KEY user_product_additive_replacements_ibfk_2;
ALTER TABLE user_product_additive_replacements DROP COLUMN `replacement_combination_group_id`;
ALTER TABLE user_product_additive_replacements ADD COLUMN plant_extraction_id INT;

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `additives_plant_replacements` */

DROP TABLE IF EXISTS `additives_plant_replacements`;

CREATE TABLE `additives_plant_replacements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `plant_extraction_id` int(10) unsigned NOT NULL,
  `additive_id` bigint(20) unsigned NOT NULL,
  `plant_id` bigint(20) unsigned NOT NULL,
  `plant_part_id` bigint(20) unsigned DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`plant_extraction_id`,`additive_id`,`plant_id`,`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `id` (`id`),
  CONSTRAINT `additives_plant_replacements_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `additives_plant_replacements_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4 COMMENT='This table will store the plant replacements of an additive';

/*Data for the table `additives_plant_replacements` */

insert  into `additives_plant_replacements`(`id`,`plant_extraction_id`,`additive_id`,`plant_id`,`plant_part_id`,`updated_at`,`created_by`,`updated_by`,`created_at`) values (60,1,1142,6466,NULL,'2022-06-14 15:30:01',NULL,NULL,'2022-05-12 08:19:00'),(46,1,1692,131385,NULL,'2022-06-14 15:29:34',NULL,NULL,'2022-05-12 09:31:00'),(90,1,1814,2000,NULL,'2022-06-14 15:30:50',NULL,NULL,'2022-05-11 17:00:00'),(31,1,2008,6366,NULL,'2022-06-14 15:29:15',NULL,NULL,'2022-05-12 13:26:00'),(105,1,2351,3129,NULL,'2022-06-14 15:31:06',NULL,NULL,'2022-05-10 18:46:00'),(16,1,2748,6476,NULL,'2022-06-14 15:28:33',NULL,NULL,'2022-05-14 08:50:00'),(75,1,3562,6345,NULL,'2022-06-14 15:30:30',NULL,NULL,'2022-05-11 19:20:00'),(1,1,3757,1139,NULL,NULL,NULL,NULL,'2022-03-24 13:53:31'),(61,2,1141,6326,NULL,'2022-06-14 15:30:02',NULL,NULL,'2022-05-12 08:07:00'),(47,2,1689,1556,NULL,'2022-06-14 15:29:34',NULL,NULL,'2022-05-12 08:28:00'),(32,2,1711,5506,NULL,'2022-06-14 15:29:16',NULL,NULL,'2022-05-14 08:31:00'),(76,2,1802,1555,NULL,'2022-06-14 15:30:31',NULL,NULL,'2022-05-11 18:22:00'),(91,2,1840,3924,NULL,'2022-06-14 15:30:51',NULL,NULL,'2022-05-11 16:15:00'),(17,2,1846,5005,NULL,'2022-06-14 15:28:34',NULL,NULL,'2022-05-14 08:47:00'),(2,2,3757,603,NULL,NULL,NULL,NULL,'2022-03-24 13:54:30'),(106,2,4271,243,NULL,'2022-06-14 15:31:08',NULL,NULL,'2022-05-10 16:04:00'),(48,3,1164,6492,NULL,'2022-06-14 15:29:35',NULL,NULL,'2022-05-13 09:55:00'),(33,3,1711,5318,NULL,'2022-06-14 15:29:16',NULL,NULL,'2022-05-14 08:30:00'),(77,3,1802,6454,NULL,'2022-06-14 15:30:32',NULL,NULL,'2022-05-11 18:21:00'),(92,3,1831,807,NULL,'2022-06-14 15:30:52',NULL,NULL,'2022-05-11 15:50:00'),(18,3,2009,5188,NULL,'2022-06-14 15:28:35',NULL,NULL,'2022-05-14 08:59:00'),(62,3,2720,2709,NULL,'2022-06-14 15:30:03',NULL,NULL,'2022-05-13 07:43:00'),(3,3,3757,642,NULL,NULL,NULL,NULL,'2022-03-24 13:48:51'),(107,3,4271,1841,NULL,'2022-06-14 15:31:08',NULL,NULL,'2022-05-10 16:02:00'),(49,4,1583,6002,NULL,'2022-06-14 15:29:35',NULL,NULL,'2022-05-13 09:52:00'),(34,4,1604,6462,NULL,'2022-06-14 15:29:17',NULL,NULL,'2022-05-14 08:27:00'),(78,4,1679,5567,NULL,'2022-06-14 15:30:32',NULL,NULL,'2022-05-12 07:38:00'),(93,4,1831,1385,NULL,'2022-06-14 15:30:53',NULL,NULL,'2022-05-11 14:37:00'),(63,4,2720,2711,NULL,'2022-06-14 15:30:04',NULL,NULL,'2022-05-13 07:40:00'),(19,4,2748,4720,NULL,'2022-06-14 15:28:35',NULL,NULL,'2022-05-14 08:55:00'),(108,4,4271,38779,NULL,'2022-06-14 15:31:09',NULL,NULL,'2022-05-10 15:18:00'),(4,4,4367,122,NULL,NULL,NULL,NULL,'2022-03-24 15:22:48'),(109,5,1504,6371,NULL,'2022-06-14 15:31:10',NULL,NULL,'2022-05-10 14:31:00'),(35,5,1604,6372,NULL,'2022-06-14 15:29:18',NULL,NULL,'2022-05-14 08:24:00'),(79,5,1679,5739,NULL,'2022-06-14 15:30:33',NULL,NULL,'2022-05-12 07:36:00'),(20,5,1846,6313,NULL,'2022-06-14 15:28:37',NULL,NULL,'2022-05-14 08:47:00'),(94,5,1898,1689,NULL,'2022-06-14 15:30:53',NULL,NULL,'2022-05-10 20:43:00'),(64,5,2720,918,NULL,'2022-06-14 15:30:05',NULL,NULL,'2022-05-13 07:36:00'),(5,5,4367,663,NULL,NULL,NULL,NULL,'2022-03-24 15:22:07'),(50,6,1583,4826,NULL,'2022-06-14 15:29:36',NULL,NULL,'2022-05-13 09:50:00'),(95,6,1831,4610,NULL,'2022-06-14 15:30:54',NULL,NULL,'2022-05-11 16:02:00'),(21,6,1846,4143,NULL,'2022-06-14 15:28:38',NULL,NULL,'2022-05-14 08:45:00'),(65,6,1965,3404,NULL,'2022-06-14 15:30:06',NULL,NULL,'2022-05-12 21:48:00'),(36,6,2070,6314,NULL,'2022-06-14 15:29:18',NULL,NULL,'2022-05-12 11:13:00'),(80,6,3562,4227,NULL,'2022-06-14 15:30:33',NULL,NULL,'2022-05-11 19:24:00'),(6,6,4367,76,NULL,NULL,NULL,NULL,'2022-03-24 15:23:22'),(137,6,4371,235,NULL,'2022-06-14 15:31:10',NULL,NULL,'2022-06-01 14:59:55'),(22,7,1007,3338,NULL,'2022-06-14 15:28:39',NULL,NULL,'2022-05-14 08:07:00'),(81,7,1814,6451,NULL,'2022-06-14 15:30:34',NULL,NULL,'2022-05-11 17:22:00'),(96,7,1898,6440,NULL,'2022-06-14 15:30:55',NULL,NULL,'2022-05-10 20:39:00'),(66,7,1909,6351,NULL,'2022-06-14 15:30:09',NULL,NULL,'2022-05-12 21:43:00'),(37,7,2070,6378,NULL,'2022-06-14 15:29:20',NULL,NULL,'2022-05-12 11:12:00'),(138,7,2385,456,NULL,'2022-06-14 15:31:11',NULL,NULL,'2022-06-01 14:59:55'),(51,7,2385,5832,NULL,'2022-06-14 15:29:38',NULL,NULL,'2022-05-13 08:36:00'),(7,7,4370,4399,NULL,NULL,NULL,NULL,'2022-04-01 07:21:46'),(67,8,1141,1120,NULL,'2022-06-14 15:30:10',NULL,NULL,'2022-05-12 08:05:00'),(23,8,1164,6481,NULL,'2022-06-14 15:28:40',NULL,NULL,'2022-05-13 10:08:00'),(139,8,1846,458,NULL,'2022-06-14 15:31:12',NULL,NULL,'2022-06-01 14:59:55'),(38,8,2070,601,NULL,'2022-06-14 15:29:20',NULL,NULL,'2022-05-12 11:04:00'),(97,8,2230,4589,NULL,'2022-06-14 15:30:56',NULL,NULL,'2022-05-10 20:25:00'),(82,8,2323,3137,NULL,'2022-06-14 15:30:34',NULL,NULL,'2022-05-11 16:44:00'),(52,8,2385,6313,NULL,'2022-06-14 15:29:40',NULL,NULL,'2022-05-13 08:34:00'),(8,8,4370,4401,NULL,NULL,NULL,NULL,'2022-04-01 07:23:16'),(68,9,1141,580,NULL,'2022-06-14 15:30:11',NULL,NULL,'2022-05-12 08:02:00'),(24,9,1226,4102,NULL,'2022-06-14 15:28:41',NULL,NULL,'2022-05-14 08:41:00'),(53,9,1689,6426,NULL,'2022-06-14 15:29:41',NULL,NULL,'2022-05-12 08:23:00'),(39,9,1692,6376,NULL,'2022-06-14 15:29:21',NULL,NULL,'2022-05-12 09:49:00'),(98,9,1763,39205,NULL,'2022-06-14 15:30:58',NULL,NULL,'2022-05-10 19:59:00'),(140,9,1846,459,NULL,'2022-06-14 15:31:13',NULL,NULL,'2022-06-01 14:59:55'),(83,9,2323,1555,NULL,'2022-06-14 15:30:35',NULL,NULL,'2022-05-11 16:39:00'),(9,9,4370,4476,1,NULL,NULL,NULL,'2022-04-01 07:20:00'),(25,10,1226,6302,NULL,'2022-06-14 15:28:45',NULL,NULL,'2022-05-14 08:36:00'),(40,10,1604,5894,NULL,'2022-06-14 15:29:25',NULL,NULL,'2022-05-14 08:22:00'),(141,10,1711,460,NULL,'2022-06-14 15:31:14',NULL,NULL,'2022-06-01 14:59:55'),(99,10,1763,6079,NULL,'2022-06-14 15:31:00',NULL,NULL,'2022-05-10 19:53:00'),(84,10,1840,6443,NULL,'2022-06-14 15:30:38',NULL,NULL,'2022-05-11 16:18:00'),(69,10,1909,883,NULL,'2022-06-14 15:30:14',NULL,NULL,'2022-05-12 21:42:00'),(54,10,2385,2872,NULL,'2022-06-14 15:29:45',NULL,NULL,'2022-05-13 08:33:00'),(10,10,3476,6041,NULL,'2022-06-01 15:00:02',NULL,NULL,'2022-05-14 09:33:00'),(41,11,1007,1287,NULL,'2022-06-14 15:29:26',NULL,NULL,'2022-05-14 08:18:00'),(26,11,1226,6411,NULL,'2022-06-14 15:28:46',NULL,NULL,'2022-05-14 08:34:00'),(142,11,1711,461,NULL,'2022-06-14 15:31:16',NULL,NULL,'2022-06-01 14:59:55'),(100,11,1763,6083,NULL,'2022-06-14 15:31:02',NULL,NULL,'2022-05-10 19:51:00'),(85,11,1840,6445,NULL,'2022-06-14 15:30:40',NULL,NULL,'2022-05-11 16:13:00'),(70,11,1909,2045,NULL,'2022-06-14 15:30:23',NULL,NULL,'2022-05-12 21:38:00'),(11,11,3476,6504,NULL,'2022-06-01 15:00:02',NULL,NULL,'2022-05-14 09:30:00'),(55,11,3614,6390,NULL,'2022-06-14 15:29:54',NULL,NULL,'2022-05-13 08:25:00'),(56,12,950,965,NULL,'2022-06-14 15:29:55',NULL,NULL,'2022-05-13 08:23:00'),(42,12,1007,6330,NULL,'2022-06-14 15:29:27',NULL,NULL,'2022-05-14 08:15:00'),(27,12,1711,5648,NULL,'2022-06-14 15:28:47',NULL,NULL,'2022-05-14 08:32:00'),(86,12,1802,6453,NULL,'2022-06-14 15:30:41',NULL,NULL,'2022-05-11 18:12:00'),(71,12,2008,6251,NULL,'2022-06-14 15:30:24',NULL,NULL,'2022-05-12 14:59:00'),(101,12,2351,38831,NULL,'2022-06-14 15:31:02',NULL,NULL,'2022-05-10 18:51:00'),(143,12,2985,462,NULL,'2022-06-14 15:31:16',NULL,NULL,'2022-06-01 14:59:55'),(12,12,3476,4625,NULL,'2022-06-01 15:00:02',NULL,NULL,'2022-05-14 09:27:00'),(57,13,950,6288,NULL,'2022-06-14 15:29:56',NULL,NULL,'2022-05-13 08:19:00'),(72,13,1142,6293,NULL,'2022-06-14 15:30:26',NULL,NULL,'2022-05-12 08:18:00'),(28,13,1583,6477,NULL,'2022-06-14 15:28:49',NULL,NULL,'2022-05-13 09:48:00'),(87,13,1824,696,NULL,'2022-06-14 15:30:42',NULL,NULL,'2022-05-11 17:37:00'),(13,13,2009,5798,NULL,'2022-06-01 15:00:02',NULL,NULL,'2022-05-14 09:00:00'),(43,13,2186,6039,NULL,'2022-06-14 15:29:28',NULL,NULL,'2022-05-13 11:31:00'),(102,13,2351,39065,NULL,'2022-06-14 15:31:03',NULL,NULL,'2022-05-10 18:32:00'),(144,13,2352,464,NULL,'2022-06-14 15:31:17',NULL,NULL,'2022-06-01 14:59:55'),(58,14,950,5921,NULL,'2022-06-14 15:29:58',NULL,NULL,'2022-05-13 08:17:00'),(73,14,1142,3621,NULL,'2022-06-14 15:30:28',NULL,NULL,'2022-05-12 08:11:00'),(44,14,1164,6482,NULL,'2022-06-14 15:29:30',NULL,NULL,'2022-05-13 10:07:00'),(103,14,1620,6406,NULL,'2022-06-14 15:31:04',NULL,NULL,'2022-05-10 19:46:00'),(88,14,1824,483,NULL,'2022-06-14 15:30:43',NULL,NULL,'2022-05-11 17:33:00'),(14,14,2009,6312,NULL,'2022-06-01 15:00:02',NULL,NULL,'2022-05-14 08:58:00'),(145,14,3614,465,NULL,'2022-06-14 15:31:18',NULL,NULL,'2022-06-01 14:59:55'),(29,14,3614,4594,NULL,'2022-06-14 15:28:50',NULL,NULL,'2022-05-13 08:26:00'),(104,15,1620,38788,NULL,'2022-06-14 15:31:06',NULL,NULL,'2022-05-10 19:23:00'),(59,15,1689,6373,NULL,'2022-06-14 15:29:59',NULL,NULL,'2022-05-12 08:22:00'),(45,15,1692,39085,NULL,'2022-06-14 15:29:32',NULL,NULL,'2022-05-12 09:42:00'),(89,15,1814,38745,NULL,'2022-06-14 15:30:44',NULL,NULL,'2022-05-11 17:04:00'),(30,15,2008,5950,NULL,'2022-06-14 15:28:52',NULL,NULL,'2022-05-12 14:55:00'),(15,15,2748,6262,NULL,'2022-06-14 15:29:14',NULL,NULL,'2022-05-14 08:52:00'),(146,15,3614,236,NULL,'2022-06-14 15:31:21',NULL,NULL,'2022-06-01 14:59:55'),(74,15,4139,6354,NULL,'2022-06-14 15:30:30',NULL,NULL,'2022-05-12 07:57:00');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
