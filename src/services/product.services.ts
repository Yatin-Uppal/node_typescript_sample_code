import { json } from "body-parser";
import { keys, replace } from "lodash";
import _ = require("lodash");
import { DataTypes, Op, or, Sequelize } from "sequelize";
import db from "../helpers/databaseConfig";

import {createLog} from "../models/loggerModel"
// import projectModel from "./projectModel";
// import additiveReplacementModel from "../models/additiveReplacement";
import * as moment from 'moment';
import productModel from "../models/productModel";




class product {
    private product;
    private productPhoto;
    private productTeamMembers;
    private sharedProduct;
    private productAdditiveReplacements;
    private additivesPlantReplacements;
    private plantsFunctionalities;
    private functionalities;
    private plantsExtraction;
    private comment;
    private foodCategory;
    private additives;
    private forms;
    private plantsParts
    private plants;
    private productReplacementLogs;
    private plantsImages;
    private productAdditives
    constructor() {
        this.product = productModel.product
        this.productPhoto = productModel.productPhoto;
        this.productTeamMembers = productModel.productTeamMembers;
        this.sharedProduct = productModel.sharedProduct;
        this.productAdditiveReplacements = productModel.productAdditiveReplacements;
        this.additivesPlantReplacements = productModel.additivesPlantReplacements;
        this.plantsFunctionalities = productModel.plantsFunctionalities;
        this.functionalities = productModel.functionalities;
        this.plantsExtraction = productModel.plantsExtraction;
        this.comment = productModel.comment;
        this.foodCategory = productModel.foodCategory;
        this.additives = productModel.additives;
        this.forms = productModel.forms;
        this.plantsParts = productModel.plantsParts;
        this.plants = productModel.plants;
        this.productReplacementLogs = productModel.productReplacementLogs;
        this.plantsImages = productModel.plantsImages;
        this.productAdditives = productModel.productAdditives
        
    }

    public async addProduct(product: any, callback: Function) {
        try {
          const findProduct = await this.product.findAll({
            where: {
              [Op.and]: [
                {
                  product_name: product.product_name,
                  user_id: product.user_id,
                  status: 1,
                },
              ],
            },
          });
          if (findProduct.length === 0) {
            const productObj = await this.product.create({
              product_name: product.product_name,
              product_category_id: product.product_category_id,
              food_category_id: product.food_category_id,
              user_id: product.user_id,
              description: product.description,
              status: product.status,
            });
            return callback(false, productObj, "PRODUCT0001");
          } else {
            return callback(true, null, "PRODUCT0003");
          }
        } catch (error) {
          createLog(error, 'addProduct', product, "productsModel");
          return callback(true, null, "GEN0004");
        }
      }


