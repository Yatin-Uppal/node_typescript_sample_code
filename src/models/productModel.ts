import { json } from "body-parser";
import { keys, replace } from "lodash";
import _ = require("lodash");
import { DataTypes, Op, or, Sequelize } from "sequelize";
import db from "../helpers/databaseConfig";
import emailTemplate from "../helpers/template";
import responseCode from "../helpers/response";
import {createLog} from "./loggerModel"
import projectModel from "./projectModel";
import additiveReplacementModel from "./additiveReplacement";
import * as moment from 'moment';

class productModel {
  public product;
  public productPhoto;
  public productAdditives;
  public sharedProduct;
  public productAdditiveReplacements;
  public productReplacementLogs;
  public productReplacementLogsFiles;
  public productReplacementLogsTags;
  private users;
  public additives;
  private additivesFunctionalities;
  public additivesPlantReplacements;
  private additivesSynonyms;
  public plants;
  public plantsParts;
  public plantsFunctionalities;
  public plantsImages;
  public plantsPhysico;
  public plantsNutrional;
  public plantsOrganoleptic;
  public forms;
  public plantsExtraction;
  public functionalities;
  public foodCategory;
  public comment;
  public additiveReplacementGroup;
  public replacementGroupDetails;
  public productReplacementGroupLogs;
  public productReplacementGroupLogsFiles;
  public productReplacementGroupLogsTags;
  public productReplacementGroupAdditives;
  public productFormulation;
  public productFormulationDetails;
  public productformulationLogs;
  public productFormulationLogsFiles;
  public productFormulationLogsTags;
  public additiveReplacementTags;
  public productCategory ;

  public productTeamMembers;
  public teamMemberRoles;
  public productformulationkpi;


