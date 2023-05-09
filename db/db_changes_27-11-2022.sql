UPDATE plants_physicochemical_properties set hlb=NULL  where hlb='NULL' or  hlb='';

ALTER TABLE `plants_physicochemical_properties` CHANGE COLUMN `hlb` `hlb` INTEGER NULL DEFAULT NULL ;

ALTER TABLE `plants_physicochemical_properties` 
ADD COLUMN `relative_sweetness` DECIMAL(10,2) NULL DEFAULT NULL AFTER `hlb`,
ADD COLUMN `glycemic_index` DECIMAL(10,2) NULL DEFAULT NULL AFTER `relative_sweetness`,
ADD COLUMN `zeta_potential` DECIMAL(10,2) NULL DEFAULT NULL AFTER `glycemic_index`;


ALTER TABLE `additives_physicochemical_mechanical_properties` 
ADD COLUMN `relative_sweetness` DECIMAL(10,2) NULL DEFAULT NULL AFTER `shear_resistance`,
ADD COLUMN `glycemic_index` DECIMAL(10,2) NULL DEFAULT NULL AFTER `relative_sweetness`,
ADD COLUMN `zeta_potential` DECIMAL(10,2) NULL DEFAULT NULL AFTER `glycemic_index`,
ADD COLUMN `hlb` INTEGER NULL DEFAULT NULL AFTER `zeta_potential`,
ADD COLUMN `emulsion_ability` DECIMAL(10,2) NULL DEFAULT NULL AFTER `hlb`,
ADD COLUMN `emulsion_stability` DECIMAL(10,2) NULL DEFAULT NULL AFTER `emulsion_ability`,
ADD COLUMN `titrable_acidity` DECIMAL(10,2) NULL DEFAULT NULL AFTER `emulsion_stability`,
ADD COLUMN `water_holding_capacity` DECIMAL(10,2) NULL DEFAULT NULL AFTER `titrable_acidity`,
ADD COLUMN `oil_holding_capacity` DECIMAL(10,2) NULL DEFAULT NULL AFTER `water_holding_capacity`;