     public async saveFileData(
    user_id: number,
    productId: number,
    files: Array<any>,
    callback: Function
  ) {
    try {
      let check = false;
      const findProduct = await this.product.findOne({
        where: { [Op.or]: [
          {user_id},
          {id: {
            [Op.in]:  Sequelize.literal(
              `( SELECT user_product_id FROM user_product_team_members where user_id=${user_id})`
            )
          },
        }
      ],
      [Op.and]: [{ id: productId, status: 1 }] },
      });
      if (!findProduct) {
        check = !findProduct;
        return callback(check, null, "PRODUCT0007");
      } else {
        const filesData = await this.productPhoto.bulkCreate(files);
        return callback(false, filesData, "PRODUCT0008");
      }
    } catch (error) {
      createLog(error, 'saveFileData',  {"userId": user_id, "productId": productId, "files":files}, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }
  public async editProduct(product: any, callback: Function): Promise<any> {
    try {
      let error = false;
      const findProduct = await this.product.findOne({
        where: {
          [Op.or]: [
            {user_id: product.user_id},
            {id: {
              [Op.in]:  Sequelize.literal(
                `( SELECT user_product_id FROM user_product_team_members where user_id=${product.user_id})`
              )
            },

          }
        ],
          [Op.and]: [
            { id: product.productId, status: 1 },
          ],
        },
      });
      const findDuplicateProduct = await this.product .findOne({
        where: {
          [Op.and]: [
            {
              product_name: product.product_name,
              user_id: product.user_id,
              status: 1,
              id: {
                [Op.not]: product.productId,
              },
            },
          ],
        },
      });
      if (!findProduct) {
        error = !findProduct;
        return callback(error, null, "PRODUCT0007");
      } else if (findDuplicateProduct) {
        error = true;
        return callback(error, null, "PRODUCT0003");
      } else {
        let productObj: { [k: string]: any } = {
          updated_at: product.updatedAt,
          updated_by: product.updatedBy,
        };

        if (product.product_name) {
          productObj.product_name = product.product_name;
        }

        if (product.product_category_id) {
          productObj.product_category_id = product.product_category_id;
        }

        if (product.food_category_id) {
          productObj.food_category_id = product.food_category_id;
        }

        if (product.description) {
          productObj.description = product.description;
        }
        if (product.status) {
          productObj.status = product.status;
        }
        productObj.is_test = product.is_test

        await this.product.update(productObj, {
          where: {
            [Op.and]: [
              {
                id: product.productId,
                user_id: product.user_id,
                status: 1,
              },
            ],
          },
        });
        return callback(false, productObj, "PRODUCT0018");
      }
    } catch (error) {
      createLog(error, 'editProduct', product, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }
  
    public checkIfProductExistsToUser(userId: number, productId: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
          try {
            let whereQuery;
            const sharedProducts = await this.sharedProduct.findAll({
              attributes: ["user_product_id"],
              where: {
                shared_with: userId,
                status: 1,
              },
            });
            if (sharedProducts && sharedProducts.length) {
              let sharedProductId = sharedProducts.map((product) => {
                return product.user_product_id;
              });
              whereQuery = {
                [Op.and]: [
                  {
                    id: productId,
                    [Op.or]: {
                      user_id: userId,
                      id: {
                        [Op.in]: sharedProductId,
                      },
                    },
                    status: 1,
                  },
                ],
              };
            } else {
              whereQuery = {
                id: productId,
                [Op.or]: [
                  {user_id: userId},
                  {id: {
                    [Op.in]:  Sequelize.literal(
                      `( SELECT user_product_id FROM user_product_team_members where user_id=${userId})`
                    )
                  },
    
                }
              ],
                status: 1,
              };
            }
    
            let productData = await this.product.findOne({
              attributes: ["id", "product_name"],
              where: {...whereQuery, },
            });
            if (!productData) reject("Product Not found");
            resolve(productData);
          } catch (error) {
            createLog(error, 'checkIfProductExistsToUser', { "userId": userId, "product": productId }, "productsModel");
            reject(error);
          }
        });
      }
    

  
     public async deleteProduct(
    user_id: number,
    productId: number,
    callback: Function
  ): Promise<any> {
    try {
      let check = false;
      const findProduct = await this.product.findOne({
        where: { [Op.or]: [
          {user_id},
          {id: {
            [Op.in]:  Sequelize.literal(
              `( SELECT user_product_id FROM user_product_team_members where user_id=${user_id})`
            )
          },

        }
      ], [Op.and]: [{ id: productId, status: 1 }] },
      });
      if (!findProduct) {
        check = !findProduct;
        return callback(check, null, "PRODUCT0007");
      } else {
        await this.product.update(
          { status: 0 },
          {
            where: { [Op.and]: [{ id: productId, user_id, status: 1 }] },
          }
        );
        await this.deleteImageProduct(productId, []);
        return callback(check, null, "PRODUCT0015");
      }
    } catch (error) {
      createLog(error, 'deleteProduct', { "userId" :user_id, "productId": productId}, "productsModel");
      return callback(true, null, "GEN0004");
    }
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

  public async getproductDetail(productId: number,callback: Function ): Promise<any> {
    try {
      let check = false;
      let replacementData = await this.productAdditiveReplacements.findAll({
        where: {
          [Op.and]: [
            {
              user_product_id: productId,
              status: 1,
            },
          ],
        },
        attributes: [
          ["id", "user_product_additive_replacement_id"],
          "user_product_id",
          "additives_plant_replacement_id",
          "status",
        ],
        include: [
          {
            model: this.productReplacementLogs,
            as: "productReplacementLog",
            where: {
              user_product_id: productId,
              status: 1,
            },
            attributes: ["id"],
            required: false,
          },
          {
            model: this.additivesPlantReplacements,
            attributes: [
              "id",
              "plant_extraction_id",
              "additive_id",
              "plant_functionality_id",
              [Sequelize.literal("''"), "additive_name"],
            ],
            required: true,
            include: [
              {
                model: this.plantsFunctionalities,
                as: "plantFunctionality",
                attributes: ["id", "functionality_id"],
                required: false,
                include: [
                  {
                    model: this.functionalities,
                    as: "functionality",
                    attributes: [
                      ["id", "functionality_id"],
                      ["name", "functionality_name"],
                      ["description", "functionality_desc"],
                      ["status", "functionality_status"],
                    ],
                    required: false,
                  },
                ],
              },
              {
                model: this.plantsExtraction,
                as: "plantExtractions",
                attributes: [
                  "id",
                  "plant_id",
                  "plant_part_id",
                  "form_id",
                  "preparation",
                  "status",
                ],
                where: {
                  status: 1,
                },
                required: false,
                include: [
                  {
                    model: this.plants,
                    as: "plant",
                    attributes: [
                      ["id", "plant_id"],
                      ["name", "plant_name"],
                    ],
                    required: false,
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
                          "created_at",
                          "updated_at",
                        ],
                        where: {
                          status: 1,
                        },
                        required: false,
                      },
                    ],
                  },
                  {
                    model: this.plantsParts,
                    as: "plantParts",
                    attributes: [["name", "plants_part_name"]],
                    where: {
                      status: 1,
                    },
                    required: false,
                  },
                  {
                    model: this.forms,
                    as: "plantForms",
                    attributes: ["id", "name", "status"],
                    where: {
                      status: 1,
                    },
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      });

      let productData = await this.product.findOne({
        where: {
          id: productId,
          status: 1,
        },
        include: [
          {
            model: this.productAdditives,
            as: "product_additives",
            required: false,
            where: {
              status: 1,
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
                  "utraprocessed_reason",
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
          },
          {
            model: this.productPhoto,
            as: "product_photos",
            required: false,
            where: {
              status: 1,
            },
          },
          {
            model: this.comment,
            as: "product_comment",
            required: false,
            where: {
              user_product_id: productId,
            },
          },
        ],
      });

      check = !productData;
      productData = JSON.parse(JSON.stringify(productData));

      let dataSet: { [k: string]: any } = {}
      dataSet = []

      if (productData.product_additives) {
        productData.product_additives.forEach(data => {
          if ((data.additive &&  data.additive.enumber == '') ||  !data.additive ) {

            let foodCategoryName = data.additive && data.additive.food_category ? data.additive.food_category.name : "N/A";
            let functionalityName = data.additive && data.functionalities.length > 0 ?  data.functionalities[0].name : "N/A"
            let obj = {
              value: data.id,
              label:  (data.additive_name + ' ' + (!data.additive_id? '':'[' + foodCategoryName + ']' + ' ' + '[' + functionalityName + ']')),
              additive_id: data.additive_id? data.additive_id:null
            }
            dataSet.push(obj)
        }
        })
      }
      replacementData = JSON.parse(JSON.stringify(replacementData));
      replacementData && replacementData.forEach((data) => {
        let additiveIndex = productData.product_additives && productData.product_additives.findIndex(object => {
          return object.additive_id == data.additives_plant_replacement.additive_id
        })
        if (additiveIndex && additiveIndex > -1) {
          data.additives_plant_replacement.additive_name = productData.product_additives[additiveIndex].additive_name ? productData.product_additives[additiveIndex].additive_name : "";
        } 
      });

      productData["productAdditivePicklist"] = dataSet
      productData["replacementData"] = replacementData;
    
      return callback(
        check,
        productData,
        !check ? "PRODUCT0020" : "PRODUCT0007"
      );
    } catch (error) {
      createLog(error, 'getproductDetail', { "product": productId }, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }

  public async getProductsList(
    user_id: number,
    roleId: number[],
    keyword: string,
    isTest: boolean,
    page: number,
    size: number,
    callback: Function
  ): Promise<any> {
    try {
      let check = false;
      const isCharakaAdmin = roleId.includes(+process.env.USERS_ROLES_CHARAKA_ADMIN)
      const limit = size ? size : parseInt(process.env.DEFAULT_RECORDS_LIMIT);
      const offset =
        page > 1
          ? (page - 1) * limit
          : parseInt(process.env.DEFAULT_RECORDS_OFFSET);
      const queryCheck = keyword
        ? {
            where: {
              [Op.or]: [
                ...(isCharakaAdmin ? [{
                  [Op.or]: [
                    {is_test: null},
                    {is_test: 0}
                  ]
                }] : [{user_id},
                {id: {
                  [Op.in]:  Sequelize.literal(
                    `( SELECT user_product_id FROM user_product_team_members where user_id=${user_id})`
                  )
                },
              }])
            ],
              [Op.and]: [
                {
                  product_name: {
                    [Op.like]: `%${keyword}%`,
                  },
                  status: 1,
                  ...(isTest ? {is_test: 1} : null)
                },
              ],
            },
            include: [
              {
                model: this.productPhoto,
                as: "product_photos",
                where: { status: 1 },
                required: false,
              },
            ],
            distinct: true,
            order: [
              ["id", "DESC"],
              ["product_photos", "default_image", "DESC"],
            ],
            limit,
            offset,
          }
        : {
            where: {
              [Op.or]: [
                  ...(isCharakaAdmin ? [{
                    [Op.or]: [
                      {is_test: null},
                      {is_test: 0}
                    ]
                  }]  : [{user_id},
                    {id: {
                      [Op.in]:  Sequelize.literal(
                        `( SELECT user_product_id FROM user_product_team_members where user_id=${user_id})`
                      )
                    },
                  }])
              ],
              status: 1,
              ...(isTest ? {is_test: 1} : null)
            },
            include: [
              {
                model: this.productPhoto,
                as: "product_photos",
                where: { status: 1 },
                required: false,
              },
            ],
            distinct: true,
            order: [
              ["id", "DESC"],
              ["product_photos", "default_image", "DESC"],
            ],
            limit,
            offset,
          };
      let productsData = await this.product.findAndCountAll(queryCheck);
      productsData = JSON.parse(JSON.stringify(productsData));

      if (productsData === null) {
        check = true;
      }
      return callback(check, productsData, "PRODUCT0012");
    } catch (error) {
      createLog(error, 'getProductsList', { "userId" :user_id, "keyword": keyword}, "productsModel");
      return callback(true, null, "GEN0004");
    }
  }

  public async deleteTeamMemberByProductId(
    id: number,
    callback: Function
  ): Promise<any> {
    try {
      let check = false;
      await this.productTeamMembers.destroy({
        where: { user_product_id: id },
      });
      return callback(check, null, "PRODUCT0099");
    } catch (error) {
      return callback(true, null, "GEN0004");
    }
  }

}

export default new product()