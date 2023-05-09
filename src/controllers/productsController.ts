import { Request, Response } from 'express';
import * as moment from 'moment';
import * as randomstring from 'randomstring';
import { validationResult } from "express-validator";
import productsValidation from "./validation/productsValidation";
import productModel from "../models/productModel";
import productKPIModel from "../models/productKpi";
import apiResponse from "../helpers/apiResponse";
import { authenticateJWT } from "../middlewares/jwt";
import productCategoryModel from '../models/productCategoryModel';
import foodCategoryModel from '../models/foodCategoryModel';
import s3 from "../helpers/S3";
import responseCode from "../helpers/response";
import { createLog } from "../models/loggerModel";
import productService from '../services/productServices'
import productFormulationService from '../services/formulationsServices';
import productReplacementService from '../services/productReplacementServices'
import replacementGroupsService from '../services/replacementGroupServices';
import replacementGroupLogsService from '../services/replacementGroupLogService';
import productTeamMemberService from '../services/productTeamMemberServices'

class ProductsController {
    private productsValidation: productsValidation;

    constructor() {
        this.productsValidation = new productsValidation();
    }
    /**
     * @swagger
     * /products/add:
     *   post:
     *     tags:
     *       - ProductsController
     *     description: 
     *      add Product 
     *     consumes:
     *       - multipart/form-data
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: formData
     *         name: images1
     *         type: file
     *         required: true 
     *       - in: formData
     *         name: product_name
     *         type: string
     *         required: true
     *         description: Product Name
     *       - in: formData
     *         name: product_category_id
     *         type: integer
     *         required: true
     *       - in: formData
     *         name: is_test
     *         type: boolean
     *         required: true
     *       - in: formData
     *         name: food_category_id
     *         type: integer
     *         required: true
     *         description: Product Name
     *       - in: formData
     *         name: product_description
     *         type: string
     *         required: true
     *         description: Product Name
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description:  product  save Successfully
     * 
     */