  constructor() {
    this.product = db.define(
      "user_product",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        product_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        product_category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        food_category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        completed_by: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        completed_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        label_image_path: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        is_test: {
          type: DataTypes.TINYINT,
          allowNull: true,
        },
      },
      {
        timestamps: false,
      }
    );
    this.productPhoto = db.define(
      "user_product_photo",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        photo_path: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        default_image: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        timestamps: false,
      }
    );

    this.productAdditives = db.define(
      "user_product_additives",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        additive_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        additive_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        timestamps: false,
      }
    );

    this.sharedProduct = db.define(
      "user_shared_products",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        shared_with: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        timestamps: false,
      }
    );

    this.productAdditiveReplacements = db.define(
      "user_product_additive_replacements",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        additives_plant_replacement_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        timestamps: false,
      }
    );

    this.productReplacementLogs = db.define(
      "user_product_replacement_logs",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_id: {
          type: DataTypes.INTEGER,
        },
        user_product_additive_replacement_id: {
          type: DataTypes.INTEGER,
        },
        comment: {
          type: DataTypes.TEXT,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        timestamps: false,
      }
    );

    this.productReplacementLogsFiles = db.define(
      "user_product_replacement_log_files",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_replacement_log_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        file: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        timestamps: false,
      }
    );

    this.productReplacementLogsTags = db.define(
      "user_product_replacement_log_tags",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_replacement_log_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        tag: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        timestamps: false,
      }
    );

    this.users = db.define(
      "users",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.additives = db.define(
      "additives",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        functionality_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        product_category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        food_category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        public_id: {
          type: DataTypes.STRING,
        },
        enumber: {
          type: DataTypes.STRING,
        },
        prior_research_ids: {
          type: DataTypes.STRING,
        },
        max_level: {
          type: DataTypes.STRING,
        },
        remarks: {
          type: DataTypes.STRING,
        },
        comments: {
          type: DataTypes.STRING,
        },
        is_ultraprocessed: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
        is_animal_based: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },         
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.additivesFunctionalities = db.define(
      "additives_functionalities",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        additive_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        functionality_id: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        additive_sub_part: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.additivesPlantReplacements = db.define(
      "additives_plant_replacements",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        plant_extraction_id: {
          type: DataTypes.INTEGER,
        },
        additive_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        plant_functionality_id: {
          type: DataTypes.INTEGER,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.additivesSynonyms = db.define(
      "additives_synonyms",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        additive_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        language_id: {
          type: DataTypes.INTEGER,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.plants = db.define(
      "plants",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        scientific_name: {
          type: DataTypes.STRING,
        },
        family: {
          type: DataTypes.STRING,
        },
        edible_use: {
          type: DataTypes.STRING,
        },
        edible_parts: {
          type: DataTypes.STRING,
        },
        remarks: {
          type: DataTypes.STRING,
        },
        comment: {
          type: DataTypes.STRING,
        },
        source_database: {
          type: DataTypes.NUMBER,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        geo_area: {
          type: DataTypes.STRING,
        },
        is_original: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.plantsFunctionalities = db.define(
      "plants_functionalities",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        plant_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        plant_part_id: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        functionality_id: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        explanation: {
          type: DataTypes.STRING,
        },
        bio_active_compounds: {
          type: DataTypes.STRING,
        },
        edible_parts: {
          type: DataTypes.STRING,
        },
        source_link: {
          type: DataTypes.STRING,
        },
        source_id: {
          type: DataTypes.INTEGER,
        },
        source: {
          type: DataTypes.STRING,
        },
        comment: {
          type: DataTypes.STRING,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.forms = db.define(
      "forms",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.plantsExtraction = db.define(
      "plants_extraction",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        plant_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        plant_part_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        form_id: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        preparation: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.plantsParts = db.define(
      "plants_parts",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.plantsImages = db.define(
      "plants_images",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        plant_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        file_name: {
          type: DataTypes.STRING,
        },
        file_path: {
          type: DataTypes.STRING,
        },
        default: {
          type: DataTypes.INTEGER,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.plantsPhysico = db.define(
      "plants_physicochemical_properties",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        plant_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        plant_extraction_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        melting_freezing_point: {
          type: DataTypes.STRING,
        },
        boiling_point: {
          type: DataTypes.STRING,
        },
        pka: {
          type: DataTypes.INTEGER,
        },
        ph_maximum_concentration: {
          type: DataTypes.STRING,
        },
        ec: {
          type: DataTypes.STRING,
        },
        moisture: {
          type: DataTypes.INTEGER,
        },
        coefficent_of_expansion: {
          type: DataTypes.STRING,
        },
        porosity: {
          type: DataTypes.STRING,
        },
        density: {
          type: DataTypes.INTEGER,
        },
        flammability: {
          type: DataTypes.STRING,
        },
        thermal_stability: {
          type: DataTypes.STRING,
        },
        viscosity: {
          type: DataTypes.INTEGER,
        },
        gelification_emulsification: {
          type: DataTypes.STRING,
        },
        crystallization: {
          type: DataTypes.INTEGER,
        },
        adhesive_strength: {
          type: DataTypes.STRING,
        },
        cohesive_strength: {
          type: DataTypes.STRING,
        },
        leavening_power: {
          type: DataTypes.INTEGER,
        },
        mic_mlc_microbial: {
          type: DataTypes.STRING,
        },
        oxidation: {
          type: DataTypes.INTEGER,
        },
        compressive_strength: {
          type: DataTypes.STRING,
        },
        tensile_strength: {
          type: DataTypes.STRING,
        },
        shear_resistance: {
          type: DataTypes.INTEGER,
        },
        impact: {
          type: DataTypes.INTEGER,
        },
        others: {
          type: DataTypes.INTEGER,
        },
        antioxidant_acitivity: {
          type: DataTypes.INTEGER,
        },
        emulsion_stability: {
          type: DataTypes.INTEGER,
        },
        emulsion_ability: {
          type: DataTypes.INTEGER,
        },
        foam_ability: {
          type: DataTypes.INTEGER,
        },
        foam_capacity: {
          type: DataTypes.INTEGER,
        },
        water_holding_capacity: {
          type: DataTypes.INTEGER,
        },
        oil_holding_capacity: {
          type: DataTypes.INTEGER,
        },
        hlb: {
          type: DataTypes.NUMBER,
        },
        relative_sweetness: {
          type: DataTypes.DECIMAL,
        },
        glycemic_index: {
          type: DataTypes.DECIMAL,
        },
        zeta_potential: {
          type: DataTypes.DECIMAL,
        },
        least_gelation_concentration: {
          type: DataTypes.INTEGER,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.plantsNutrional = db.define(
      "plants_nutrional_properties",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        plant_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        plant_extraction_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        calories: {
          type: DataTypes.STRING,
        },
        proteins: {
          type: DataTypes.STRING,
        },
        net_carbohydrates: {
          type: DataTypes.INTEGER,
        },
        free_sugars: {
          type: DataTypes.STRING,
        },
        sodium: {
          type: DataTypes.STRING,
        },
        total_fats: {
          type: DataTypes.INTEGER,
        },
        saturated_fats: {
          type: DataTypes.STRING,
        },
        mono_insaturated_fats: {
          type: DataTypes.STRING,
        },
        poly_insaturated_fats: {
          type: DataTypes.INTEGER,
        },
        trans_fats: {
          type: DataTypes.STRING,
        },
        cholesterol: {
          type: DataTypes.STRING,
        },
        total_fiber: {
          type: DataTypes.INTEGER,
        },
        soluble_fiber: {
          type: DataTypes.STRING,
        },
        insoluble_fiber: {
          type: DataTypes.INTEGER,
        },
        vitamins: {
          type: DataTypes.STRING,
        },
        minerals: {
          type: DataTypes.STRING,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.plantsOrganoleptic = db.define(
      "plants_organoleptic_sensory_properties",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        plant_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        plant_extraction_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        form_shape_size: {
          type: DataTypes.STRING,
        },
        taste_purge_trap: {
          type: DataTypes.STRING,
        },
        juiciness: {
          type: DataTypes.INTEGER,
        },
        greasiness: {
          type: DataTypes.STRING,
        },
        texture: {
          type: DataTypes.STRING,
        },
        hardness: {
          type: DataTypes.STRING,
        },
        plasticity: {
          type: DataTypes.STRING,
        },
        elasticity: {
          type: DataTypes.STRING,
        },
        sound: {
          type: DataTypes.STRING,
        },
        smell: {
          type: DataTypes.INTEGER,
        },
        color_appearance: {
          type: DataTypes.STRING,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.functionalities = db.define(
      "functionalities",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.foodCategory = db.define(
      "food_categories",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.comment = db.define(
      "user_product_comments",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        comment: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        timestamps: false,
      }
    );

    this.replacementGroupDetails = db.define(
      "user_product_replacements_groups_details",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        additives_plant_replacement_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        group_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        percentage: {
          type: DataTypes.JSON,
          allowNull: false,
        },
      },
      {
        timestamps: false,
      }
    );

    this.additiveReplacementGroup = db.define(
      "user_product_replacements_groups",
      {
        group_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        group_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        is_from_FA:{
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        orig_group_id:{
          type: DataTypes.INTEGER,
          allowNull: true,
        }
      },
      {
        timestamps: false,
        freezeTableName:true
      }
    );

    this.productReplacementGroupLogs = db.define(
      "user_product_replacement_group_logs",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_id: {
          type: DataTypes.INTEGER,
        },
        user_product_additive_replacement_group_id: {
          type: DataTypes.INTEGER,
        },
        comment: {
          type: DataTypes.TEXT,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        timestamps: false,
        freezeTableName :true
      }
    );

    this.productReplacementGroupLogsFiles = db.define(
      "user_product_replacement_group_log_files",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_replacement_group_log_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        file: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        timestamps: false,
      }
    );

    this.productReplacementGroupLogsTags = db.define(
      "user_product_replacement_group_log_tags",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_replacement_group_log_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        tag: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        timestamps: false,
      }
    );

    this.productReplacementGroupAdditives = db.define(
      "user_product_replacements_groups_additives",
      {
        group_id: {
          type: DataTypes.INTEGER,
        },
        additive_id: {
          type: DataTypes.INTEGER,
        }
      },
      {
        timestamps: false,
        freezeTableName: true
      }
    );

    this.productFormulation = db.define(
      "user_product_formulations",
      {
        formulation_id: {
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        formulation_name: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        prepared_by_user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,          
        },
        conducted_by_user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,          
        },
        approved_by_user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,          
        },
        prepration_steps: {
          type: DataTypes.STRING,
          allowNull: true,          
        },
        formulation_result: {
          type: DataTypes.TINYINT,
          allowNull: true,          
        },
      },
      {
        timestamps: false,
        freezeTableName:true
      }
    );

    this.productformulationkpi = db.define("user_product_formulation_kpi", {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_product_formulation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_product_kpi_lookup_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_product_kpi_lookup_value: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_product_kpi_lookup_result: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      timestamps: false,
      freezeTableName: true
    })


    this.productFormulationDetails = db.define(
      "user_product_formulation_details",
      {
        formulation_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        additives_plant_replacement_id: {
          type: DataTypes.INTEGER,
        },
        replacement_group_id: {
          type: DataTypes.INTEGER,
        },
        user_product_additives_id: {
          type: DataTypes.INTEGER,
        },
        percentage: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        additive_id: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
        freezeTableName: true
      }
    );


    this.productformulationLogs = db.define(
      "user_product_formulation_logs",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_id: {
          type: DataTypes.INTEGER,
        },
        user_product_formulation_id: {
          type: DataTypes.INTEGER,
        },
        comment: {
          type: DataTypes.TEXT,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        timestamps: false,
      }
    );

    this.productFormulationLogsFiles = db.define(
      "user_product_formulation_log_files",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_formulation_log_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        file: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        timestamps: false,
      }
    );

    this.productFormulationLogsTags = db.define(
      "user_product_formulation_log_tags",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_formulation_log_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        tag: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        timestamps: false,
        freezeTableName:true
      }
    );

    this.additiveReplacementTags = db.define(
      "additives_replacements_tag",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        additive_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        additives_plant_replacement_id: {
          type: DataTypes.INTEGER,
        },
        additives_group_replacement_id: {
          type: DataTypes.INTEGER,
        },
        product_category: {
          type: DataTypes.INTEGER,
        },
        food_category: {
          type: DataTypes.INTEGER,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
        created_by: {
          type: DataTypes.INTEGER,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
        created_at: {
          type: DataTypes.DATE,
        },
      },
      {
        timestamps: false,
        freezeTableName: true,
      }
    );

    this.productCategory = db.define(
      "product_categories",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );

    this.productTeamMembers = db.define("user_product_team_members", {
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			user_product_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
            team_member_role_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
			},
			created_by: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			updated_at: {
				type: DataTypes.DATE
			},
			updated_by: {
				type: DataTypes.INTEGER,
			},
		}, {
				timestamps: false
		});

        this.teamMemberRoles = db.define("team_member_roles", {
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING,
                allowNull: false,
			},
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
			},
			created_by: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			updated_at: {
				type: DataTypes.DATE
			},
			updated_by: {
				type: DataTypes.INTEGER,
			},
		}, {
				timestamps: false
		});
  
    this.additiveReplacementTags.belongsTo(this.foodCategory, {
      as: "foodCategory",
      foreignKey: "food_category",
    });

    this.additiveReplacementTags.belongsTo(this.productCategory, {
      as: "productCategory",
      foreignKey: "product_category",
    });
  

    this.productFormulationDetails.removeAttribute('id');
    this.productReplacementGroupAdditives.removeAttribute('id');


    this.product.hasMany(this.productPhoto, {
      foreignKey: "user_product_id",
      as: "product_photos",
    });
    this.productPhoto.belongsTo(this.product, { foreignKey: "id" });

    this.product.hasMany(this.productAdditives, {
      foreignKey: "user_product_id",
      as: "product_additives",
    });
    this.productAdditives.belongsTo(this.product, { foreignKey: "id" });

    this.additives.hasMany(this.productAdditives, {
      as: "additive",
      foreignKey: "additive_id",
    });

		this.additivesSynonyms.belongsTo(this.additives, { as: 'additives', foreignKey: 'additive_id' });
    this.productAdditives.belongsTo(this.additives, {
      foreignKey: "additive_id",
    });

    this.additives.belongsTo(this.foodCategory, {
      foreignKey: "food_category_id",
    });

    this.additives.belongsTo(this.functionalities, {
      foreignKey: "functionality_id",
      as: "functionalities1"
    });

    this.productAdditives.belongsToMany(this.functionalities, {
      through: this.additivesFunctionalities,
      uniqueKey: "product_additive_functionalities",
      sourceKey: "additive_id",
      foreignKey: "additive_id",
      otherKey: "functionality_id",
    });

    this.product.belongsTo(this.users, {
      foreignKey: "user_id",
      as: "product_users",
    });

    this.sharedProduct.belongsTo(this.product, {
      foreignKey: "user_product_id",
      as: "userProducts",
    });
    this.sharedProduct.belongsTo(this.users, { foreignKey: "shared_with" });

    this.additivesPlantReplacements.belongsTo(this.productAdditives, {
      foreignKey: "additive_id",
      targetKey: "additive_id",
      as: "productAdditive",
    });

    this.additivesPlantReplacements.belongsTo(this.plantsExtraction, {
      foreignKey: "plant_extraction_id",
      as: "plantExtractions",
    });

    this.plants.hasMany(this.plantsExtraction, {as: "plantExtraction", foreignKey: "plant_id" });
    this.plantsExtraction.belongsTo(this.plants, {
      foreignKey: "plant_id",
      as: "plant",
    });

    this.additivesPlantReplacements.belongsTo(this.plantsFunctionalities, {
      foreignKey: "plant_functionality_id",
      as: "plantFunctionality",
    });
    this.plantsFunctionalities.belongsTo(this.functionalities, {
      foreignKey: "functionality_id",
      as: "functionality",
    });

    this.plantsParts.hasMany(this.plantsExtraction, {
      foreignKey: "plant_part_id",
    });
    this.plantsExtraction.belongsTo(this.plantsParts, {
      foreignKey: "plant_part_id",
      as: "plantParts",
    });

    this.plants.hasMany(this.plantsImages, {
      foreignKey: "plant_id",
      as: "plantImages",
    });
    this.plantsImages.belongsTo(this.plants, { foreignKey: "id" });

    this.forms.hasMany(this.plantsExtraction, { foreignKey: "id" });
    this.plantsExtraction.belongsTo(this.forms, {
      foreignKey: "form_id",
      as: "plantForms",
    });

    this.plantsExtraction.hasOne(this.plantsNutrional, {
      foreignKey: "plant_extraction_id",
      sourceKey: "id",
      as: "plantNutrionalProperties",
    });
    this.plantsNutrional.belongsTo(this.plantsExtraction, { foreignKey: "id" });

    this.plantsExtraction.hasOne(this.plantsPhysico, {
      foreignKey: "plant_extraction_id",
      sourceKey: "id",
      as: "plantPhysicochemicalProperties",
    });
    this.plantsPhysico.belongsTo(this.plantsExtraction, { foreignKey: "id" });

    this.plantsExtraction.hasOne(this.plantsOrganoleptic, {
      foreignKey: "plant_extraction_id",
      sourceKey: "id",
      as: "plantOrganolepticSensoryProperties",
    });
    this.plantsOrganoleptic.belongsTo(this.plantsExtraction, {
      foreignKey: "id",
    });

    this.additivesPlantReplacements.hasOne(this.productAdditiveReplacements, {
      foreignKey: "additives_plant_replacement_id",
      as: "productAdditiveReplacements",
    });
    this.productAdditiveReplacements.belongsTo(
      this.additivesPlantReplacements,
      { foreignKey: "additives_plant_replacement_id" }
    );

    this.productAdditiveReplacements.hasOne(this.productReplacementLogs, {
      foreignKey: "user_product_additive_replacement_id",
      as: "productReplacementLog",
    });
    this.productReplacementLogs.hasMany(this.productReplacementLogsFiles, {
      foreignKey: "user_product_replacement_log_id",
      as: "productReplacementLogsFiles",
    });
    this.productReplacementLogs.hasMany(this.productReplacementLogsTags, {
      foreignKey: "user_product_replacement_log_id",
      as: "productReplacementLogsTags",
    });

    this.product.hasOne(this.comment, {
      foreignKey: "user_product_id",
      as: "product_comment",
    });
    this.comment.belongsTo(this.product, { foreignKey: "id" });

    this.productReplacementGroupLogs.hasMany(this.productReplacementGroupLogsFiles, { foreignKey: "user_product_replacement_group_log_id", as: "productReplacementGroupLogsFiles", });
    this.productReplacementGroupLogs.hasMany(this.productReplacementGroupLogsTags, { foreignKey: "user_product_replacement_group_log_id", as: "productReplacementGroupLogsTags", });
  
    this.productFormulationDetails.hasOne(this.productFormulation, {as: 'productFormulation', foreignKey: 'formulation_id', sourceKey: 'formulation_id'});
    this.productFormulation.hasMany(this.productFormulationDetails, { as: 'productFormulationDetails', foreignKey: 'formulation_id', targetKey: 'formulation_id' });

    // this.productFormulationDetails.hasOne(this.productAdditives, {as: 'productAdditives', foreignKey: 'id', sourceKey: 'additive_id'});
    // this.productAdditives.belongsTo(this.productFormulationDetails, { as: 'productFormulationDetails1', foreignKey: 'additive_id', targetKey: 'additive_id' });

    this.productFormulationDetails.hasOne(this.additiveReplacementGroup, { as: 'additiveReplacementGroup', foreignKey: 'group_id', sourceKey: 'replacement_group_id' });
    this.additiveReplacementGroup.belongsTo(this.productFormulationDetails, {as: 'productFormulationGroupDetails1', foreignKey: 'group_id', targetKey: 'replacement_group_id'});

    this.replacementGroupDetails.hasOne(this.additiveReplacementGroup, { as: 'additiveReplacementGroup', foreignKey: 'group_id', sourceKey: 'group_id' });
    this.additiveReplacementGroup.hasMany(this.replacementGroupDetails, {as: 'replacementGroupDetails', foreignKey: 'group_id', targetKey: 'group_id'});
    

    this.productFormulationDetails.hasOne(this.additivesPlantReplacements, {as: 'additivesPlantReplacements1', foreignKey: "id", sourceKey: 'additives_plant_replacement_id'});
   // this.additivesPlantReplacements.belongsTo(this.productFormulationDetails, {as: 'productFormulationGroupDetails1', foreignKey: 'additives_plant_replacement_id', targetKey: 'additives_plant_replacement_id'});

   this.productFormulationDetails.belongsTo(this.productAdditives, {as: 'productAdditives', foreignKey: 'user_product_additives_id', targetKey: 'id'});
   //this.productAdditives.belongsTo(this.productFormulationDetails, { as: 'productFormulationDetails1', foreignKey: 'user_product_additives_id', targetKey: 'user_product_additives_id' });

   this.productFormulationDetails.hasOne(this.productformulationLogs, {as: 'productFormulationLogs', foreignKey: 'user_product_formulation_id', sourceKey: 'formulation_id' })

 
    this.productformulationLogs.hasMany(this.productFormulationLogsFiles, { foreignKey: "user_product_formulation_log_id", as: "productFormulationLogsFiles", });
    this.productformulationLogs.hasMany(this.productFormulationLogsTags, { foreignKey: "user_product_formulation_log_id", as: "productFormulationLogsTags", });
  
  }


  

 
  public async deleteImageProduct(
    productId: number,
    imageIds: Array<number>,
    callback?: Function
  ) {
    try {
      const deleteWhereObj = {
        user_product_id: productId,
        status: 1,
      };
      if (imageIds.length) {
        deleteWhereObj["id"] = imageIds;
      }
      await this.productPhoto.update(
        { status: 0 },
        {
          where: deleteWhereObj,
        }
      );
      return callback && callback(false, null, "PRODUCT0019");
    } catch (error) {
      createLog(error, 'deleteImageProduct', { "imageIds": imageIds, "productId": productId }, "productsModel");
      return callback && callback(true, null, "GEN0004");
    }
  }



 

  

 

  public async findProductAdditivesByProductId(
    productId: number
  ): Promise<any> {
    return await this.productAdditives.findAll({
      where: {
        [Op.and]: [
          {
            user_product_id: productId,
            status: 1,
          },
        ],
      },
    });
  }

  private async findBulkProductAdditivesUsingArray(
    productId: number,
    additivesArray: string[]
  ): Promise<any> {
    return await this.productAdditives.findAll({
      where: {
        [Op.and]: [
          {
            user_product_id: productId,
            additive_name: {
              [Op.in]: additivesArray,
            },
            status: 1,
          },
        ],
      },
      include: [
        {
          model: this.additives,
          as: "additive",
          attributes: [
            "id",
            "name",
            "functionality_id",
            "product_category_id",
            "food_category_id",
            "public_id",
            "enumber",
            "prior_research_ids",
            "max_level",
            "is_ultraprocessed",
            "is_animal_based",
            "remarks",
            "comments",
          ],
          include: [
            {
              model: this.foodCategory,
              as: "food_category",
              attributes: ["id", "name", "description", "status"],
              required: false,
            },
          ],
        },
        {
          model: this.functionalities,
          as: "functionalities",
          attributes: ["id", "name", "description", "status"],
          required: false,
        },
      ],
      order: [["id", "DESC"]],
    });
  }

  private async productLabelImagePathUpdate(
    productId: number,
    label_image_path: string
  ): Promise<any> {
    return await this.product.update(
      { label_image_path },
      {
        where: {
          [Op.and]: [
            {
              id: productId,
              status: 1,
            },
          ],
        },
      }
    );
  }

  private async updatePreviousProductAdditivesStatus(
    productId: number
  ): Promise<any> {
    return await this.productAdditives.update(
      { status: 0 },
      {
        where: {
          [Op.and]: [
            {
              user_product_id: productId,
              status: 1,
            },
          ],
        },
      }
    );
  }
  private async updateExistedProductAdditivesNamesStatus(
    productId: number,
    ingredients: string[]
  ): Promise<any> {
    return await this.productAdditives.update(
      { status: 1 },
      {
        where: {
          [Op.and]: [
            {
              user_product_id: productId,
              additive_name: {
                [Op.in]: ingredients,
              },
              status: 0,
            },
          ],
        },
      }
    );
  }

  public async searchAndAddBulkProductAdditives(user_id: number, productId: number, appName: string, flagName: string, label_image: any[], ingredients: string[], addIngredient: string, callback: Function): Promise<any> {
    try {
      let error = false;
      let ingredientsSpace = ingredients.map(str => str.replace(/\s+/g, ''));

      const findProduct = await this.product.findOne({
        where: {
          [Op.and]: [
            {
              id: productId,
              user_id,
              status: 1,
            },
          ],
        },
        attributes: ["id", "product_category_id", "food_category_id"],
      });
      if (!findProduct) {
        error = !findProduct;
        return callback(error, null, "PRODUCT0007");
      } else {
        if (label_image.length > 0 && addIngredient === "false") {
          await this.productLabelImagePathUpdate(
            productId,
            label_image[0].label_image_path
          );
        } else if (addIngredient === "false") {
          await this.productLabelImagePathUpdate(productId, "");
        }

        if (addIngredient === "false") {
          const FindExistingProductAdditivesByProductId =
            await this.findProductAdditivesByProductId(productId);
          if (FindExistingProductAdditivesByProductId.length > 0) {
            await this.updatePreviousProductAdditivesStatus(productId);
          }
        }
        await this.updateExistedProductAdditivesNamesStatus(
          productId,
          ingredients
        );
        const SearchedProductAdditives =
          await this.findBulkProductAdditivesUsingArray(productId, ingredients);
        let whereCondition;
        let whereSynonymsCondition;
        projectModel.getProjectSetting (appName, flagName, async (error: boolean, projectSetting: any, code: string) => {
          if (flagName && projectSetting[0].flag_value === 1) {

              whereCondition = {
                [Op.or]: [
                  {
                    name: { [Op.in]: ingredients, },
                  },{
                    name: { [Op.in]: ingredientsSpace, },
                  },
                  {
                    [Op.and]: [
                      {
                        [Op.or]: [
                          { is_ultraprocessed: 1, },
                          { is_animal_based: 1 },
                        ]
                      },
                      { name: { [Op.in]: ingredients, }, },
                    ]
                  },
                  {
                    enumber: { [Op.in]: ingredients, },
                  },
                ],
              };
              whereSynonymsCondition = {
                [Op.or]: [
                  {
                    name: { [Op.in]: ingredients, },
                  },{
                    name: { [Op.in]: ingredientsSpace, },
                  },
                  {
                    [Op.and]: [{
                      [Op.or]: [
                        { '$additives.is_ultraprocessed$': 1, },
                        { '$additives.is_animal_based$': 1 },
                      ]
                    },
                    { name: { [Op.in]: ingredients, }, },
                    ]
                  },
                ],
              };
            }
            if (!flagName || projectSetting[0].flag_value == 0) {

              whereCondition = {
                [Op.or]: [
                  {
                    [Op.and]: [
                      { product_category_id: findProduct.product_category_id, },
                      { food_category_id: findProduct.food_category_id },
                      { name: { [Op.in]: ingredients, }, },
                    ]
                  },
                  {
                    [Op.and]: [
                      { product_category_id: findProduct.product_category_id, },
                      { food_category_id: findProduct.food_category_id },
                      { name: { [Op.in]: ingredientsSpace, }, },
                    ]
                  },
                  {
                    [Op.and]: [
                      {
                        [Op.or]: [
                          { is_ultraprocessed: 1, },
                          { is_animal_based: 1 },
                        ]
                      },
                      { name: { [Op.in]: ingredients, }, },
                    ]
                  },
                  {
                    [Op.and]: [
                      { product_category_id: findProduct.product_category_id, },
                      { food_category_id: findProduct.food_category_id },
                      { enumber: { [Op.in]: ingredients, }, },
                    ]
                  },
                ],
              };
            
              whereSynonymsCondition = {
                [Op.or]: [
                  {
                    [Op.and]: [
                      { '$additives.product_category_id$': findProduct.product_category_id, },
                      { '$additives.food_category_id$': findProduct.food_category_id },
                      { name: { [Op.in]: ingredients, }, },
                    ]
                  },
                  {
                    [Op.and]: [
                      { '$additives.product_category_id$': findProduct.product_category_id, },
                      { '$additives.food_category_id$': findProduct.food_category_id },
                      { name: { [Op.in]: ingredientsSpace, }, },
                    ]
                  },
                  {
                    [Op.and]: [{
                      [Op.or]:[
                        {'$additives.is_ultraprocessed$': 1, },
                        {'$additives.is_animal_based$': 1 },
                      ]
                    },
                    { name: { [Op.in]: ingredients, }, },
                    ]
                  },
                ],
              }
            }
            const SearchedAdditives = await this.additives.findAll({
            where: whereCondition,
            attributes: ["id", "name", "enumber"],
            logging: message => {
              console.log(message);
            }
          });
          const SearchedSynonyms = await this.additivesSynonyms.findAll({
            include: [{
              model: this.additives,
              as: 'additives',
              attributes: [],
              required: true
            }],
            where: whereSynonymsCondition,
            attributes: ["id", "name", "additive_id"],
          });
          let CheckNotSearchedAdditives: string[] = ingredients.filter(
            (req: string) =>
              !SearchedProductAdditives.some(
                (res: any) =>
                  req.toLowerCase() === res.additive_name.toLowerCase()
              )
          );
          if (CheckNotSearchedAdditives.length > 0) {
            let lowerCaseNames = CheckNotSearchedAdditives.map((obj: any) =>
              obj.toLowerCase()
            );
            let filterExistedNames = SearchedAdditives.map((obj: any) =>
              obj.name.toLowerCase());

            filterExistedNames.push(...SearchedAdditives.map((obj: any) =>
              obj.enumber && obj.enumber.toLowerCase()));

            let filterExistedSynonymNames = SearchedSynonyms.map((obj: any) =>
              obj.name.toLowerCase()
            );
            let filterNotExistedNames = lowerCaseNames
              .filter(
                (value: any) =>
                  !filterExistedNames.includes(value) &&
                  !filterExistedSynonymNames.includes(value)
              )
              .map((additive_name: any) => additive_name);
            let FilterExistSynonymInDatabase = SearchedSynonyms.filter(
              (obj: any) => lowerCaseNames.includes(obj.name.toLowerCase())
            ).map((obj: any) => ({
              user_product_id: productId,
              additive_name: obj.name,
              additive_id: obj.additive_id,
              status: 1,
            }));
            let FilterExistInDatabse = SearchedAdditives.filter((obj: any) =>
              lowerCaseNames.includes(obj.name.toLowerCase()) ||
              (obj.enumber && lowerCaseNames.includes(obj.enumber.toLowerCase())
              )
            ).map((obj: any) => ({
              user_product_id: productId,
              additive_name: obj.name,
              additive_id: obj.id,
              status: 1,
            }));
            let FilterNotExistInDatabse = CheckNotSearchedAdditives.filter(
              (value: any) =>
                !filterExistedNames.includes(value.toLowerCase()) &&
                !filterExistedSynonymNames.includes(value.toLowerCase())
            ).map((additive_name: any) => ({
              user_product_id: productId,
              additive_name,
              additive_id: null,
              status: 1,
            }));
            let InsertBulkNotSearchedProductAdditives: any = [
              ...FilterExistInDatabse,
              ...FilterExistSynonymInDatabase,
              ...FilterNotExistInDatabse,
            ];
            const newUserProductAdditives = await this.productAdditives.bulkCreate(
              InsertBulkNotSearchedProductAdditives
            );
            const userProductAdditiveIds = newUserProductAdditives.filter(dd => dd.additive_id).map(obj => obj.additive_id);
            let getAdditiveReplacementData = [];
            if(userProductAdditiveIds.length){
              userProductAdditiveIds.forEach(async (obj: number) => {
                const requestBody = {body: {}}
                getAdditiveReplacementData = await additiveReplacementModel.getAdditiveReplacementGroupDetails(obj, requestBody, function (error: boolean, code: string, data: any) {
                  if (error) {
                      return [];
                  } else {
                      return data.rowList || [];
                  }
              });
              if(getAdditiveReplacementData.length){
                getAdditiveReplacementData.forEach(async (obj) => {
                  await this.createReplacementGroupFromFA(productId, user_id, obj.data);
                })
              }
            })
          }
            const SearchedProductAdditivesFromAdditives =
              await this.findBulkProductAdditivesUsingArray(productId, [
                ...filterExistedNames,
                ...filterExistedSynonymNames,
              ]);
            const NotSearchedProductAdditives =
              await this.findBulkProductAdditivesUsingArray(
                productId,
                filterNotExistedNames
              );
            const searchedProductAdditives: any =
              SearchedProductAdditives.length > 0
                ? [
                  ...SearchedProductAdditives,
                  ...SearchedProductAdditivesFromAdditives,
                ]
                : SearchedProductAdditivesFromAdditives;
            return callback(
              false,
              {
                SearchedProductAdditives: searchedProductAdditives,
                NotSearchedProductAdditives,
              },
              "PRODUCT0021"
            );
          } else {
            return callback(
              false,
              { SearchedProductAdditives, NotSearchedProductAdditives: [] },
              "PRODUCT0021"
            );
          }
        });
      }
        
    } catch (error) {
        console.log(error)
        createLog(error, 'searchAndAddBulkProductAdditives', {
          "userId": user_id, "productId": productId,
          "label_image": label_image,
          "ingredients": ingredients,
          "addIngredient": addIngredient
        }, "productsModel");

        return callback(true, null, "GEN0004");
    }
  }

  public async editProductAdditive(
    user_id: number,
    appName,
    flagName,
    productAdditive: any,
    callback: Function
  ): Promise<any> {
    try {
      await this.deleteProductAdditive(
        user_id,
        productAdditive.user_product_id,
        productAdditive.id
      );
      await this.searchAndAddBulkProductAdditives(
        user_id,
        productAdditive.user_product_id,
        appName,
        flagName,
        [],
        [productAdditive.additive_name],
        "true",
        function (error: boolean, data: any, code: string) {
          if (error) {
            return callback(true, null, "GEN0004");
          } else {
            return callback(false, data, "PRODUCT0022");
          }
        }
      );
    } catch (error) {
      createLog(error, 'editProductAdditive', {
        "userId": user_id, "productAdditive": productAdditive,
      }, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }

  public async deleteProductAdditive(
    user_id: number,
    productId: number,
    productAdditiveId: number,
    callback?: Function
  ): Promise<any> {
    try {
      let error = false;
      const findProduct = await this.product.findOne({
        where: {
          [Op.and]: [
            {
              id: productId,
              user_id,
              status: 1,
            },
          ],
        },
      });
      const findProductAdditive = await this.productAdditives.findOne({
        where: {
          [Op.and]: [
            { id: productAdditiveId, user_product_id: productId, status: 1 },
          ],
        },
      });

      if (!findProduct) {
        error = !findProduct;
        return callback(error, null, "PRODUCT0007");
      } else if (!findProductAdditive) {
        error = !findProductAdditive;
        return callback(error, null, "PRODUCT0038");
      } else {
        await this.productAdditives.destroy(         
          {
            where: { [Op.and]: [{ id: productAdditiveId,user_product_id: productId}] },
          }
        );
        return callback && callback(false, null, "PRODUCT0023");
      }
    } catch (error) {
      createLog(error, 'deleteProductAdditive', {
        "userId": user_id, "productAdditiveId": productAdditiveId, "productId": productId
      }, "productsModel");
      return callback && callback(true, null, "GEN0004");
    }
  }

  public async updateDefaultImage(
    user_id: number,
    productId: number,
    imageId: number,
    callback: Function
  ) {
    try {
      let error = false;
      const findProduct = await this.product.findOne({
        where: {
          [Op.and]: [
            {
              id: productId,
              user_id,
              status: 1,
            },
          ],
        },
      });
      if (!findProduct) {
        error = !findProduct;
        return callback(error, null, "PRODUCT0007");
      } else {
        await this.productPhoto.update(
          { default_image: false },
          {
            where: {
              [Op.and]: [
                {
                  id: {
                    [Op.not]: imageId,
                  },
                  user_product_id: productId,
                  status: 1,
                },
              ],
            },
          }
        );
        await this.productPhoto.update(
          { default_image: true },
          {
            where: {
              [Op.and]: [
                {
                  id: imageId,
                  user_product_id: productId,
                  status: 1,
                },
              ],
            },
          }
        );
        return callback(false, null, "PRODUCT0024");
      }
    } catch (error) {
      createLog(error, 'deleteProductAdditive', {
        "userId": user_id, "imageId": imageId, "productId": productId,
      }, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }

  public async updateStatusForCompleteProduct(
    productId: number,
    user_id: number,
    callback: Function
  ) {
    try {
      const presentDateTime = new Date();
      let error = false;
      const findProduct = await this.product.findOne({
        where: {
          [Op.and]: [
            {
              id: productId,
              user_id,
              status: 1,
            },
          ],
        },
      });
      if (!findProduct) {
        error = !findProduct;
        return callback(error, "PRODUCT0007");
      } else {
        await this.product.update(
          { completed_at: presentDateTime, completed_by: user_id },
          {
            where: {
              [Op.and]: [
                {
                  id: productId,
                  user_id,
                  status: 1,
                },
              ],
            },
          }
        );
        return callback(false, "PRODUCT0025");
      }
    } catch (error) {
      createLog(error, 'updateStatusForCompleteProduct', {
        "userId": user_id, "productId": productId,
      }, "productsModel");
      return callback(true, "GEN0004");
    }
  }

  public async addShareProduct(
    user_id: number,
    productId: number,
    encryptedProductId: string,
    emailsArray: string[],
    callback: Function
  ): Promise<any> {
    try {
      let error = false;
      const findProduct = await this.product.findOne({
        where: { [Op.and]: [{ id: productId, user_id, status: 1 }] },
      });
      if (!findProduct) {
        error = !findProduct;
        return callback(error, null, "PRODUCT0007");
      } else {
        const SharedWith = await this.sharedProduct.findAll({
          where: {
            [Op.and]: [
              {
                user_product_id: productId,
                status: 1,
              },
            ],
          },
        });
        const UserData = await this.users.findAll({
          where: {
            [Op.and]: [
              {
                id: {
                  [Op.ne]: user_id,
                },
                email: {
                  [Op.in]: emailsArray,
                },
                status: 1,
              },
            ],
          },
        });
        const loggedInUserData = await this.users.findOne({
          where: { id: user_id, status: 1 },
        });
        const FilterEmailNotExistInDatabse: string[] = emailsArray.filter(
          (req: string) =>
            !UserData.some(
              (res: any) => req.toLowerCase() === res.email.toLowerCase()
            )
        );
        const filterExistedUserId = SharedWith.map(
          (obj: any) => obj.shared_with
        );
        const filterExistedEmails = UserData.filter((obj: any) =>
          filterExistedUserId.includes(obj.id)
        ).map((obj: any) => obj.email);
        const FilterEmailSharedWith = UserData.filter(
          (obj: any) => !filterExistedUserId.includes(obj.id)
        ).map((obj: any) => obj);
        const FilterEmailsExistInDatabse = UserData.filter(
          (obj: any) => !filterExistedUserId.includes(obj.id)
        ).map((obj: any) => ({
          user_product_id: productId,
          shared_with: obj.id,
          status: 1,
        }));
        let userName: string =
          loggedInUserData.first_name + " " + loggedInUserData.last_name;
        let emailSharedWithInRes = FilterEmailSharedWith.map(
          (obj: any) => obj.email
        );
        let templateKeys: { [key: string]: any } = {
          SENDERNAME: userName,
          SHAREDPRODUCTLINK: `${
            process.env.FE_APP_NAME +
            process.env.FE_PRODUCT_DETAIL_URL +
            encryptedProductId
          }`,
        };

        let subjectKeys: { [key: string]: any } = {};

        if (FilterEmailsExistInDatabse.length > 0) {
          FilterEmailSharedWith.map((to: any) => {
            templateKeys["NAME"] = to.first_name + " " + to.last_name;
            emailTemplate.sendEmailTemplate(
              process.env.CREATE_SHARED_USER_EMAIL_TEMPLATE_ID,
              to.email,
              subjectKeys,
              templateKeys,
              (err) => {}
            );
          });
          await this.sharedProduct.bulkCreate(FilterEmailsExistInDatabse);
          return callback(
            false,
            {
              EmailSharedWith: emailSharedWithInRes,
              EmailAlreadySharedWith: filterExistedEmails,
              EmailNotExisted: FilterEmailNotExistInDatabse,
            },
            "PRODUCT0027"
          );
        } else {
          return callback(
            false,
            {
              EmailSharedWith: emailSharedWithInRes,
              EmailAlreadySharedWith: filterExistedEmails,
              EmailNotExisted: FilterEmailNotExistInDatabse,
            },
            "PRODUCT0027"
          );
        }
      }
    } catch (error) {
      createLog(error, 'addShareProduct', {
        "userId": user_id, "productId": productId, "encryptedProductId": encryptedProductId,
        "emailsArray": emailsArray
      }, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }

  public async getSharedProductsList(
    user_id: number,
    keyword: string,
    page: number,
    size: number,
    callback: Function
  ): Promise<any> {
    try {
      let check = false;
      const limit = size ? size : parseInt(process.env.DEFAULT_RECORDS_LIMIT);
      const offset =
        page > 1
          ? (page - 1) * limit
          : parseInt(process.env.DEFAULT_RECORDS_OFFSET);
      const queryCheck = {
        where: {
          [Op.and]: [
            {
              shared_with: user_id,
              status: 1,
            },
          ],
        },
        include: [
          {
            model: this.product,
            as: "userProducts",
            where: {
              status: 1,
              ...(keyword
                ? { product_name: { [Op.like]: `%${keyword}%` } }
                : {}),
            },
            required: true,
            include: [
              {
                model: this.users,
                as: "product_users",
                where: {
                  status: 1,
                },
                required: true,
                attributes: [
                  ["id", "id"],
                  ["email", "email"],
                  ["first_name", "first_name"],
                  ["last_name", "last_name"],
                  "status",
                ],
              },
              {
                model: this.productPhoto,
                as: "product_photos",
                required: false,
                where: {
                  status: 1,
                },
              },
            ],
          },
        ],
        distinct: true,
        order: [
          ["id", "DESC"],
          ["userProducts", "product_photos", "default_image", "DESC"],
        ],
        limit,
        offset,
      };
      let sharedProductsData = await this.sharedProduct.findAndCountAll(
        queryCheck
      );
      sharedProductsData = JSON.parse(JSON.stringify(sharedProductsData));
      if (sharedProductsData === null) {
        check = true;
      }
      return callback(check, sharedProductsData, "PRODUCT0028");
    } catch (error) {
      createLog(error, 'getSharedProductsList', {
        "userId": user_id, "keyword": keyword
      }, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }

  public async getEmailsProductAlreadyShareWithList(
    user_id: number,
    productId: number,
    callback: Function
  ): Promise<any> {
    try {
      let error = false;
      const findProduct = await this.product.findOne({
        where: { [Op.and]: [{ id: productId, user_id, status: 1 }] },
      });
      if (!findProduct) {
        error = !findProduct;
        return callback(error, null, "PRODUCT0007");
      } else {
        let ProductAlreadySharedWithEmailsData =
          await this.sharedProduct.findAll({
            where: {
              [Op.and]: [
                {
                  user_product_id: productId,
                  status: 1,
                },
              ],
            },
            include: {
              model: this.users,
              where: { status: 1 },
              required: false,
            },
            order: [["id", "DESC"]],
          });
        ProductAlreadySharedWithEmailsData = JSON.parse(
          JSON.stringify(ProductAlreadySharedWithEmailsData)
        );

        return callback(
          false,
          ProductAlreadySharedWithEmailsData,
          "PRODUCT0029"
        );
      }
    } catch (error) {
      createLog(error, 'getEmailsProductAlreadyShareWithList', {
        "userId": user_id, "productId": productId
      }, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }

  public async RevokeEmailWithUserIdProductAlreadyShareWith(
    userId: number,
    productId: number,
    callback: Function
  ): Promise<any> {
    try {
      await this.sharedProduct.update(
        { status: 0 },
        {
          where: {
            [Op.and]: [
              { shared_with: userId, user_product_id: productId, status: 1 },
            ],
          },
        }
      );
      return callback(false, {}, "PRODUCT0030");
    } catch (error) {
      createLog(error, 'RevokeEmailWithUserIdProductAlreadyShareWith', {
        "userId": userId, "productId": productId
      }, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }

  public async SearchProductReplacements(
    user_id: number,
    productId: number,
    additivesId: number[],
    callback: Function
  ): Promise<any> {
    try {
      let error = false;
      let allFunctionalityArr = []
      let allPlantPartsArr = []
      let allFormsArr = []
      let allProductAdditiveArr = []
      let allProductAdditiveReplacementArr = []
      const findProduct = await this.product.findOne({
        where: { [Op.and]: [{ id: productId, user_id, status: 1 }] },
      });
      if (!findProduct) {
        error = !findProduct;
        return callback(error, null, "PRODUCT0007");
      } else {
        
        const FindAdditivesPlantsReplacements =
          await this.additivesPlantReplacements.findAndCountAll({
            where: { additive_id: { [Op.in]: additivesId } },
            attributes: ["id", "additive_id","plant_functionality_id"],
            include: [
              {
                model: this.plantsExtraction,
                attributes: ["id", "plant_id","plant_part_id","form_id","status"],
                as: "plantExtractions",
                where: {
                  status: 1,
                },
                required: true,
              },
            ],
            distinct: true,
            order: [
              ["plant_extraction_id", "DESC"],
            ],
          }).catch(err => console.log(err))

          const allPlantParts = await this.plantsParts.findAll({
            attributes: ["id","name"],
            where: {status:1}
          })
          const allForms = await this.forms.findAll({
            attributes: ["id","name"],
            where: {status:1}
          })
          const allFunctionality = await this.functionalities.findAll({
            attributes:  ["id","name"],
          }).catch(err => console.log(err))
          const productAdditive = await this.productAdditives.findAll({
            where: {
              [Op.and]: [{ user_product_id: productId, status: 1 }],
            },
            attributes: [
              "id",
              "user_product_id",
              "additive_name",
              "additive_id",
              "status",
            ],
            required: true,
            include: [
              {
                model: this.additives,
                attributes: ["id", "name","functionality_id"],
                required: true,
              },
            ],
          })

          const productAdditiveReplacements = await this.productAdditiveReplacements.findAll({
            where: {
              [Op.and]: [{ user_product_id: productId, status: 1 }],
            },
            attributes: [
              "id",
              "user_product_id",
              "additives_plant_replacement_id",
              "status",
            ],
          })
          
          allPlantPartsArr = JSON.parse(JSON.stringify(allPlantParts))
          allFormsArr = JSON.parse(JSON.stringify(allForms))
          allProductAdditiveArr= JSON.parse(JSON.stringify(productAdditive))
          allProductAdditiveReplacementArr=JSON.parse(JSON.stringify(productAdditiveReplacements))

          let dataArr = []
          let functionalityIds = []
          let plantIds = []
          let FindAdditivesPlantsReplacements2 = []
          let allPlantsArr = []
          let allPlantphysicoArr = []
          let allplantsOrganolepticArr = []
          if (FindAdditivesPlantsReplacements) {
            FindAdditivesPlantsReplacements.rows.forEach( data => {
              dataArr =  JSON.parse(JSON.stringify(data))
              plantIds.push(dataArr["plantExtractions"]["plant_id"])
              functionalityIds.push(dataArr["plant_functionality_id"])
            })
         

          const allPlants = await this.plants.findAll({
            attributes: [
              ["id", "plant_id"],
              ["name", "plant_name"],
              ["geo_area", "geo_area"],
            ],
            include: [
              {
                model: this.plantsImages,
                as: "plantImages",
                attributes: [
                  "id",
                  "plant_id",
                  "file_name",
                  "file_path",
                  "default",
                  "status",
                ],
                where: {
                  status: 1,
                },
                required: false,
              },
            ],
            where: { id : {[Op.in]:plantIds}}
          }).catch(err => console.log(err)) 
          const allPlantphysico = await this.plantsPhysico.findAll({
            where: { plant_id : {[Op.in]:plantIds}}
          }).catch(err => console.log(err))
          
          const allplantsOrganoleptic = await this.plantsOrganoleptic.findAll({
            where: { plant_id : {[Op.in]:plantIds}}
          }).catch(err => console.log(err));
          allFunctionalityArr = JSON.parse(JSON.stringify(allFunctionality))
          allPlantsArr = JSON.parse(JSON.stringify(allPlants))
          allPlantphysicoArr = JSON.parse(JSON.stringify(allPlantphysico))
          allplantsOrganolepticArr = JSON.parse(JSON.stringify(allplantsOrganoleptic))
          FindAdditivesPlantsReplacements.rows.forEach( data => {
            dataArr =  JSON.parse(JSON.stringify(data))
            if(dataArr["additive_id"] && allProductAdditiveArr.find(e => e.additive_id === dataArr["additive_id"])){
              dataArr["productAdditive"] = allProductAdditiveArr.find(e => e.additive_id === dataArr["additive_id"])
            }
            if(dataArr["id"] && allProductAdditiveReplacementArr.find(e => e.additives_plant_replacement_id === dataArr["id"])){
              dataArr["productAdditiveReplacements"] = allProductAdditiveReplacementArr.find(e => e.additives_plant_replacement_id === dataArr["id"])
            }
            if(dataArr["productAdditive"] && dataArr["productAdditive"]["additive"] && dataArr["productAdditive"]["additive"]["functionality_id"]  && allFunctionalityArr.find(e => e.id === dataArr["productAdditive"]["additive"]["functionality_id"])){
              dataArr["functionality_name"] = allFunctionalityArr.find(e => e.id === dataArr["productAdditive"]["additive"]["functionality_id"]).name
            }
            if(dataArr["plantExtractions"]["form_id"]){
              dataArr["plants_form_name"] = allFormsArr.find(e => e.id === dataArr["plantExtractions"]["form_id"]).name
            }
            if(dataArr["plantExtractions"]["plant_part_id"]){
              dataArr["plant_part_name"] = allPlantPartsArr.find(e => e.id === dataArr["plantExtractions"]["plant_part_id"]).name
            }
            
            if(dataArr["plantExtractions"]["plant_id"]){
              dataArr["plant"] = allPlantsArr.find(e => e.plant_id === dataArr["plantExtractions"]["plant_id"])

              if(allPlantphysicoArr.find(e => e.plant_extraction_id === dataArr["plantExtractions"]["id"])){
                dataArr["plantPhysicochemicalProperties"] = allPlantphysicoArr.find(e => e.plant_extraction_id === dataArr["plantExtractions"]["id"])
              }
              if(allplantsOrganolepticArr.find(e => e.plant_extraction_id === dataArr["plantExtractions"]["plant_id"])){
                dataArr["plantOrganolepticSensoryProperties"] = allplantsOrganolepticArr.find(e => e.plant_extraction_id === dataArr["plantExtractions"]["id"])
              }
            }
            FindAdditivesPlantsReplacements2.push(dataArr);
          })
        }
        return callback(false, {count: FindAdditivesPlantsReplacements2.length, rows: FindAdditivesPlantsReplacements2}, "PRODUCT0032");
      }
    } catch (error) {
      createLog(error, 'SearchProductReplacements', {
        "userId": user_id, "productId": productId, "additivesId": additivesId
      }, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }

 
  public async getPopularProductsList(
    productIds: Array<number>,
    callback: Function
  ) {
    try {
      let popularProductsData = await this.product.findAll({
        where: {
          id: productIds,
          status: 1,
        },
        include: [
          {
            model: this.productPhoto,
            as: "product_photos",
            required: false,
            where: {
              status: 1,
            },
          },
        ],
        order: [
          ["id", "DESC"],
          ["product_photos", "default_image", "DESC"],
        ],
      });
      popularProductsData = JSON.parse(JSON.stringify(popularProductsData));
      return callback(false, popularProductsData, "PRODUCT0031");
    } catch (error) {
      createLog(error, 'getPopularProductsList', { "productIds": productIds }, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }

 


  public async saveComment(commentObj, callback: Function): Promise<any> {
    try {
      const findProduct = await this.comment.findOne({
        where: {
          user_product_id: commentObj.user_product_id,
        },
      });
      if (!findProduct) {
        const commentData = await this.comment.create(commentObj);
        return callback(false, commentData, "PRODUCT0042");
      } else {
        const commentData = await this.comment.update(
          {
            comment: commentObj.comment,
          },
          {
            where: {
              user_product_id: commentObj.user_product_id,
            },
          }
        );
        if (commentData.includes(1)) {
          return callback(false, commentObj, "PRODUCT0042");
        } else {
          return callback(true, null, "PRODUCT0043");
        }
      }
    } catch (error) {
      createLog(error, 'saveComment', commentObj, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }

  public async getUniqueReplacementLogTags(callback: Function): Promise<any> {
    try {
      const uniqueTags = await this.productReplacementLogsTags.findAll({
        where: { status: 1 },
        attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("tag")), "tag"]],
      });
      const tags =
        uniqueTags.length > 0
          ? uniqueTags.map((data: any) => {
              return data.tag;
            })
          : [];
      return callback(false, tags, "PRODUCT0044");
    } catch (error) {
      createLog(error, 'getUniqueReplacementLogTags', null, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }

  public async searchPlantsReplacementSuggestions(
		user_id: number,
    productId: number,
    additivesId: number[],
    callback: Function
  ): Promise<any> {
    try {
      let error = false;
      const findProduct = await this.product.findOne({
        where: { [Op.and]: [{ id: productId, user_id, status: 1 }] },
      });
      if (!findProduct) {
        error = !findProduct;
        return callback(error, null, "PRODUCT0007");
      } else {
        const FindAdditivesPlantsReplacements =
          await this.additivesPlantReplacements.findAll({
            where: { additive_id: { [Op.in]: additivesId } },
            attributes: ["id", "additive_id", "plant_functionality_id"],
            distinct: true,
          }).catch(err => console.log(err));

          let notIncludedAdditivesPlantsReplacementsId = []
          let functionalityIds = []
          let allFunctionalityArr = []
          let allPlantPartsArr = []
          let allFormsArr = []
          let allProductAdditiveArr = []
          let allProductAdditiveReplacementArr = []

          if (FindAdditivesPlantsReplacements) {
            FindAdditivesPlantsReplacements.forEach(data => {
              notIncludedAdditivesPlantsReplacementsId.push(data.id)
              functionalityIds.push(data.plant_functionality_id)
            })
         
          
          
			let [FindAdditivesPlantsReplacementsSuggestions, metaData] = await db.query(
                "select additives.id as additive_id,additives.functionality_id,plants_extractions.id as plants_extractions_id, plants_extractions.plant_id,plants_extractions.plant_part_id,form_id"
                + " from additives"
                + "   join plants_functionalities on plants_functionalities.functionality_id= additives.functionality_id"
                + "   join plants_extractions on plants_extractions.plant_id = plants_functionalities.plant_id "
                + "      and plants_extractions.id NOT IN (select plant_extraction_id from additives_plant_replacements where additive_id=additives.id)"
                + " where  additives.id IN (" +additivesId +")"
                + "limit 5;"

			);
      FindAdditivesPlantsReplacementsSuggestions = JSON.parse(JSON.stringify(FindAdditivesPlantsReplacementsSuggestions));
          
          const allPlantParts = await this.plantsParts.findAll({
            attributes: ["id","name"],
            where: {status:1}
          })
          const allForms = await this.forms.findAll({
            attributes: ["id","name"],
            where: {status:1}
          }) 
          const allFunctionality = await this.functionalities.findAll({
            attributes: ["id","name"],
          })       
          const productAdditive = await this.productAdditives.findAll({
            where: {
              [Op.and]: [{ user_product_id: productId, status: 1 }],
            },
            attributes: [
              "id",
              "user_product_id",
              "additive_name",
              "additive_id",
              "status",
            ],
            required: true,
            include: [
              {
                model: this.additives,
                attributes: ["id", "name"],
                required: true,
              },
            ],
          })

          const productAdditiveReplacements = await this.productAdditiveReplacements.findAll({
            where: {
              [Op.and]: [{ user_product_id: productId, status: 1 }],
            },
            attributes: [
              "id",
              "user_product_id",
              "additives_plant_replacement_id",
              "status",
            ],
          })
          
          allPlantPartsArr = JSON.parse(JSON.stringify(allPlantParts))
          allFormsArr = JSON.parse(JSON.stringify(allForms))
          allProductAdditiveArr= JSON.parse(JSON.stringify(productAdditive))
          allProductAdditiveReplacementArr=JSON.parse(JSON.stringify(productAdditiveReplacements))

          let newDataArr = []
          let plantIds = []
          let FindAdditivesPlantsReplacements2 = []
          let allPlantsArr = []
          let allPlantphysicoArr = []
          let allplantsOrganolepticArr = []

          if(FindAdditivesPlantsReplacementsSuggestions){
            console.log(FindAdditivesPlantsReplacementsSuggestions)
            FindAdditivesPlantsReplacementsSuggestions.forEach( data => {
              plantIds.push(data["plant_id"])
            })         

          const allPlants = await this.plants.findAll({
            attributes: [
              ["id", "plant_id"],
              ["name", "plant_name"],
              ["geo_area", "geo_area"],
            ],
            include: [
              {
                model: this.plantsImages,
                as: "plantImages",
                attributes: [
                  "id",
                  "plant_id",
                  "file_name",
                  "file_path",
                  "default",
                  "status",
                ],
                where: {
                  status: 1,
                },
                required: false,
              },
            ],
            where: { id : {[Op.in]:plantIds}}
          }).catch(err => console.log(err)) 
          const allPlantphysico = await this.plantsPhysico.findAll({
            where: { plant_id : {[Op.in]:plantIds}}
          }).catch(err => console.log(err))
          
          const allplantsOrganoleptic = await this.plantsOrganoleptic.findAll({
            where: { plant_id : {[Op.in]:plantIds}}
          }).catch(err => console.log(err));
          allFunctionalityArr = JSON.parse(JSON.stringify(allFunctionality))
          allPlantsArr = JSON.parse(JSON.stringify(allPlants))
          allPlantphysicoArr = JSON.parse(JSON.stringify(allPlantphysico))
          allplantsOrganolepticArr = JSON.parse(JSON.stringify(allplantsOrganoleptic))
          FindAdditivesPlantsReplacementsSuggestions.forEach( data => {
            newDataArr =  JSON.parse(JSON.stringify(data))
            if(newDataArr["additive_id"] && allProductAdditiveArr.find(e => e.additive_id === newDataArr["additive_id"])){
              newDataArr["productAdditive"] = allProductAdditiveArr.find(e => e.additive_id === newDataArr["additive_id"])
            }
            if(newDataArr["id"] && allProductAdditiveReplacementArr.find(e => e.additives_plant_replacement_id === newDataArr["id"])){
              newDataArr["productAdditiveReplacements"] = allProductAdditiveReplacementArr.find(e => e.additives_plant_replacement_id === newDataArr["id"])
            }           
            if(newDataArr["functionality_id"] && allFunctionalityArr.find(e => e.id === newDataArr["functionality_id"])){
              newDataArr["functionality_name"] = allFunctionalityArr.find(e => e.id === newDataArr["functionality_id"]).name
            }
            if(newDataArr["form_id"]){
              newDataArr["plants_form_name"] = allFormsArr.find(e => e.id === newDataArr["form_id"]).name
            }
            if(newDataArr["plant_part_id"]){
              newDataArr["plant_part_name"] = allPlantPartsArr.find(e => e.id === newDataArr["plant_part_id"]).name
            }
            
            if(newDataArr["plant_id"]){
              newDataArr["plant"] = allPlantsArr.find(e => e.plant_id === newDataArr["plant_id"])
              if(allPlantphysicoArr.find(e => e.plant_id === newDataArr["plant_id"])){
                newDataArr["plantPhysicochemicalProperties"] = allPlantphysicoArr.find(e => e.plant_id === newDataArr["plant_id"])
              }
              if(allplantsOrganolepticArr.find(e => e.plant_id === newDataArr["plant_id"])){
                newDataArr["plantOrganolepticSensoryProperties"] = allplantsOrganolepticArr.find(e => e.plant_id === newDataArr["plant_id"])
              }
            }
            FindAdditivesPlantsReplacements2.push(newDataArr);
          })
        }
        return callback(false, {count: FindAdditivesPlantsReplacements2.length, rows: FindAdditivesPlantsReplacements2}, "PRODUCT0032");
      }
      }
    } catch (error) {
      createLog(error, 'SearchProductReplacements', {
        "userId": user_id, "productId": productId, "additivesId": additivesId
      }, "productsModel");
      return callback(true, null, "GEN0004");
    }
	}



  public async addFeedbackForProductIngredient(email: string, product: any, ingredientName: string, comment: string, callback: Function): Promise<any>{
    try {
      const loggedInUserData = await this.users.findOne({
        where: { email, status: 1 },
      });

      if(loggedInUserData){
        let userName: string =
            loggedInUserData.first_name + " " + loggedInUserData.last_name;
        let templateKeys: { [key: string]: any } = {
            SENDERNAME: userName,
            INGREDIENTNAME: ingredientName,
            PRODUCTNAME: product.product_name,
            FEEDBACK: comment
          };
          let subjectKeys: { [key: string]: any } = {
            INGREDIENTNAME: ingredientName,
          };
              emailTemplate.sendEmailTemplate(
                process.env.FEEDBACK_USER_EMAIL_TEMPLATE_ID,
                email,
                subjectKeys,
                templateKeys,
                (err) => {}
              );
        return callback(false, null, "PRODUCT0087");
      } else {
        return callback(true, null, "VAL0004");
      }
    } catch (error) {
      createLog(error, 'addFeedbackForProductIngredient', null, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }


  public async getProductIdsFromAdditiveIds(additive_id: number): Promise<any> {
    try {
      const userProductIds = await this.productAdditives.findAll({
        where: {
          [Op.and]: [
            {
              additive_id,
              status: 1,
            },
          ],
        },
        distinct: true,
      });
      let mapUserProductIds = userProductIds.length && userProductIds.map((obj) => obj.user_product_id)
      return mapUserProductIds;
    } catch (error) {
      return null;
    }
  }

  public async createReplacementGroupFromFA(product_id:number, userId:number, existedGroupReplacementFromFa: any): Promise<any> {
    try {
      if (!existedGroupReplacementFromFa.group.value) return null;
          
          if (!product_id) return null;
    
          let groupNameValidate = await this.additiveReplacementGroup.findAll({
            attributes: ["group_id"],
            where: {
              group_name: existedGroupReplacementFromFa.group.label,
              product_id
            },
          }).catch(err => console.log(err));
    
          groupNameValidate = JSON.parse(JSON.stringify(groupNameValidate));
    
          if (groupNameValidate.length > 0) return null;

        let additiveReplacementGroup = await this.additiveReplacementGroup.create(
          {
            product_id,
            group_name: existedGroupReplacementFromFa.group.label,
            is_from_FA: 1,
            created_by: userId,
            updated_by: userId
          }
        ).catch(err => console.log(err))

        if (!additiveReplacementGroup) return null;
      if(existedGroupReplacementFromFa.groupData.length){
        let replacementGroupArray = [];
        let replacementGroupDetailsData;
        existedGroupReplacementFromFa.groupData.forEach(async (data) => {
          let obj: { [k: string]: any } = {};
          obj = {
            group_id: additiveReplacementGroup.group_id,
            additives_plant_replacement_id: data.additivesPlantReplacementId,
            percentage: data.percentage,
          };

          replacementGroupArray.push(obj);
        })
        replacementGroupDetailsData = await this.replacementGroupDetails.bulkCreate(replacementGroupArray);
        if (replacementGroupDetailsData.length > 0){
          return {
            groupData: replacementGroupDetailsData,
          };
        }
      }
    } catch (error) {
      createLog(error, 'createReplacementGroup', { "productId": product_id, "data": existedGroupReplacementFromFa }, "productsModel");
      return null;
    }
  }
    
}



export default new productModel();