    public addProduct(): any {
        return [
            authenticateJWT,
            this.productsValidation.addProduct(),
            async (request: Request, response: Response) => {
                try {
                    // Extract the validation errors from a request.
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {

                        let productData = {
                            user_id: +request.headers.userId,
                            product_category_id: +request.body.product_category_id,
                            food_category_id: +request.body.food_category_id,
                            product_name: request.body.product_name,
                            description: request.body.product_description,
                            is_test: request.body.is_test ? JSON.parse(request.body.is_test) : false,
                            status: 1
                        };

                        // Limit number of files
                        const maxFileLimit = parseInt(process.env.MAX_PRODUCT_IMAGES_LIMIT);
                        if (request.files.length > maxFileLimit) {
                            return apiResponse.ErrorResponse(response, 'PRODUCT0017');
                        } else {
                            if (!request.files.length) {
                                return apiResponse.ErrorResponse(response, 'PRODUCT0016');
                            }
                        }

                        productService.addProduct(productData, function (error: boolean, productObj: any, code: string) {
                            if (!error) {
                                let subFolderName = randomstring.generate({
                                    length: 6,
                                    charset: 'alphabetic'
                                });
                                s3.uploadFileToLocalAndSaveToS3('uploadProductDocs', 'products/images', subFolderName, request, response, ['images'], productObj.id, async function (err: any, docName: any) {
                                    if (err) {
                                        return apiResponse.ErrorResponse(response, "PRODUCT0010");
                                    } else {
                                        let files = [];
                                        docName.forEach(function (name, index) {
                                            files.push({
                                                "user_product_id": productObj.id,
                                                "photo_path": name,
                                                "default_image": request.files[index].fieldname === 'default_image' ? true : false,
                                                "status": 1,
                                                "created_at": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                                            });
                                        });
                                        productService.saveFileData(productObj.user_id, productObj.id, files, function (error: boolean, filesData: any, fileCode: string) {
                                            if (!error) {
                                                return apiResponse.successResponseWithData(response, code, productObj);
                                            } else {
                                                return apiResponse.ErrorResponse(response, fileCode);
                                            }
                                        });

                                    }
                                });
                            } else {
                                return apiResponse.ErrorResponse(response, code);
                            }
                        });
                    }
                } catch (error) {
                    //throw error in json response with status 500.
                    createLog(error, 'addProduct', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/categories/list:
     *   get:
     *     tags:
     *       - ProductsController
     *     summary: Get a Products Categories list
     *     parameters:
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Get products categories list Successfully.
     * 
     */

    public productsCategoriesList(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {

                        productCategoryModel.getProductCategoriesList(function (error, data, code) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'productsCategoriesList', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/team-members:
     *   get:
     *     tags:
     *       - ProductsController
     *     summary: Get all team members of a product
     *     parameters:
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *       - name: product_id 
     *         in: query
     *         type: string
     *         required: false
     *         description: the product_id for which team members to fetch
     *     responses:
     *       200:
     *         description: Get products team members list Successfully.
     * 
     */

    public productTeamMemberList(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const productId: number | null = request.query.product_id ? +request.query.product_id.toString() : null;
                        console.log(1, productId)
                        productTeamMemberService.getProductTeamMembers(productId, function (error, data, code) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                console.log(2, data);
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'productsTeamMembersList', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/add-team-members:
     *   post:
     *      tags:
     *        - ProductsController
     *      description:
     *        add team members to product
     *      produces:
     *        - application/json
     *      parameters:
     *        - in: body
     *          name: body
     *          required: true
     *          schema:
     *            type: object
     *            properties:
     *               teamMembers:
     *                   type: array
     *                   items:
     *                       type: object
     *                       properties:
     *                           team_member_role_id:
     *                               type: number
     *                           user_id:
     *                               type: number
     *                       example: {team_member_role_id: 1, user_id: 1}
     *               user_product_id:
     *                   type: number
     *        - name: token
     *          in: header
     *          type: string
     *          required: false
     *          description: token
     * responses:
     *   200:
     *     description: Team member added successfully.
     */

    public addTeamMembersToProduct(): any {
        return [
            authenticateJWT,
            this.productsValidation.addProductTeamMember(),
            async (request: Request, response: Response) => {
                try {
                    // Extract the validation errors from a request.
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        let productTeamMemberData = request.body.teamMembers;
                        productTeamMemberData = productTeamMemberData.map((val) => {
                            return {
                                team_member_role_id: parseInt(val.team_member_role_id),
                                user_id: parseInt(val.user_id),
                                user_product_id: parseInt(request.body.user_product_id),
                                createdBy: request.headers.userId,
                                createdAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                            }
                        })
                        console.log(productTeamMemberData)
                        productTeamMemberService.addTeamMembersToProduct(productTeamMemberData, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                console.log('return data', data)
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    };
                } catch (error) {
                    createLog(error, 'addTeamMembersToProduct', null, "productsController");
                    //throw error in json response with status 500.
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/edit-team-member:
     *   put:
     *     tags:
     *       - ProductsController
     *     description:
     *       Edit Product Team Member Api
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: body
     *         description: object
     *         in: body
     *         required: true
     *         schema:
     *           type: object
     *           required:
     *             - id
     *             - user_id
     *             - team_member_role_id
     *           properties:
     *             id:
     *               type: number
     *             user_id:
     *               type: number
     *             team_member_role_id:
     *               type: number
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Product updated Successfully
     * 
     */


    public editProductTeamMember(): any {
        return [
            authenticateJWT,
            this.productsValidation.editProductTeamMember(),
            async (request: Request, response: Response) => {
                try {
                    // Extract the validation errors from a request.
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const { teamMembers } = request.body;
                        productTeamMemberService.editTeamMembersOfProduct(teamMembers, +request.headers.userId, function (error: boolean, data: any, code: string) {
                            if (error) {
                                console.log(456, error)
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    };
                } catch (error) {
                    createLog(error, 'editProduct', null, "productsController");
                    //throw error in json response with status 500.
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }


    /**
     * @swagger
     * /products/delete-team-member:
     *   delete:
     *     tags:
     *       - ProductsController
     *     summary: Delete product team member by ID
     *     parameters:
     *       - in: query
     *         name: teamMemberId
     *         schema:
     *           type: integer
     *         required: true
     *         description: team member ID
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Product Deleted Successfully.
     * 
     */

    public deleteProductTeamMember(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const id = +request.query.teamMemberId;
                        productTeamMemberService.deleteTeamMember(id, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponse(response, code);
                            }
                        })
                    }
                } catch (err: any) {
                    createLog(err, 'deleteTeamMember', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/team-member-roles:
     *   get:
     *     tags:
     *       - ProductsController
     *     summary: Get all team members roles
     *     parameters:
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Get products team members roles list Successfully.
     * 
     */

    public productTeamMemberRolesList(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        productTeamMemberService.getTeamMemberRoles(function (error, data, code) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'productsTeamMembersRolesList', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
  * @swagger
  * /products/get-product-formulation-by-id/{id}:
  *   get:
  *     tags:
  *       - ProductsController
  *     summary: Get Formulation Trials
  *     parameters:
  *       - name: token
  *         in: header
  *         type: string
  *         required: false
  *         description: Token
  *       - name: id
  *         in: path
  *         required: true
  *         schema:
  *           type: integer
  *         description: Fetch Data ProductFormulation By Id
  *     responses:
  *       200:
  *         description: Get Data ProductFormulation By Id
  * 
  */

    public productFormulationByFormulationId(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const id = request.params.id;
                        productFormulationService.getProductFormulationDetailById(+id, function (error, data, code) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'productFormulationDetailByProductId', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }



    /**
     * @swagger
     * /products/kpi/{product_id}:
     *   get:
     *     tags:
     *       - ProductsController
     *     summary: Get all kpis of a product
     *     parameters:
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *       - name: product_id 
     *         in: path
     *         schema:
     *           type: integer
     *         required: false
     *         description: the product_id for which kpis to fetch
     *     responses:
     *       200:
     *         description: Get products kpi list Successfully.
     * 
     */

    public productKPIList(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const productId: number | null = request.params.product_id ? +request.params.product_id : null;
                        productKPIModel.getProductKPI(productId, function (error, data, code) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                console.log(2, data);
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'productsKPIList', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/kpi-listing:
     *   get:
     *     tags:
     *       - ProductsController
     *     summary: Get all kpis-listing
     *     parameters:
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Get kpi list Successfully.
     * 
     */

    public productKPIListing(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        productKPIModel.getProductKPIListing(function (error, data, code) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                console.log(2, data);
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'productsKPIList', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }
    /**
     * @swagger
     * /products/add-product-kpi:
     *   post:
     *      tags:
     *        - ProductsController
     *      description:
     *        add kpi to a product
     *      produces:
     *        - application/json
     * 
     * 
     *      parameters:
     *      - in: body
     *        name: body
     *        required: true
     *        schema:
     *          type: object
     *          properties:
     *             kpi:
     *                 type: array
     *                 items:
     *                     type: object
     *                     properties:
     *                         user_product_kpi_lookup_id:
     *                             type: number
     *                         kpi_level:
     *                             type: number
     *                         kpi_value:
     *                             type: string
     *                     example: {user_product_kpi_lookup_id: 1, kpi_level: 0, kpi_value: 'string'}
     *             user_product_id:
     *                 type: number
     *      - name: token
     *        in: header
     *        type: string
     *        required: false
     *        description: token
     * responses:
     *   200:
     *     description: Product KPI added successfully.
     */

    public addProductKPI(): any {
        return [
            authenticateJWT,
            this.productsValidation.addProductKPI(),
            async (request: Request, response: Response) => {
                try {
                    // Extract the validation errors from a request.
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const { user_product_id, kpi } = request.body;
                        const kpiData = kpi.map((val) => {
                            return {
                                user_product_id: parseInt(user_product_id),
                                user_product_kpi_lookup_id: parseInt(val.user_product_kpi_lookup_id),
                                kpi_level: parseInt(val.kpi_level),
                                kpi_value: val.kpi_value,
                                createdBy: request.headers.userId,
                                createdAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                            }
                        })
                        productKPIModel.addProductKPI(kpiData, function (error: boolean, data: any, code: string) {
                            if (error) {
                                console.log(error)
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                console.log('return data', data)
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    };
                } catch (error) {
                    createLog(error, 'addTeamMembersToProduct', null, "productsController");
                    //throw error in json response with status 500.
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/edit-product-kpi:
     *   put:
     *     tags:
     *       - ProductsController
     *     description:
     *       Edit Product KPI Api
     *     produces:
     *       - application/json
     *     parameters:
     *      - in: body
     *        name: body
     *        required: true
     *        schema:
     *          type: object
     *          properties:
     *             id:
     *                 type: number
     *             user_product_id:
     *                 type: number
     *             user_product_kpi_lookup_id:
     *                 type: number
     *             kpi_level:
     *                 type: number
     *             kpi_value:
     *                 type: string
     *      - name: token
     *        in: header
     *        type: string
     *        required: false
     *        description: token
     *     responses:
     *       200:
     *         description: Product KPI updated Successfully
     * 
     */
    public editProductKPIByID(): any {
        return [
            authenticateJWT,
            this.productsValidation.editProductKPI(),
            async (request: Request, response: Response) => {
                try {
                    // Extract the validation errors from a request.
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const { id, user_product_id, user_product_kpi_lookup_id, kpi_level, kpi_value } = request.body;
                        const data = {
                            user_product_id: +user_product_id,
                            user_product_kpi_lookup_id: +user_product_kpi_lookup_id,
                            kpi_level: +kpi_level,
                            kpi_value,
                            updated_by: +request.headers.userId,
                            updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                        }
                        productKPIModel.editProductKPI(data, +id, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    };
                } catch (error) {
                    createLog(error, 'editProduct', null, "productsController");
                    //throw error in json response with status 500.
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }


    /**
     * @swagger
     * /food/categories/list:
     *   get:
     *     tags:
     *       - ProductsController
     *     summary: Get a Food Categories list
     *     parameters:
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Get food categories list Successfully.
     * 
     */

    public foodCategoriesList(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        foodCategoryModel.getFoodCategoriesList(function (error, data, code) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }
                } catch (err) {
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }
    /**
     * @swagger
     * /products/list:
     *   get:
     *     tags:
     *       - ProductsController
     *     summary: Get a Products list
     *     parameters:
     *       - name: keyword
     *         in: query
     *         type: string
     *         required: false
     *         description: search product by keyword name
     *       - name: isTest
     *         in: query
     *         type: string
     *         required: false
     *         description: get isTest product
     *       - name: page
     *         in: query
     *         type: integer
     *         required: false
     *         description: Get product list by page
     *       - name: limit
     *         in: query
     *         type: integer
     *         required: false
     *         description: Get products list by limit
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Get products list Successfully.
     * 
     */

    public listProducts(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        const roleId = (request.headers.userRole as string[]).map(val => +val);
                        const keyword: string = request.query.keyword ? request.query.keyword.toString() : null;
                        const page: number = request.query.page ? +request.query.page : null;
                        const limit: number = request.query.limit ? +request.query.limit : null;
                        const isTest: boolean = request.query.isTest ? JSON.parse(request.query.isTest as string) : false

                        productService.getProductsList(user_id, roleId, keyword, isTest, page, limit, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'listProducts', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }


    /**
     * @swagger
     * /products/delete/{productId}:
     *   delete:
     *     tags:
     *       - ProductsController
     *     summary: Delete product by product ID
     *     parameters:
     *       - in: path
     *         name: productId
     *         schema:
     *           type: integer
     *         required: true
     *         description: product ID
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Product Deleted Successfully.
     * 
     */

    public deleteProduct(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        const id = parseInt(request.params.productId)
                        productService.deleteProduct(user_id, id, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                // delete the team members
                                productService.deleteTeamMemberByProductId(id, () => {
                                    return apiResponse.successResponse(response, code);
                                })
                            }
                        })
                    }
                } catch (err: any) {
                    createLog(err, 'deleteProduct', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }


    /**
     * @swagger
     * /products/edit/{productId}:
     *   put:
     *     tags:
     *       - ProductsController
     *     description:
     *       Edit Product Api
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: productId
     *         schema:
     *           type: integer
     *         required: true
     *       - name: body
     *         description: object
     *         in: body
     *         required: true
     *         schema:
     *           type: object
     *           required:
     *             - product_name
     *             - product_category_id
     *             - food_category_id
     *             - product_description
     *             - is_test
     *           properties:
     *             product_name:
     *               type: string
     *             product_category_id:
     *               type: number
     *             food_category_id:
     *               type: number
     *             product_description:
     *               type: string
     *             is_test:
     *               type: boolean
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Product updated Successfully
     * 
     */


    public editProduct(): any {
        return [
            authenticateJWT,
            this.productsValidation.addProduct(),
            async (request: Request, response: Response) => {
                try {
                    // Extract the validation errors from a request.
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        let productData = {
                            productId: parseInt(request.params.productId),
                            user_id: +request.headers.userId,
                            product_category_id: request.body.product_category_id ? request.body.product_category_id : null,
                            food_category_id: request.body.food_category_id ? request.body.food_category_id : null,
                            product_name: request.body.product_name ? request.body.product_name : null,
                            description: request.body.product_description ? request.body.product_description : null,
                            status: request.body.status ? parseInt(request.body.status) : null,
                            is_test: request.body.is_test ? 1 : 0,
                            updatedBy: request.headers.userId,
                            updatedAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                        }
                        productService.editProduct(productData, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    };
                } catch (error) {
                    createLog(error, 'editProduct', null, "productsController");
                    //throw error in json response with status 500.
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/product-images:
     *   delete:
     *     tags:
     *       - ProductsController
     *     summary: Delete product images by image ID
     *     parameters:
     *       - name: body
     *         description: object
     *         in: body
     *         required: true
     *         schema:
     *           type: object
     *           required:
     *             - product_id
     *             - image_ids
     *           properties:
     *             product_id:
     *               type: number
     *             image_ids:
     *               type: array
     *               items:
     *                  type: number
     *                  required: true
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Product image Deleted Successfully.
     *
     */

    public deleteImageProduct(): any {
        return [
            authenticateJWT,
            this.productsValidation.deleteProductImages(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        productModel.deleteImageProduct(request.body.product_id, request.body.image_ids, function (error: boolean, data: any, code: string) {
                            if (!error) {
                                return apiResponse.successResponse(response, code);
                            }
                            return apiResponse.ErrorResponse(response, code);
                        })

                    }

                } catch (err) {
                    createLog(err, 'deleteImageProduct', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
    * @swagger
    * /products/detail/{productId}:
    *   get:
    *     tags:
    *       - ProductsController
    *     summary: Get a products detail by product ID
    *     parameters:
    *       - in: path
    *         name: productId
    *         schema:
    *           type: integer
    *         required: true
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Get product detail Successfully.
    * 
    */

    public productDetail(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productService.checkIfProductExistsToUser(user_id, parseInt(request.params.productId)).then((productDetails) => {
                            productService.getproductDetail(productDetails.id, function (error, data, code) {
                                if (error) {
                                    return apiResponse.ErrorResponse(response, code);
                                } else {
                                    return apiResponse.successResponseWithData(response, code, data);
                                }
                            })
                        }).catch((err) => {
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");

                        });

                    }

                } catch (err) {
                    createLog(err, 'productDetail', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }


    /**
     * @swagger
     * /products/add-image/{productId}:
     *   post:
     *     tags:
     *       - ProductsController
     *     description:
     *       Add products Api
     *     consumes:
     *       - multipart/form-data
     *     parameters:
     *       - in: path
     *         name: productId
     *         schema:
     *           type: integer
     *         required: true
     *       - in: formData
     *         name: images1
     *         type: file
     *         required: true
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: product images uploaded Successfully
     * 
     */

    public addImageProduct(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        let productId = parseInt(request.params.productId)
                        let subFolderName = randomstring.generate({
                            length: 6,
                            charset: 'alphabetic'
                        });
                        // Limit number of files
                        const maxFileLimit = parseInt(process.env.MAX_PRODUCT_IMAGES_LIMIT);
                        if (request.files.length > maxFileLimit) {
                            return apiResponse.ErrorResponse(response, 'PRODUCT0017');
                        } else {
                            if (!request.files.length) {
                                return apiResponse.ErrorResponse(response, 'PRODUCT0016');
                            }
                        }
                        s3.uploadFileToLocalAndSaveToS3('uploadProductDocs', 'products/images', subFolderName, request, response, ['images'], productId, async function (err: any, docName: any) {
                            if (err) {
                                return apiResponse.ErrorResponse(response, "PRODUCT0010");
                            } else {
                                let files = [];
                                docName.forEach(function (name, index) {
                                    files.push({
                                        "user_product_id": productId,
                                        "photo_path": name,
                                        "default_image": request.files[index].fieldname === 'default_image' ? true : false,
                                        "status": 1,
                                        "created_at": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),

                                    });

                                });

                                productService.saveFileData(user_id, productId, files, function (error: boolean, filesData: Array<any>, fileCode: string) {
                                    if (!error) {
                                        let newDefaultImageObj = files.find(x => x.default_image);
                                        if (newDefaultImageObj) {
                                            let newSavedDefaultImageObj = filesData.find(x => x.photo_path === newDefaultImageObj.photo_path);
                                            productModel.updateDefaultImage(user_id, productId, newSavedDefaultImageObj.id, function (error: boolean, data: any, code: string) {
                                                if (!error) {
                                                    return apiResponse.successResponseWithData(response, "PRODUCT0008", filesData);
                                                }
                                                return apiResponse.ErrorResponse(response, code);
                                            });
                                        } else {
                                            return apiResponse.successResponseWithData(response, fileCode, filesData);
                                        }
                                    } else {
                                        return apiResponse.ErrorResponse(response, fileCode);
                                    }
                                });
                            }
                        });
                    }
                } catch (err) {
                    createLog(err, 'addImageProduct', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/{productId}/add-bulk-product-additives:
     *   post:
     *     tags:
     *       - ProductsController
     *     description:
     *       Add Bulk Product Additives
     *     consumes:
     *       - multipart/form-data
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: productId
     *         schema:
     *           type: integer
     *         required: true
     *         description: product ID
     *       - in: formData
     *         name: app_name
     *         type: string
     *         required: false
     *       - in: formData
     *         name: flag_name
     *         type: string
     *         required: false
     *       - in: formData
     *         name: label_image
     *         type: file
     *         required: false
     *       - in: formData
     *         name: addIngredient
     *         type: boolean
     *         required: true
     *         description: add Ingredient
     *       - in: formData
     *         name: ingredients
     *         type: array
     *         items:
     *           type: string
     *         example: ["str1", "str2"]
     *         required: true
     *         description: ingredients
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Product Additives display Successfully.
     */

    public searchBulkAddProductAdditives(): any {
        return [
            authenticateJWT,
            this.productsValidation.addProductAdditives(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        let appName = request.body.app_name || null;
                        let flagName = request.body.flag_name || null;
                        const user_id = +request.headers.userId;
                        let FilesRequest = request.files ? request.files : [];
                        let productId: number = parseInt(request.params.productId);
                        let ingredients: string[] = request.body.ingredients ? request.body.ingredients.split(",") : [];
                        let addIngredient: string = request.body.addIngredient ?? "false";
                        let subFolderName = randomstring.generate({
                            length: 6,
                            charset: 'alphabetic'
                        });
                        if (FilesRequest.length > 0) {
                            s3.uploadFileToLocalAndSaveToS3('uploadProductDocs', 'products/images', subFolderName, request, response, ['images'], productId, function (err: any, docName: any) {
                                if (err) {
                                    return apiResponse.ErrorResponse(response, "PRODUCT0010");
                                } else {
                                    let files = [];
                                    docName.forEach(function (name, index) {
                                        files.push({
                                            "id": productId,
                                            "label_image_path": name,
                                        });
                                    })
                                    productModel.searchAndAddBulkProductAdditives(user_id, productId, appName, flagName, files, ingredients, addIngredient, function (error: boolean, data: any, code: string) {
                                        if (error) {
                                            return apiResponse.ErrorResponse(response, code);
                                        } else {
                                            return apiResponse.successResponseWithData(response, code, data);
                                        }
                                    })
                                }
                            });
                        } else {
                            productModel.searchAndAddBulkProductAdditives(user_id, productId, appName, flagName, [], ingredients, addIngredient, function (error: boolean, data: any, code: string) {
                                if (error) {
                                    return apiResponse.ErrorResponse(response, code);
                                } else {
                                    return apiResponse.successResponseWithData(response, code, data);
                                }
                            })
                        }
                    }
                } catch (err) {
                    createLog(err, 'searchBulkAddProductAdditives', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/{productId}/edit-product-additive/{productAdditiveId}:
     *   put:
     *     tags:
     *       - ProductsController
     *     summary: Update Product Additive
     *     parameters:
     *       - in: path
     *         name: productId
     *         schema:
     *           type: integer
     *         required: true
     *         description: product ID
     *       - in: path
     *         name: productAdditiveId
     *         schema:
     *           type: integer
     *         required: true
     *         description: product additive ID
     *       - name: body
     *         description: object
     *         in: body
     *         required: true
     *         schema:
     *           type: object
     *           required:
     *             - addditive_name
     *             - app_name
     *             - flag_name
     *           properties:
     *             additive_name:
     *               type: string
     *             app_name:
     *               type: string
     *             flag_name:
     *               type: string
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Product Additives updated Successfully.
     *
     */

    public updateProductAdditive(): any {
        return [
            authenticateJWT,
            this.productsValidation.updateProductAdditive(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        let appName = request.body.app_name || null;
                        let flagName = request.body.flag_name || null;
                        let productAdditiveData = {
                            id: parseInt(request.params.productAdditiveId),
                            user_product_id: parseInt(request.params.productId),
                            additive_name: request.body.additive_name ? request.body.additive_name : null,
                        }
                        productModel.editProductAdditive(user_id, appName, flagName, productAdditiveData, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }
                } catch (err) {
                    createLog(err, 'updateProductAdditive', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/{productId}/delete-product-additive/{productAdditiveId}:
     *   delete:
     *     tags:
     *       - ProductsController
     *     summary: Delete product additive by additive ID
     *     parameters:
     *       - in: path
     *         name: productId
     *         schema:
     *           type: integer
     *         required: true
     *         description: product ID
     *       - in: path
     *         name: productAdditiveId
     *         schema:
     *           type: integer
     *         required: true
     *         description: product additive ID
     *       - name: token
     *         in: header
     *         type: string
     *         required: true
     *         description: token
     *     responses:
     *       200:
     *         description: Product Additive Deleted Successfully.
     * 
     */

    public deleteProductAdditive(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productModel.deleteProductAdditive(user_id, parseInt(request.params.productId), parseInt(request.params.productAdditiveId), function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }
                } catch (err) {
                    createLog(err, 'deleteProductAdditive', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
      * @swagger
      * /products/update-default-image/{productId}:
      *   put:
      *     tags:
      *       - ProductsController
      *     description:
      *       Update product default image Api
      *     parameters:
      *       - in: path
      *         name: productId
      *         type: integer
      *       - name: token
      *         in: header
      *         type: string
      *         required: true
      *       - name: body
      *         description: object
      *         in: body
      *         required: true
      *         schema:
      *           type: object 
      *           required:
      *             - image_id
      *           properties:
      *             image_id:
      *               type: number 
      *     responses:
      *       200:
      *         description: Default Image updated successfully.
      * 
      */

    public updateDefaultImage(): any {
        return [
            authenticateJWT,
            this.productsValidation.updateDefaultImage(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productModel.updateDefaultImage(user_id, parseInt(request.params.productId), request.body.image_id, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponse(response, code);
                            }
                        })

                    }
                } catch (err) {
                    createLog(err, 'updateDefaultImage', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
    * @swagger
    * /products/status/{productId}:
    *   put:
    *     tags:
    *       - ProductsController
    *     description:
    *       mark product status as complete
    *     parameters:
    *       - in: path
    *         name: productId
    *         type: integer
    *         required: true
    *       - name: token
    *         in: header
    *         type: string
    *         required: true
    *     responses:
    *       200:
    *         description: Update product status as complete successfully.
    * 
    */

    public updateStatusForCompleteProduct(): any {
        return [
            authenticateJWT,
            this.productsValidation.productIdValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const userId = parseInt(`${request.headers.userId}`);
                        productModel.updateStatusForCompleteProduct(parseInt(request.params.productId), userId, function (error: boolean, code: string) {
                            if (!error) {
                                return apiResponse.successResponse(response, code);
                            }
                            return apiResponse.ErrorResponse(response, code);
                        })
                    }
                } catch (err) {
                    createLog(err, 'updateStatusForCompleteProduct', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/{productId}/share-product/{encryptedProductId}:
     *   post:
     *     tags:
     *       - ProductsController
     *     summary: Share Product
     *     parameters:
     *       - in: path
     *         name: productId
     *         schema:
     *           type: integer
     *         required: true
     *         description: product ID
     *       - in: path
     *         name: encryptedProductId
     *         schema:
     *           type: string
     *         required: true
     *         description: Encrypted ProductId ID
     *       - in: body
     *         name: emails share with
     *         schema:
     *           type: array
     *           items:
     *             type: string
     *           example: ["str@str.com"]
     *         required: true
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Product Shared Successfully.
     */


    public addShareProduct(): any {
        return [
            authenticateJWT,
            this.productsValidation.addShareProduct(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productModel.addShareProduct(user_id, parseInt(request.params.productId), request.params.encryptedProductId.toString(), request.body, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }
                } catch (err) {
                    createLog(err, 'addShareProduct', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }


    /**
    * @swagger
    * /products/shared-products/list:
    *   get:
    *     tags:
    *       - ProductsController
    *     summary: Get a shared Products list
    *     parameters:
    *       - name: keyword
    *         in: query
    *         type: string
    *         required: false
    *         description: search shared product by keyword name
    *       - name: page
    *         in: query
    *         type: integer
    *         required: false
    *         description: Get shared products list by page
    *       - name: limit
    *         in: query
    *         type: integer
    *         required: false
    *         description: Get shared products list by limit
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Get shared products list Successfully.
    * 
    */

    public listShareProducts(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        const keyword: string = request.query.keyword ? request.query.keyword.toString() : null;
                        const page: number = request.query.page ? +request.query.page : null;
                        const limit: number = request.query.limit ? +request.query.limit : null;

                        productModel.getSharedProductsList(user_id, keyword, page, limit, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'listShareProducts', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }


    /**
     * @swagger
     * /products/{productId}/share-products/already-shared-list:
     *   get:
     *     tags:
     *       - ProductsController
     *     summary: Get Product Already Share list
     *     parameters:
     *       - in: path
     *         name: productId
     *         schema:
     *           type: integer
     *         required: true
     *         description: product ID
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Get product already share list Successfully.
     * 
     */

    public listEmailsProductAlreadyShareWith(): any {
        return [
            authenticateJWT,
            this.productsValidation.productIdValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productModel.getEmailsProductAlreadyShareWithList(user_id, parseInt(request.params.productId), function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'listEmailsProductAlreadyShareWith', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/{productId}/share-products/revoke-email/{userId}:
     *   post:
     *     tags:
     *       - ProductsController
     *     summary: Revoke email
     *     parameters:
     *       - in: path
     *         name: productId
     *         schema:
     *           type: integer
     *         required: true
     *         description: product ID
     *       - in: path
     *         name: userId
     *         schema:
     *           type: integer
     *         required: true
     *         description: user ID
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Email Revoked Successfully.
     * 
     */

    public RevokeEmailProductAlreadyShareWith(): any {
        return [
            authenticateJWT,
            this.productsValidation.productIdValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        productModel.RevokeEmailWithUserIdProductAlreadyShareWith(parseInt(request.params.userId), parseInt(request.params.productId), function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'RevokeEmailProductAlreadyShareWith', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
    * @swagger
    * /products/{productId}/search-replacements:
    *   post:
    *     tags:
    *       - ProductsController
    *     summary: Search Product Replacements
    *     parameters:
    *       - in: path
    *         name: productId
    *         schema:
    *           type: integer
    *         required: true
    *         description: product ID
    *       - name: body
    *         in: body
    *         required: true
    *         description: body
    *         schema:
    *           type: object 
    *           required:
    *             - additivesId
    *           properties:
    *             additivesId:
    *               type: array
    *               items:
    *                 type: integer
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Product Replacements Searched Successfully.
    */

    public productSearchReplacements(): any {
        return [
            authenticateJWT,
            this.productsValidation.productSearchReplacements(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        let additivesId = request.body && request.body.additivesId ? request.body.additivesId : [];
                        productModel.SearchProductReplacements(user_id, parseInt(request.params.productId), additivesId, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'productSearchReplacements', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
     * @swagger
     * /products/popular-products/list:
     *   get:
     *     tags:
     *       - ProductsController
     *     summary: Get a Popular Products list
     *     parameters:
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Get popular products list Successfully.
     * 
     */

    public listPopularProducts(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        let popularProductIds = (process.env.DEFAULT_POPULAR_PRODUCTS_IDS).split(',').map(function (popularProductId) {
                            return +popularProductId;
                        });
                        productModel.getPopularProductsList(popularProductIds, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'listPopularProducts', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
    * @swagger
    * /products/{productId}/add-replacement/{additivePlantReplacementId}:
    *   post:
    *     tags:
    *       - ProductsController
    *     summary: Add Replacement to list
    *     parameters:
    *       - in: path
    *         name: productId
    *         schema:
    *           type: integer
    *         required: true
    *         description: product ID
    *       - in: path
    *         name: additivePlantReplacementId
    *         schema:
    *           type: integer
    *         required: true
    *         description: additive plant replacement ID
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Product Additive Replacement Added Successfully.
    */

    public addProductReplacementToList(): any {
        return [
            authenticateJWT,
            this.productsValidation.addProductReplacementToListValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productReplacementService.AddProductReplacementToList(user_id, parseInt(request.params.productId), parseInt(request.params.additivePlantReplacementId), function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'addProductReplacementToList', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
  * @swagger
  * /products/{productId}/delete-replacement/{productReplacementId}:
  *   delete:
  *     tags:
  *       - ProductsController
  *     summary: Delete Replacement 
  *     parameters:
  *       - in: path
  *         name: productId
  *         schema:
  *           type: integer
  *         required: true
  *         description: product ID
  *       - in: path
  *         name: productReplacementId
  *         schema:
  *           type: integer
  *         required: true
  *         description: productReplacementId
  *       - name: token
  *         in: header
  *         type: string
  *         required: false
  *         description: token
  *     responses:
  *       200:
  *         description: Product Replacement Deleted Successfully.
  */

    public deleteProductReplacement(): any {
        return [
            authenticateJWT,
            this.productsValidation.productIdValidation(),
            this.productsValidation.productReplacementIdValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productReplacementService.deleteProductReplacement(user_id, parseInt(request.params.productId), parseInt(request.params.productReplacementId), function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponse(response, code);
                            }
                        })

                    }
                } catch (err) {
                    createLog(err, 'deleteProductReplacement', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /** 
    * @swagger
    * /products/{productId}/replacement-log-add/{productAdditiveReplacementId}:
    *   post:
    *     tags:
    *       - ProductsController
    *     summary: Add product replacement log
    *     parameters:
    *       - in: path
    *         name: productId
    *         schema:
    *           type: integer
    *         required: true
    *         description: product ID
    *       - in: path
    *         name: productAdditiveReplacementId
    *         schema:
    *           type: integer
    *         required: true
    *         description: product additive replacement ID
    *       - in: formData
    *         name: comment
    *         type: string
    *         required: true
    *         description: comment
    *       - in: formData
    *         name: file1
    *         type: file
    *         required: false
    *         description: file1
    *       - in: formData
    *         name: file2
    *         type: file
    *         required: false
    *         description: file2
    *       - in: formData
    *         name: tags
    *         type: array
    *         items:
    *           type: string
    *         example: ["str1", "str2"]
    *         required: false
    *         description: tags
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Product Replacement Log Added Successfully.
    */
    public addLogForSingleReplacement(): any {
        return [
            authenticateJWT,
            this.productsValidation.addLogForSingleReplacementValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productService.checkIfProductExistsToUser(user_id, parseInt(request.params.productId)).then((product) => {
                            let ReplacementDataForLogs = {
                                productId: product.id,
                                productAdditiveReplacementId: parseInt(request.params.productAdditiveReplacementId),
                                comment: request.body.comment,
                                status: 1
                            }
                            let tags: string[] = request.body && request.body.tags ? request.body.tags.split(",") : [];
                            // Limit number of files
                            const maxFileLimit = parseInt(process.env.MAX_PRODUCT_IMAGES_LIMIT);
                            if (request.files.length > maxFileLimit) {
                                return apiResponse.ErrorResponse(response, 'PRODUCT0017');
                            } else {
                                productReplacementService.AddProductReplacementLog(ReplacementDataForLogs, function (error: boolean, replacementLogDataObj: any, code: string) {
                                    if (error) {
                                        return apiResponse.ErrorResponse(response, code);
                                    } else {
                                        if (request.files.length > 0) {
                                            let subFolderName = randomstring.generate({
                                                length: 6,
                                                charset: 'alphabetic'
                                            });
                                            s3.uploadFileToLocalAndSaveToS3('uploadProductReplacementLogDocs', 'productReplacementLog/files', subFolderName, request, response, ['files'], replacementLogDataObj.id, async function (err: any, docName: any) {
                                                if (err) {
                                                    return apiResponse.ErrorResponse(response, "PRODUCT0010");
                                                } else {
                                                    let files = [];
                                                    docName.forEach(function (name, index) {
                                                        files.push({
                                                            "user_product_replacement_log_id": replacementLogDataObj.id,
                                                            "file": name,
                                                            "status": 1
                                                        });
                                                    });
                                                    productReplacementService.saveDataForFilesAndTags(replacementLogDataObj.id, files, tags, function (error: boolean, data: any, code: string) {
                                                        if (error) {
                                                            return apiResponse.ErrorResponse(response, code);
                                                        } else {
                                                            return apiResponse.successResponseWithData(response, code, { id: replacementLogDataObj.id });
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            productReplacementService.saveDataForFilesAndTags(replacementLogDataObj.id, [], tags, function (error: boolean, data: any, code: string) {
                                                if (error) {
                                                    return apiResponse.ErrorResponse(response, code);
                                                } else {
                                                    return apiResponse.successResponseWithData(response, code, { id: replacementLogDataObj.id });
                                                }
                                            });
                                        }
                                    }
                                })
                            }
                        }).catch((err) => {
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }
                } catch (err) {
                    createLog(err, 'addLogForSingleReplacement', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
    * @swagger
    * /products/{productId}/{productAdditiveReplacementId}/replacement-log-details/{productReplacementLogId}:
    *   get:
    *     tags:
    *       - ProductsController
    *     summary: Get product replacement log by product id and product replacement log id
    *     parameters:
    *       - in: path
    *         name: productId
    *         schema:
    *           type: integer
    *         required: true
    *       - in: path
    *         name: productAdditiveReplacementId
    *         schema:
    *           type: integer
    *         required: true
    *         description: product additive replacement ID
    *       - in: path
    *         name: productReplacementLogId
    *         schema:
    *           type: integer
    *         required: true
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Get product replacement log detail Successfully.
    * 
    */

    public getProductReplacementLogDetail(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productService.checkIfProductExistsToUser(user_id, parseInt(request.params.productId)).then((product) => {
                            productReplacementService.getProductReplacementLogDetail(product.id, parseInt(request.params.productAdditiveReplacementId), parseInt(request.params.productReplacementLogId), function (error: boolean, data: any, code: string) {
                                if (error) {
                                    return apiResponse.ErrorResponse(response, code);
                                } else {
                                    return apiResponse.successResponseWithData(response, code, data);
                                }
                            })
                        }).catch((err) => {
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }

                } catch (err) {
                    createLog(err, 'getProductReplacementLogDetail', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
    * @swagger
    * /products/{productId}/{productAdditiveReplacementId}/replacement-log-edit/{productReplacementLogId}:
    *   put:
    *     tags:
    *       - ProductsController
    *     summary: update product replacement log
    *     parameters:
    *       - in: path
    *         name: productId
    *         schema:
    *           type: integer
    *         required: true
    *         description: product ID
    *       - in: path
    *         name: productAdditiveReplacementId
    *         schema:
    *           type: integer
    *         required: true
    *         description: product additive replacement ID
    *       - in: path
    *         name: productReplacementLogId
    *         schema:
    *           type: integer
    *         required: true
    *         description: product replacement log ID
    *       - in: formData
    *         name: comment
    *         type: string
    *         required: true
    *         description: comment
    *       - in: formData
    *         name: file1
    *         type: file
    *         required: false
    *         multiple: true
    *         description: file1
    *       - in: formData
    *         name: file2
    *         type: file
    *         required: false
    *         description: file2
    *       - in: formData
    *         name: tags
    *         type: array
    *         items:
    *           type: string
    *         example: ["str1", "str2"]
    *         required: false
    *         description: tags
    *       - in: formData
    *         name: fileIds
    *         type: array
    *         items:
    *           type: integer
    *         example: [0, 1]
    *         required: false
    *         description: fileIds
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Product Replacement Log Updated Successfully.
    */
    public updateSingleProductReplacementLog(): any {
        return [
            authenticateJWT,
            this.productsValidation.addLogForSingleReplacementValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productService.checkIfProductExistsToUser(user_id, parseInt(request.params.productId)).then((product) => {
                            let ReplacementDataForLogs = {
                                productId: product.id,
                                productAdditiveReplacementId: parseInt(request.params.productAdditiveReplacementId),
                                id: parseInt(request.params.productReplacementLogId),
                                comment: request.body.comment,
                            }
                            let tags: string[] = request.body && request.body.tags ? request.body.tags.split(",") : [];
                            let fileIds: number[] = request.body && request.body.fileIds ? request.body.fileIds.split(",") : [];
                            // Limit number of files
                            const maxFileLimit = parseInt(process.env.MAX_PRODUCT_IMAGES_LIMIT);
                            if (request.files.length > maxFileLimit) {
                                return apiResponse.ErrorResponse(response, 'PRODUCT0017');
                            } else {
                                productReplacementService.updateProductReplacementLog(ReplacementDataForLogs, function (error: boolean, replacementLogDataObj: any, code: string) {
                                    if (error) {
                                        return apiResponse.ErrorResponse(response, code);
                                    } else {
                                        if (request.files.length > 0) {
                                            let subFolderName = randomstring.generate({
                                                length: 6,
                                                charset: 'alphabetic'
                                            });
                                            s3.uploadFileToLocalAndSaveToS3('uploadProductReplacementLogDocs', 'productReplacementLog/files', subFolderName, request, response, ['files'], ReplacementDataForLogs.id, async function (err: any, docName: any) {
                                                if (err) {
                                                    return apiResponse.ErrorResponse(response, "PRODUCT0010");
                                                } else {
                                                    let files = [];
                                                    docName.forEach(function (name, index) {
                                                        files.push({
                                                            "user_product_replacement_log_id": ReplacementDataForLogs.id,
                                                            "file": name,
                                                            "status": 1
                                                        });
                                                    });
                                                    productReplacementService.updateDataForFilesAndTags(ReplacementDataForLogs.id, files, tags, fileIds, function (error: boolean, data: any, code: string) {
                                                        if (error) {
                                                            return apiResponse.ErrorResponse(response, code);
                                                        } else {
                                                            return apiResponse.successResponseWithData(response, code, { id: ReplacementDataForLogs.id });
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            productReplacementService.updateDataForFilesAndTags(ReplacementDataForLogs.id, [], tags, fileIds, function (error: boolean, data: any, code: string) {
                                                if (error) {
                                                    return apiResponse.ErrorResponse(response, code);
                                                } else {
                                                    return apiResponse.successResponseWithData(response, code, { id: ReplacementDataForLogs.id });
                                                }
                                            });
                                        }
                                    }
                                })
                            }
                        }).catch((err) => {
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }
                } catch (err) {
                    createLog(err, 'updateSingleProductReplacementLog', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
    * @swagger
    * /products/{productId}/replacement-details/{additivePlantReplacementId}:
    *   get:
    *     tags:
    *       - ProductsController
    *     summary: Get product replacement details by product id and additive plant replacement id
    *     parameters:
    *       - in: path
    *         name: productId
    *         schema:
    *           type: integer
    *         required: true
    *         description: product Id
    *       - in: path
    *         name: additivePlantReplacementId
    *         schema:
    *           type: integer
    *         required: true
    *         description: additive plant replacement ID
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Get product replacement detail Successfully.
    */

    public getProductRelacementDetail(): any {
        return [
            authenticateJWT,
            this.productsValidation.addProductReplacementToListValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productReplacementService.getProductReplacementDetail(user_id, parseInt(request.params.productId), parseInt(request.params.additivePlantReplacementId), function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'getProductRelacementDetail', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
       * @swagger
       * /products/{productId}/save-comment:
       *   post:
       *     tags:
       *       - ProductsController
       *     summary: Save Comment
       *     parameters:
       *       - in: path
       *         name: productId
       *         schema:
       *           type: integer
       *         required: true
       *         description: product ID
       *       - in: body
       *         name: body
       *         schema:
       *           type: object
       *           required:
       *             - comment
       *           properties:
       *             comment:
       *               type: string
       *               description: product comment
       *       - name: token
       *         in: header
       *         type: string
       *         required: false
       *         description: token
       *     responses:
       *       200:
       *         description: Product comment saved Successfully.
       */

    public saveComment(): any {
        return [
            authenticateJWT,
            this.productsValidation.saveComment(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        productService.checkIfProductExistsToUser(+request.headers.userId, parseInt(request.params.productId)).then((product) => {
                            let productData = {
                                user_product_id: product.id,
                                comment: request.body.comment,
                            };
                            productModel.saveComment(productData, function (error: boolean, data: any, code: string) {
                                if (error) {
                                    return apiResponse.ErrorResponse(response, code);
                                } else {
                                    return apiResponse.successResponseWithData(response, code, data);
                                }
                            })
                        }).catch((err) => {
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }

                } catch (err) {
                    createLog(err, 'saveComment', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
    * @swagger
    * /products/{productId}/replacement-log-tags:
    *   get:
    *     tags:
    *       - ProductsController
    *     summary: Get Unique Replacement Log Tags
    *     parameters:
    *       - in: path
    *         name: productId
    *         schema:
    *           type: integer
    *         required: true
    *         description: product Id
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Get replacement log tags list Successfully.
    */

    public getUniqueReplacementLogTags(): any {
        return [
            authenticateJWT,
            this.productsValidation.productIdValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productService.checkIfProductExistsToUser(user_id, parseInt(request.params.productId)).then((product) => {
                            productModel.getUniqueReplacementLogTags(function (error: boolean, data: any, code: string) {
                                if (error) {
                                    return apiResponse.ErrorResponse(response, code);
                                } else {
                                    return apiResponse.successResponseWithData(response, code, data);
                                }
                            })
                        }).catch((err) => {
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }

                } catch (err) {
                    createLog(err, 'getUniqueReplacementLogTags', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }


    /**
* @swagger
* /products/{productId}/create-replacement-group:
*   post:
*     tags:
*       - ProductsController
*     summary: Create new replacement group
*     parameters:
*       - in: path
*         name: productId
*         schema:
*           type: integer
*         required: true
*         description: product Id
*       - in: body
*         name: body
*         schema:
*           type: object
*           required:
*             - comment
*             - groupData
*             - groupName
*           properties:
*             comment:
*               type: string
*             groupData:
*               type: object
*             groupName:
*               type: string
*       - name: token
*         in: header
*         type: string
*         required: false
*         description: token
*     responses:
*       200:
*         description: Replacement group created successfully..
*/


    public createReplacementGroup(): any {
        return [
            authenticateJWT,
            this.productsValidation.productReplacementGroupValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const productId = +request.params.productId;
                        const userId = +request.headers.userId;
                        let data = request.body
                        replacementGroupsService.createReplacementGroup(productId, userId, data, function (error: boolean, code: string, data: any) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'createReplacementGroup', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }


    /**
    * @swagger
    * /products/{productId}/{groupId}/update-replacement-group:
    *   put:
    *     tags:
    *       - ProductsController
    *     summary: Update replacement group
    *     parameters:
    *       - in: path
    *         name: productId
    *         schema:
    *           type: integer
    *         required: true
    *         description: Product Id
    *       - in: path
    *         name: groupId
    *         schema:
    *           type: integer
    *         required: true
    *         description: Group Id
    *       - in: body
    *         name: body
    *         schema:
    *           type: object
    *           required:
    *             - groupData
    *             - groupName
    *             - comment
    *           properties:
    *             groupData:
    *               type: object
    *             groupName:
    *               type: string
    *             comment:
    *               type: string
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Replacement group updated successfully..
    */



    public updateReplacementGroup(): any {
        return [
            authenticateJWT,
            this.productsValidation.productReplacementGroupValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const groupId = +request.params.groupId;
                        const productId = +request.params.productId;
                        const userId = +request.headers.userId;

                        let data = request.body
                        replacementGroupsService.updateReplacementGroup(groupId, userId, productId, data, function (error: boolean, code: string, data: any) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'updateReplacementGroup', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }

    /**
   * @swagger
   * /products/{productId}/delete-replacement-group/{groupId}:
   *   delete:
   *     tags:
   *       - ProductsController
   *     summary: Delete replacement group
   *     parameters:
   *       - in: path
   *         name: productId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Product Id
   *       - in: path
   *         name: groupId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Group Id
   *       - name: token
   *         in: header
   *         type: string
   *         required: false
   *         description: token
   *     responses:
   *       200:
   *         description: Replacement group deleted successfully.
   */


    public deletePlantAdditiveReplacementGroup(): any {
        return [
            authenticateJWT,
            // this.productsValidation.plantAdditiveReplacementValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const groupId = +request.params.groupId;
                        const productId = +request.params.productId;
                        replacementGroupsService.deletePlantAdditiveReplacementGroup(groupId, productId, function (error: boolean, code: string, data: any) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'deletePlantAdditiveReplacementGroup', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }

    /**
   * @swagger
   * /products/{productId}/get-replacement-groups:
   *   get:
   *     tags:
   *       - ProductsController
   *     summary: Get product replacement groups
   *     parameters:
   *       - in: path
   *         name: productId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Product Id
   *       - name: token
   *         in: header
   *         type: string
   *         required: false
   *         description: token
   *     responses:
   *       200:
   *         description: Replacement groups fetched successfully.
   */

    public getReplacementGroupsForProduct(): any {
        return [
            authenticateJWT,
            // this.productsValidation.plantAdditiveReplacementValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const groupId = +request.params.groupId;
                        const productId = +request.params.productId;
                        replacementGroupsService.getReplacementGroupsForProduct(productId, function (error: boolean, code: string, data: any) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'getReplacementGroupsForProduct', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }

    /** 
 * @swagger
 * /products/{productId}/replacement-group-log-add/{productReplacementGroupId}:
 *   post:
 *     tags:
 *       - ProductsController
 *     summary: Add product replacement group log.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: product ID
 *       - in: path
 *         name: productReplacementGroupId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product replacement group ID
 *       - in: formData
 *         name: comment
 *         type: string
 *         required: true
 *         description: comment
 *       - in: formData
 *         name: file1
 *         type: file
 *         required: false
 *         description: file1
 *       - in: formData
 *         name: file2
 *         type: file
 *         required: false
 *         description: file2
 *       - in: formData
 *         name: tags
 *         type: array
 *         items:
 *           type: string
 *         example: ["str1", "str2"]
 *         required: false
 *         description: tags
 *       - name: token
 *         in: header
 *         type: string
 *         required: false
 *         description: token
 *     responses:
 *       200:
 *         description: Product Replacement Group Log Added Successfully.
 */

    public addLogForGroupReplacement(): any {
        return [
            authenticateJWT,
            this.productsValidation.addLogForSingleReplacementGroupValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id: number = +request.headers.userId || 0;
                        productService.checkIfProductExistsToUser(user_id, parseInt(request.params.productId)).then((product) => {
                            let ReplacementGroupDataForLogs = {
                                productId: product.id,
                                productReplacementGroupId: parseInt(request.params.productReplacementGroupId),
                                comment: request.body.comment,
                                status: 1
                            }

                            let tags: string[] = request.body && request.body.tags ? request.body.tags.split(",") : [];
                            // Limit number of files
                            const maxFileLimit = parseInt(process.env.MAX_PRODUCT_IMAGES_LIMIT);
                            if (request.files.length > maxFileLimit) {
                                return apiResponse.ErrorResponse(response, 'PRODUCT0017');
                            } else {

                                replacementGroupLogsService.AddProductReplacementGroupLog(ReplacementGroupDataForLogs, user_id, function (error: boolean, replacementGroupLogData: any, code: string) {
                                    if (error) {
                                        return apiResponse.ErrorResponse(response, code);
                                    } else {

                                        if (request.files.length > 0) {
                                            let subFolderName = randomstring.generate({
                                                length: 6,
                                                charset: 'alphabetic'
                                            });
                                            s3.uploadFileToLocalAndSaveToS3('uploadProductReplacementGroupLogDocs', 'productReplacementGroupLog/files', subFolderName, request, response, ['files'], replacementGroupLogData.id, async function (err: any, docName: any) {
                                                if (err) {
                                                    return apiResponse.ErrorResponse(response, "PRODUCT0010");
                                                } else {
                                                    let files = [];
                                                    docName.forEach(function (name, index) {
                                                        files.push({
                                                            "user_product_replacement_group_log_id": replacementGroupLogData.id,
                                                            "file": name,
                                                            "status": 1
                                                        });
                                                    });

                                                    replacementGroupLogsService.saveDataForReplacementGroupFilesAndTags(replacementGroupLogData.id, files, tags, function (error: boolean, data: any, code: string) {
                                                        if (error) {
                                                            return apiResponse.ErrorResponse(response, code);
                                                        } else {
                                                            return apiResponse.successResponseWithData(response, code, { id: replacementGroupLogData.id });
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            replacementGroupLogsService.saveDataForReplacementGroupFilesAndTags(replacementGroupLogData.id, [], tags, function (error: boolean, data: any, code: string) {
                                                if (error) {
                                                    return apiResponse.ErrorResponse(response, code);
                                                } else {
                                                    return apiResponse.successResponseWithData(response, code, { id: replacementGroupLogData.id });
                                                }
                                            });
                                        }
                                    }
                                })
                            }
                        }).catch((err) => {
                            createLog(err, 'addLogForGroupReplacement', null, "productsController");
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }
                } catch (err) {
                    createLog(err, 'addLogForGroupReplacement', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
   * @swagger
   * /products/{productId}/{productReplacementGroupId}/replacement-group-log-details:
   *   get:
   *     tags:
   *       - ProductsController
   *     summary: Get product replacement group log by product id and product replacement group log id
   *     parameters:
   *       - in: path
   *         name: productId
   *         schema:
   *           type: integer
   *         required: true
   *       - in: path
   *         name: productReplacementGroupId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Product replacement group id
   *       - name: token
   *         in: header
   *         type: string
   *         required: false
   *         description: token
   *     responses:
   *       200:
   *         description: Product replacement group log details fetched Successfully.
   * 
   */

    public getProductReplacementGroupLogDetail(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productService.checkIfProductExistsToUser(user_id, parseInt(request.params.productId)).then((product) => {
                            replacementGroupLogsService.getProductReplacementGroupLogDetail(product.id, parseInt(request.params.productReplacementGroupId), function (error: boolean, data: any, code: string) {
                                if (error) {
                                    return apiResponse.ErrorResponse(response, code);
                                } else {
                                    return apiResponse.successResponseWithData(response, code, data);
                                }
                            })
                        }).catch((err) => {
                            createLog(err, 'getProductReplacementGroupLogDetail', null, "productsController");
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }

                } catch (err) {
                    createLog(err, 'getProductReplacementGroupLogDetail', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
  * @swagger
  * /products/{productId}/{productReplacementGroupId}/replacement-group-log-edit/{productReplacementLogId}:
  *   put:
  *     tags:
  *       - ProductsController
  *     summary: update product replacement group log
  *     parameters:
  *       - in: path
  *         name: productId
  *         schema:
  *           type: integer
  *         required: true
  *         description: product ID
  *       - in: path
  *         name: productReplacementGroupId
  *         schema:
  *           type: integer
  *         required: true
  *         description: product additive replacement ID
  *       - in: path
  *         name: productReplacementLogId
  *         schema:
  *           type: integer
  *         required: true
  *         description: product replacement group log ID
  *       - in: formData
  *         name: comment
  *         type: string
  *         required: true
  *         description: comment
  *       - in: formData
  *         name: file1
  *         type: file
  *         required: false
  *         multiple: true
  *         description: file1
  *       - in: formData
  *         name: file2
  *         type: file
  *         required: false
  *         description: file2
  *       - in: formData
  *         name: tags
  *         type: array
  *         items:
  *           type: string
  *         example: ["str1", "str2"]
  *         required: false
  *         description: tags
  *       - in: formData
  *         name: fileIds
  *         type: array
  *         items:
  *           type: integer
  *         example: [0, 1]
  *         required: false
  *         description: fileIds
  *       - name: token
  *         in: header
  *         type: string
  *         required: false
  *         description: token
  *     responses:
  *       200:
  *         description: Product Replacement Group Log Updated Successfully.
  */

    public updateSingleProductReplacementGroupLog(): any {
        return [
            authenticateJWT,
            this.productsValidation.addLogForSingleReplacementGroupValidation(),
            async (request: Request, response: Response) => {
                try {

                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id: number = +request.headers.userId;
                        productService.checkIfProductExistsToUser(user_id, parseInt(request.params.productId)).then((product) => {
                            let ReplacementDataForLogs = {
                                productId: product.id,
                                productAdditiveReplacementId: parseInt(request.params.productReplacementGroupId),
                                id: parseInt(request.params.productReplacementLogId),
                                comment: request.body.comment,
                            }

                            let tags: string[] = request.body && request.body.tags ? request.body.tags.split(",") : [];
                            let fileIds: number[] = request.body && request.body.fileIds ? request.body.fileIds.split(",") : [];
                            // Limit number of files
                            const maxFileLimit = parseInt(process.env.MAX_PRODUCT_IMAGES_LIMIT);
                            if (request.files.length > maxFileLimit) {
                                return apiResponse.ErrorResponse(response, 'PRODUCT0017');
                            } else {
                                replacementGroupLogsService.updateProductReplacementGroupLog(ReplacementDataForLogs, user_id, function (error: boolean, replacementLogDataObj: any, code: string) {
                                    if (error) {
                                        return apiResponse.ErrorResponse(response, code);
                                    } else {
                                        if (request.files.length > 0) {
                                            let subFolderName = randomstring.generate({
                                                length: 6,
                                                charset: 'alphabetic'
                                            });
                                            s3.uploadFileToLocalAndSaveToS3('uploadProductReplacementGroupLogDocs', 'productReplacementGroupLog/files', subFolderName, request, response, ['files'], ReplacementDataForLogs.id, async function (err: any, docName: any) {
                                                if (err) {
                                                    return apiResponse.ErrorResponse(response, "PRODUCT0010");
                                                } else {
                                                    let files = [];
                                                    docName.forEach(function (name, index) {
                                                        files.push({
                                                            "user_product_replacement_group_log_id": ReplacementDataForLogs.id,
                                                            "file": name,
                                                            "status": 1
                                                        });
                                                    });
                                                    replacementGroupLogsService.updateDataForReplacementGroupFilesAndTags(ReplacementDataForLogs.id, files, tags, fileIds, function (error: boolean, data: any, code: string) {
                                                        if (error) {
                                                            return apiResponse.ErrorResponse(response, code);
                                                        } else {
                                                            return apiResponse.successResponseWithData(response, code, { id: ReplacementDataForLogs.id });
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            replacementGroupLogsService.updateDataForReplacementGroupFilesAndTags(ReplacementDataForLogs.id, [], tags, fileIds, function (error: boolean, data: any, code: string) {
                                                if (error) {
                                                    return apiResponse.ErrorResponse(response, code);
                                                } else {
                                                    return apiResponse.successResponseWithData(response, code, { id: ReplacementDataForLogs.id });
                                                }
                                            });
                                        }
                                    }
                                })
                            }
                        }).catch((err) => {
                            createLog(err, 'updateSingleProductReplacementGroupLog', null, "productsController");
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }
                } catch (err) {
                    createLog(err, 'updateSingleProductReplacementGroupLog', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
  * @swagger
  * /products/{productId}/replacement-group-log-tags:
  *   get:
  *     tags:
  *       - ProductsController
  *     summary: Get Unique replacement group Log Tags
  *     parameters:
  *       - in: path
  *         name: productId
  *         schema:
  *           type: integer
  *         required: true
  *         description: product Id
  *       - name: token
  *         in: header
  *         type: string
  *         required: false
  *         description: token
  *     responses:
  *       200:
  *         description: Get replacement group log tags list Successfully.
  */

    public getUniqueReplacementGroupLogTags(): any {
        return [
            authenticateJWT,
            this.productsValidation.productIdValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productService.checkIfProductExistsToUser(user_id, parseInt(request.params.productId)).then((product) => {
                            replacementGroupLogsService.getUniqueReplacementGroupLogTags(function (error: boolean, data: any, code: string) {
                                if (error) {
                                    return apiResponse.ErrorResponse(response, code);
                                } else {
                                    return apiResponse.successResponseWithData(response, code, data);
                                }
                            })
                        }).catch((err) => {
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }

                } catch (err) {
                    createLog(err, 'getUniqueReplacementGroupLogTags', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
    * @swagger
    * /products/{productId}/search-plant-replacement-suggestion:
    *   post:
    *     tags:
    *       - ProductsController
    *     summary: Get a plants replacement suggestion
    *     parameters:
    *       - in: path
    *         name: productId
    *         schema:
    *           type: integer
    *         required: true
    *         description: product ID
    *       - name: body
    *         in: body
    *         required: true
    *         description: body
    *         schema:
    *           type: object 
    *           required:
    *             - additivesId
    *           properties:
    *             additivesId:
    *               type: array
    *               items:
    *                 type: integer
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Plant suggestion list display Successfully.
    * 
    */

    public searchPlantsReplacementSuggestions(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        let additivesId = request.body && request.body.additivesId ? request.body.additivesId : [];
                        productModel.searchPlantsReplacementSuggestions(user_id, parseInt(request.params.productId), additivesId, function (error: boolean, data: any, code: string) {

                            if (!error) {
                                return apiResponse.successResponseWithData(response, code, data);
                            }

                            return apiResponse.unauthorizedResponse(response, code);
                        })

                    }

                } catch (err) {
                    createLog(err, 'searchPlantsReplacementSuggestions', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
* @swagger
* /products/{productId}/create-product-formulation:
*   post:
*     tags:
*       - ProductsController
*     summary: Create new formulation group
*     parameters:
*       - in: path
*         name: productId
*         schema:
*           type: integer
*         required: true
*         description: product Id
*       - in: body
*         name: body
*         schema:
*           type: object
*           required:
*             - formulationName
*             - comment
*             - preparedByUserId
*             - conductedByUserId
*             - preparationSteps
*             - approvedByUserId
*             - formulationResult
*             - formulationKPIData
*             - formulationId
*           properties:
*             formulationName:
*               type: string
*             comment:
*               type: string
*             preparedByUserId:
*                type: number
*             conductedByUserId:
*                type: number
*             preparationSteps:
*                type: string
*             approvedByUserId:
*                type: number
*             formulationResult:
*                type: string
*             formulationKPIData:
*                type: object
*                properties:
*                  additivePlantReplacementIds:
*                    type: object
*                  groupIds:
*                    type: object
*                  userProductadditiveIds:
*                    type: object
*                example:
*                  groupIds: {}
*                  additivePlantReplacementIds: {}
*                  userProductadditiveIds: {}
*             formulationId:
*                type: number
*       - name: token
*         in: header
*         type: string
*         required: false
*         description: token
*     responses:
*       200:
*         description: Formulation group created successfully..
*/



    public createFormulation(): any {
        return [
            authenticateJWT,
            this.productsValidation.addUpdateformulationGroupValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const productId = +request.params.productId;
                        let userId: number = +request.headers.userId || 0
                        let data = request.body
                        productFormulationService.createFormulation(productId, userId, data, function (error: boolean, code: string, data: any) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'createFormulation', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }



    /**
* @swagger
* /products/{productId}/{formulationId}/update-product-formulation:
*   put:
*     tags:
*       - ProductsController
*     summary: Update formulation group
*     parameters:
*       - in: path
*         name: productId
*         schema:
*           type: integer
*         required: true
*         description: Product Id
*       - in: path
*         name: formulationId
*         schema:
*           type: integer
*         required: true
*         description: Formulation Id
*       - in: body
*         name: body
*         schema:
*           type: object
*           required:
*             - formulationData
*             - formulationName
*             - comment
*             - preparedByUserId
*             - conductedByUserId
*             - preparationSteps
*             - approvedByUserId
*             - formulationResult
*           properties:
*             formulationData:
*               type: object
*               properties:
*                 additivePlantReplacementIds:
*                   type: object
*                 groupIds:
*                   type: object
*             formulationName:
*               type: string
*             comment:
*               type: string
*             preparedByUserId:
*                type: number
*             conductedByUserId:
*                type: number
*             preparationSteps:
*                type: string
*             approvedByUserId:
*                type: number
*             formulationResult:
*                type: string
*       - name: token
*         in: header
*         type: string
*         required: false
*         description: token
*     responses:
*       200:
*         description: Product formulation updated successfully.
*/


    public updateProductFormulation(): any {
        return [
            authenticateJWT,
            this.productsValidation.addUpdateformulationGroupValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const formulationId = +request.params.formulationId;
                        const productId = +request.params.productId;
                        const userId: number = +request.headers.userId;
                        let data = request.body

                        productFormulationService.updateProductFormulation(formulationId, userId, productId, data, function (error: boolean, code: string, data: any) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'updateProductFormulation', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }


    /**
 * @swagger
 * /products/{productId}/delete-product-formulation/{formulationId}:
 *   delete:
 *     tags:
 *       - ProductsController
 *     summary: Delete formulation group
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product Id
 *       - in: path
 *         name: formulationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Formulation Id
 *       - name: token
 *         in: header
 *         type: string
 *         required: false
 *         description: token
 *     responses:
 *       200:
 *         description: Formulation deleted successfully.
 */



    public deleteProductFormulation(): any {
        return [
            authenticateJWT,
            this.productsValidation.formulationGroupValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const formulationId = +request.params.formulationId;
                        const productId = +request.params.productId;
                        productFormulationService.deleteProductFormulations(formulationId, productId, function (error: boolean, code: string, data: any) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'deleteProductFormulation', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }



    /**
* @swagger
* /products/{productId}/get-product-formulation:
*   get:
*     tags:
*       - ProductsController
*     summary: Get product formulations
*     parameters:
*       - in: path
*         name: productId
*         schema:
*           type: integer
*         required: true
*         description: Product Id
*       - name: token
*         in: header
*         type: string
*         required: false
*         description: token
*     responses:
*       200:
*         description: Formulation fetched successfully.
*/
    public getFormulationForProduct(): any {
        return [
            authenticateJWT,
            this.productsValidation.formulationGroupValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {

                        const productId = +request.params.productId;
                        productFormulationService.getFormulationForProduct(productId, function (error: boolean, code: string, data: any) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'getFormulationForProduct', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }

    /** 
 * @swagger
 * /products/{productId}/product-formulation-log-add/{formulationId}:
 *   post:
 *     tags:
 *       - ProductsController
 *     summary: Add product formulation group log.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: product ID
 *       - in: path
 *         name: formulationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product formulation ID
 *       - in: formData
 *         name: comment
 *         type: string
 *         required: true
 *         description: comment
 *       - in: formData
 *         name: file1
 *         type: file
 *         required: false
 *         description: file1
 *       - in: formData
 *         name: file2
 *         type: file
 *         required: false
 *         description: file2
 *       - in: formData
 *         name: tags
 *         type: array
 *         items:
 *           type: string
 *         example: ["str1", "str2"]
 *         required: false
 *         description: tags
 *       - name: token
 *         in: header
 *         type: string
 *         required: false
 *         description: token
 *     responses:
 *       200:
 *         description: Product formulation Log Added Successfully.
 */

    public addLogForProductFormulation(): any {
        return [
            authenticateJWT,
            this.productsValidation.formulationGroupValidation(),
            async (request: Request, response: Response) => {
                try {

                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const userId: number = +request.headers.userId;
                        productService.checkIfProductExistsToUser(userId, parseInt(request.params.productId)).then((product) => {

                            let formulationDataForLogs = {
                                productId: product.id,
                                formulationId: parseInt(request.params.formulationId),
                                comment: request.body.comment,
                                status: 1
                            }

                            let tags: string[] = request.body && request.body.tags ? request.body.tags.split(",") : [];
                            // Limit number of files
                            const maxFileLimit = parseInt(process.env.MAX_PRODUCT_IMAGES_LIMIT);
                            if (request.files && request.files.length > maxFileLimit) {
                                return apiResponse.ErrorResponse(response, 'PRODUCT0017');
                            } else {
                                productFormulationService.AddProductFormulationLog(formulationDataForLogs, userId, function (error: boolean, formulationLogData: any, code: string) {
                                    if (error) {
                                        return apiResponse.ErrorResponse(response, code);
                                    } else {

                                        if (request.files && request.files.length > 0) {
                                            let subFolderName = randomstring.generate({
                                                length: 6,
                                                charset: 'alphabetic'
                                            });
                                            s3.uploadFileToLocalAndSaveToS3('uploadProductFormulationLogDocs', 'productFormulationLog/files', subFolderName, request, response, ['files'], formulationLogData.id, async function (err: any, docName: any) {
                                                if (err) {
                                                    return apiResponse.ErrorResponse(response, "PRODUCT0010");
                                                } else {
                                                    let files = [];
                                                    docName.forEach(function (name, index) {
                                                        files.push({
                                                            "user_product_formulation_log_id": formulationLogData.id,
                                                            "file": name,
                                                            "status": 1
                                                        });
                                                    });

                                                    productFormulationService.saveDataForFormulationFilesAndTags(formulationLogData.id, files, tags, function (error: boolean, data: any, code: string) {
                                                        if (error) {
                                                            return apiResponse.ErrorResponse(response, code);
                                                        } else {
                                                            return apiResponse.successResponseWithData(response, code, { id: formulationLogData.id });
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            productFormulationService.saveDataForFormulationFilesAndTags(formulationLogData.id, [], tags, function (error: boolean, data: any, code: string) {
                                                if (error) {
                                                    return apiResponse.ErrorResponse(response, code);
                                                } else {
                                                    return apiResponse.successResponseWithData(response, code, { id: formulationLogData.id });
                                                }
                                            });
                                        }
                                    }
                                })
                            }
                        }).catch((err) => {
                            console.log(err);
                            createLog(err, 'addLogForProductFormulation', null, "productsController");
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }
                } catch (err) {
                    createLog(err, 'addLogForProductFormulation', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
* @swagger
* /products/{productId}/{formulationId}/product-formulation-log-details:
*   get:
*     tags:
*       - ProductsController
*     summary: Get product formulation log by product id and product formulation id
*     parameters:
*       - in: path
*         name: productId
*         schema:
*           type: integer
*         required: true
*       - in: path
*         name: formulationId
*         schema:
*           type: integer
*         required: true
*         description: Product formulation id
*       - name: token
*         in: header
*         type: string
*         required: false
*         description: token
*     responses:
*       200:
*         description: Product formulation log details fetched Successfully.
* 
*/

    public getProductFormulationLogDetail(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productService.checkIfProductExistsToUser(user_id, parseInt(request.params.productId)).then((product) => {
                            productFormulationService.getProductFormulationLogDetails(product.id, parseInt(request.params.formulationId), function (error: boolean, data: any, code: string) {
                                if (error) {
                                    return apiResponse.ErrorResponse(response, code);
                                } else {
                                    return apiResponse.successResponseWithData(response, code, data);
                                }
                            })
                        }).catch((err) => {
                            createLog(err, 'getProductFormulationLogDetail', null, "productsController");
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }

                } catch (err) {
                    createLog(err, 'getProductFormulationLogDetail', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
* @swagger
* /products/{productId}/{formulationId}/product-formulation-log-edit/{formulationLogId}:
*   put:
*     tags:
*       - ProductsController
*     summary: update product formulation log
*     parameters:
*       - in: path
*         name: productId
*         schema:
*           type: integer
*         required: true
*         description: product ID
*       - in: path
*         name: formulationId
*         schema:
*           type: integer
*         required: true
*         description: product formulation id
*       - in: path
*         name: formulationLogId
*         schema:
*           type: integer
*         required: true
*         description: product formulation log id
*       - in: formData
*         name: comment
*         type: string
*         required: true
*         description: comment
*       - in: formData
*         name: file1
*         type: file
*         required: false
*         multiple: true
*         description: file1
*       - in: formData
*         name: file2
*         type: file
*         required: false
*         description: file2
*       - in: formData
*         name: tags
*         type: array
*         items:
*           type: string
*         example: ["str1", "str2"]
*         required: false
*         description: tags
*       - in: formData
*         name: fileIds
*         type: array
*         items:
*           type: integer
*         example: [0, 1]
*         required: false
*         description: fileIds
*       - name: token
*         in: header
*         type: string
*         required: false
*         description: token
*     responses:
*       200:
*         description: Product formulation Log Updated Successfully.
*/

    public updateSingleProductFormulationLog(): any {
        return [
            authenticateJWT,
            this.productsValidation.formulationGroupValidation(),
            async (request: Request, response: Response) => {
                try {

                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id: number = +request.headers.userId;
                        productService.checkIfProductExistsToUser(user_id, parseInt(request.params.productId)).then((product) => {
                            let formulationDataForLogs = {
                                productId: product.id,
                                formulationId: parseInt(request.params.formulationId),
                                id: parseInt(request.params.formulationLogId),
                                comment: request.body.comment,
                            }

                            let tags: string[] = request.body && request.body.tags ? request.body.tags.split(",") : [];
                            let fileIds: number[] = request.body && request.body.fileIds ? request.body.fileIds.split(",") : [];
                            // Limit number of files
                            const maxFileLimit = parseInt(process.env.MAX_PRODUCT_IMAGES_LIMIT);
                            if (request.files.length > maxFileLimit) {
                                return apiResponse.ErrorResponse(response, 'PRODUCT0017');
                            } else {
                                productFormulationService.updateProductFormulationLogs(formulationDataForLogs, user_id, function (error: boolean, formulationLogDataObj: any, code: string) {
                                    if (error) {
                                        return apiResponse.ErrorResponse(response, code);
                                    } else {
                                        if (request.files.length > 0) {
                                            let subFolderName = randomstring.generate({
                                                length: 6,
                                                charset: 'alphabetic'
                                            });
                                            s3.uploadFileToLocalAndSaveToS3('uploadProductFormulationLogDocs', 'productFormulationLog/files', subFolderName, request, response, ['files'], formulationDataForLogs.id, async function (err: any, docName: any) {
                                                if (err) {
                                                    return apiResponse.ErrorResponse(response, "PRODUCT0010");
                                                } else {
                                                    let files = [];
                                                    docName.forEach(function (name, index) {
                                                        files.push({
                                                            "user_product_formulation_log_id": formulationDataForLogs.id,
                                                            "file": name,
                                                            "status": 1
                                                        });
                                                    });
                                                    productFormulationService.updateDataForFormulationFilesAndTags(formulationDataForLogs.id, files, tags, fileIds, function (error: boolean, data: any, code: string) {
                                                        if (error) {
                                                            return apiResponse.ErrorResponse(response, code);
                                                        } else {
                                                            return apiResponse.successResponseWithData(response, code, { id: formulationDataForLogs.id });
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            productFormulationService.updateDataForFormulationFilesAndTags(formulationDataForLogs.id, [], tags, fileIds, function (error: boolean, data: any, code: string) {
                                                if (error) {
                                                    return apiResponse.ErrorResponse(response, code);
                                                } else {
                                                    return apiResponse.successResponseWithData(response, code, { id: formulationDataForLogs.id });
                                                }
                                            });
                                        }
                                    }
                                })
                            }
                        }).catch((err) => {
                            createLog(err, 'updateSingleProductFormulationLog', null, "productsController");
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }
                } catch (err) {
                    createLog(err, 'updateSingleProductFormulationLog', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
* @swagger
* /products/{productId}/product-formulation-log-tags:
*   get:
*     tags:
*       - ProductsController
*     summary: Get Unique product formulation Log Tags
*     parameters:
*       - in: path
*         name: productId
*         schema:
*           type: integer
*         required: true
*         description: product Id
*       - name: token
*         in: header
*         type: string
*         required: false
*         description: token
*     responses:
*       200:
*         description: Get product formulation log tags list Successfully.
*/

    public getUniqueFormulationLogTags(): any {
        return [
            authenticateJWT,
            this.productsValidation.productIdValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        productService.checkIfProductExistsToUser(user_id, parseInt(request.params.productId)).then((product) => {
                            productFormulationService.getUniqueFormulationLogTags(function (error: boolean, data: any, code: string) {
                                if (error) {
                                    return apiResponse.ErrorResponse(response, code);
                                } else {
                                    return apiResponse.successResponseWithData(response, code, data);
                                }
                            })
                        }).catch((err) => {
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }

                } catch (err) {
                    createLog(err, 'getUniqueFormulationLogTags', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
    * @swagger
    * /products/add-feedback:
    *   post:
    *     tags:
    *       - ProductsController
    *     description:
    *       Add Feedback
    *     parameters:
    *       - in: body
    *         name: body
    *         schema:
    *           type: object
    *           required:
    *             - productId
    *             - ingredientName
    *             - email
    *             - comment
    *           properties:
    *             productId:
    *               type: string
    *             ingredientName:
    *               type: string
    *             email:
    *               type: string
    *             comment:
    *               type: string
    *         required: true
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Feedback added Successfully.
    */

    public AddFeedbackForProductIngredient(): any {
        return [
            authenticateJWT,
            this.productsValidation.feedbackValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        const email = request.body.email || null;
                        const productId = request.body.productId || null;
                        const ingredientName = request.body.ingredientName || null;
                        const comment = request.body.comment || null;
                        productService.checkIfProductExistsToUser(user_id, parseInt(productId)).then((product) => {
                            productModel.addFeedbackForProductIngredient(email, product, ingredientName, comment, function (error: boolean, data: any, code: string) {
                                if (error) {
                                    return apiResponse.ErrorResponse(response, code);
                                } else {
                                    return apiResponse.successResponseWithData(response, code, data);
                                }
                            })
                        }).catch((err) => {
                            return apiResponse.ErrorResponse(response, "PRODUCT0007");
                        });
                    }
                } catch (err) {
                    createLog(err, 'addFeedbackForProductIngredientLog', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
    * @swagger
    * /products/{productId}/search-replacements-with-tags:
    *   post:
    *     tags:
    *       - ProductsController
    *     summary: Search Product Replacements With Tags
    *     parameters:
    *       - in: path
    *         name: productId
    *         schema:
    *           type: integer
    *         required: true
    *         description: product ID
    *       - name: body
    *         in: body
    *         required: true
    *         description: body
    *         schema:
    *           type: object 
    *           required:
    *             - additivesId
    *           properties:
    *             additivesId:
    *               type: array
    *               items:
    *                 type: integer
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Product Replacements Searched Successfully.
    */

    public productSearchReplacementsWithTags(): any {
        return [
            authenticateJWT,
            this.productsValidation.productSearchReplacements(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const user_id = +request.headers.userId;
                        let additivesId = request.body && request.body.additivesId ? request.body.additivesId : [];
                        replacementGroupsService.SearchProductReplacementsWithTags(user_id, parseInt(request.params.productId), additivesId, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'productSearchReplacements', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }

    /**
  * @swagger
  * /products/{productId}/create-duplicate-replacement-groups:
  *   post:
  *     tags:
  *       - ProductsController
  *     summary: Create duplicate replacement group
  *     parameters:
  *       - in: path
  *         name: productId
  *         required: true
  *         description: product Id
  *       - name: body
  *         in: body
  *         required: true
  *         description: body
  *         schema:
  *           type: object 
  *           required:
  *             - groupIds
  *           properties:
  *             groupIds:
  *               type: array
  *               items:
  *                 type: integer
  *       - name: token  
  *         in: header
  *         type: string
  *         required: false
  *         description: token
  *     responses:
  *       200:
  *         description: Replacement group created successfully..
  */


    public createDuplicateReplacementGroup(): any {
        return [
            authenticateJWT,
            //this.productsValidation.productReplacementGroupValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const productId = +request.params.productId;
                        const groupIds = request.body?.groupIds || [];
                        const userId = +request.headers.userId;
                        replacementGroupsService.createDuplicateReplacementGroup(productId, groupIds, userId, function (error: boolean, code: string, data: any) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'createDuplicateReplacementGroup', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }

    /**
       * @swagger
       * /products/{productId}/create-duplicate-product-formulation:
       *   post:
       *     tags:
       *       - ProductsController
       *     summary: Create new formulation group
       *     parameters:
       *       - in: path
       *         name: productId
       *         schema:
       *           type: integer
       *         required: true
       *         description: product Id
       *       - name: body
    *         in: body
    *         required: true
    *         description: body
    *         schema:
    *           type: object 
    *           required:
    *             - formulationIds
    *           properties:
    *             formulationIds:
    *               type: array
    *               items:
    *                 type: integer
       *       - name: token
       *         in: header
       *         type: string
       *         required: false
       *         description: token
       *     responses:
       *       200:
       *         description: Duplicate formulation group created successfully..
       */



    public createDuplicateFormulation(): any {
        return [
            authenticateJWT,
            //this.productsValidation.addUpdateformulationGroupValidation(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const productId = +request.params.productId;
                        const formulationIds = request.body?.formulationIds || [];
                        let userId: number = +request.headers.userId;
                        productFormulationService.createDuplicateFormulation(productId, formulationIds, userId, function (error: boolean, code: string, data: any) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'createFormulation', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }


    /**
     * @swagger
     * /products/add-sensory-evaluation:
     *   post:
     *     tags:
     *       - ProductsController
     *     description: createUserProductSensoryEvaluationKpi
     *     parameters:
     *       - name: body
     *         description: object
     *         in: body
     *         required: true
     *         schema:
     *           type: object
     *           required:
     *             - sensoryEvaluations
     *           properties:
     *             sensoryEvaluations:
     *               type: array
     *               description: sensory evaluation object
     *               items:
     *                 type: object
     *                 properties:
     *                   key:
     *                     type: string
     *                   value:
     *                     type: string
     *             sensory_evaluation_kpi:
     *               type: string
     *               description: sensory evaluation KPI
     *             user_product_id:
     *               type: number
     *               description: user product ID
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Sensory Evaluation added Successfully.
     *
     */


    public createUserProductSensoryEvaluationKpi(): any {
        return [
            authenticateJWT,
            this.productsValidation.addSensoryEvaluation(),
            async (request: Request, response: Response) => {
                try {

                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {

                        const { sensoryEvaluations } = request.body
                        const created_by = +request.headers.userId
                        const data = sensoryEvaluations.map((val) => {
                            return {
                                ...val, sensory_evaluation_kpi: val.sensory_evaluation_kpi || null,
                                created_by,
                                created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                            }
                        })


                        productKPIModel.createSensoryEvaluation(data,
                            function (error: boolean, data: any, code: string) {
                                if (error) {
                                    return apiResponse.ErrorResponse(response, code);
                                } else {
                                    return apiResponse.successResponseWithData(response, code, data);
                                }
                            })
                    }

                } catch (err) {
                    createLog(err, 'productSensory', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }




    /**
    * @swagger
    * /products/add-product-sensory-trials:
    *   post:
    *     tags:
    *       - ProductsController
    *     description: Create product sensory trials
    *     parameters:
    *       - in: body
    *         name: body
    *         schema:
    *           type: object
    *           required:
    *             - formulationTrials
    *           properties:
    *             formulationTrials:
    *               type: array
    *               items:
    *                 type: object
    *                 properties:
    *                   sensory_evaluation_kpi_value:
    *                     type: string
    *                   user_product_sensory_evaluation_kpi_id:
    *                     type: number
    *                   sensory_evaluation_kpi_user_id:
    *                     type: number
    *                   sensory_evaluation_kpi_user_name:
    *                     type: string
    *                   user_product_formulation_id:
    *                     type: number
    *       - name: token
    *         in: header
    *         type: string
    *         required: false
    *         description: token
    *     responses:
    *       200:
    *         description: Create Formulation Trial Successfully.
    */


    public createUserProductSensoryTrials(): any {
        return [
            authenticateJWT,
            this.productsValidation.addFormulationTrials(),
            async (request: Request, response: Response) => {
                try {

                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {

                        const { formulationTrials } = request.body
                        const created_by = +request.headers.userId
                        const data = formulationTrials.map((val) => {
                            return {
                                ...val,
                                created_by,
                                created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                            }
                        })


                        productKPIModel.createFormulationTrials(data,
                            function (error: boolean, data: any, code: string) {
                                if (error) {
                                    return apiResponse.ErrorResponse(response, code);
                                } else {
                                    return apiResponse.successResponseWithData(response, code, data);
                                }
                            })
                    }

                } catch (err) {
                    createLog(err, 'productFormulationTrials', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }



    /**
     * @swagger
     * /products/edit-product-sensory-trial:
     *   put:
     *     tags:
     *       - ProductsController
     *     description: update product sensory trials
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: body
     *         name: body
     *         schema:
     *           type: object
     *           required:
     *             - formulationTrials
     *           properties:
     *             formulationTrials:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: number
     *                   sensory_evaluation_kpi_value:
     *                     type: string
     *                   user_product_sensory_evaluation_kpi_id:
     *                     type: number
     *                   sensory_evaluation_kpi_user_id:
     *                     type: number
     *                   sensory_evaluation_kpi_user_name:
     *                     type: string
     *                   user_product_formulation_id:
     *                     type: number
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description:  Formulation Trial updated Successfully
     */
    public editUserProductFormulationTrial(): any {
        return [
            authenticateJWT,
            this.productsValidation.editFormulationTrial(),
            async (request: Request, response: Response) => {
                try {
                    // Extract the validation errors from a request.
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {

                        const { formulationTrials } = request.body;

                        productKPIModel.editFormulationTrials(formulationTrials, +request.headers.userId, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    };
                } catch (error) {
                    createLog(error, 'editProductSensoryEvalution', null, "productsController");
                    //throw error in json response with status 500.
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }



    /**
   * @swagger
   * /products/get-sensory-evaluation/{productId}:
   *   get:
   *     tags:
   *       - ProductsController
   *     summary: Get sensory Evaluation By Id
   *     parameters:
   *       - name: token
   *         in: header
   *         type: string
   *         required: false
   *         description: token
   *       - name: productId
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *         description: the productId for which kpis to fetch
   *     responses:
   *       200:
   *         description: Get Sensory api list Successfully.
   * 
   */
    public getUserProductSensoryEvaluationKpi(): any {
        return [
            authenticateJWT,
            // this.productsValidation.addSensoryEvaluation(),
            async (request: Request, response: Response) => {
                try {

                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {

                        const productId: number | null = request.params.productId ? +request.params.productId : null

                        productKPIModel.getSensoryEvaluation(productId, function (error, data, code) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'getSensoryEvavalution', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }


    /**
  * @swagger
  * /products/get-product-sensory-trial/{formulation_id}:
  *   get:
  *     tags:
  *       - ProductsController
  *     summary: Get Formulation Trials
  *     parameters:
  *       - name: token
  *         in: header
  *         type: string
  *         required: false
  *         description: Token
  *       - name: formulation_id
  *         in: path
  *         required: true
  *         schema:
  *           type: integer
  *         description: The formulation_id for which KPIs to fetch
  *     responses:
  *       200:
  *         description: Get Formulation Trials.
  * 
  */

    public getUserProductFormulationTrial(): any {
        return [
            authenticateJWT,
            // this.productsValidation.addSensoryEvaluation(),
            async (request: Request, response: Response) => {
                try {

                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {

                        const formulationId: number | null = request.params.formulation_id ? +request.params.formulation_id : null

                        productKPIModel.getFormulationTrials(formulationId, function (error, data, code) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    }

                } catch (err) {
                    createLog(err, 'getSensoryTrial', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }]
    }


    /**
 * @swagger
 * /products/edit-sensory-evaluation:
 *   put:
 *     tags:
 *       - ProductsController
 *     description: editUserProductSensoryEvaluationKpi
 *     parameters:
 *       - name: body
 *         description: object
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - sensoryEvaluations
 *           properties:
 *             sensoryEvaluations:
 *               type: object
 *               description: sensory evaluation object
 *             sensory_evaluation_kpi:
 *               type: string
 *               description: sensory evaluation KPI
 *             user_product_id:
 *               type: number
 *               description: user product ID
 *       - name: token
 *         in: header
 *         type: string
 *         required: false
 *         description: token
 *     responses:
 *       200:
 *         description: Sensory Evaluation updated Successfully.
 *
 */

    public editUserProductSensoryEvaluationKpi(): any {
        return [
            authenticateJWT,
            this.productsValidation.editSensoryEvaluation(),
            async (request: Request, response: Response) => {
                try {
                    // Extract the validation errors from a request.
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {

                        const { sensroyEvaluationData } = request.body;

                        productKPIModel.editSensoryEvaluation(sensroyEvaluationData, +request.headers.userId, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponseWithData(response, code, data);
                            }
                        })
                    };
                } catch (error) {
                    createLog(error, 'editProductSensoryEvalution', null, "productsController");
                    //throw error in json response with status 500.
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }



    /**
   * @swagger
   * /products/delete-sensory-evaluation:
   *   delete:
   *     tags:
   *       - ProductsController
   *     summary: Delete Sensory Evaluation 
   *     parameters:
   *       - name: body
   *         description: object
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - sensoryIds
   *           properties:
   *             sensoryIds:
   *               type: array
   *               items:
   *                  type: number
   *       - name: token
   *         in: header
   *         type: string
   *         required: false
   *         description: token
   *     responses:
   *       200:
   *         description:  Sensory Evaluation Delete Successfully.
   *
   */


    public deleteSensoryEvaluation(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const ids = request.body.sensoryIds;
                        productKPIModel.deleteUserSensoryEvaluation(ids, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponse(response, code);
                            }
                        })
                    }
                } catch (err: any) {
                    createLog(err, 'deleteTeamMember', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }




    /**
         * @swagger
         * /products/delete-formulation-trials:
         *   delete:
         *     tags:
         *       - ProductsController
         *     summary: Delete  formulation trials
         *     parameters:
         *       - name: body
         *         description: object
         *         in: body
         *         required: true
         *         schema:
         *           type: object
         *           required:
         *             - formulationTrialIds
         *           properties:
         *             formulationTrialIds:
         *               type: array
         *               items:
         *                  type: number
         *       - name: token
         *         in: header
         *         type: string
         *         required: false
         *         description: token
         *     responses:
         *       200:
         *         description:  Delete Formulation Trails Successfully.
         *
         */

    public deleteFormulationTrial(): any {
        return [
            authenticateJWT,
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        const ids = request.body.formulationTrialIds;
                        productKPIModel.deleteFormulationTrial(ids, function (error: boolean, data: any, code: string) {
                            if (error) {
                                return apiResponse.ErrorResponse(response, code);
                            } else {
                                return apiResponse.successResponse(response, code);
                            }
                        })
                    }
                } catch (err: any) {
                    createLog(err, 'deleteFormulationTrial', null, "productsController");
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }


}


export default ProductsController;