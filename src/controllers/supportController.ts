import { Request, Response } from 'express';
import * as moment from 'moment';
import * as randomstring from 'randomstring';
import { validationResult } from "express-validator";
import SupportValidation from "./validation/supportValidation";
import apiResponse from "../helpers/apiResponse";
import { authenticateJWT } from "../middlewares/jwt";
import supportModel from '../models/supportModel';
import userModel from '../models/userModel';
import s3 from "../helpers/S3";
import * as mailer from "../helpers/mailer";
class SupportController {
    private supportValidation: SupportValidation;
    constructor() {
        this.supportValidation = new SupportValidation();
    }
    /**
     * @swagger
     * /support/list:
     *   get:
     *     tags:
     *       - SupportController
     *     summary: Get Tickets list
     *     parameters:
     *       - name: keyword
     *         in: query
     *         type: string
     *         required: false
     *         description: search ticket by keyword name
     *       - name: page
     *         in: query
     *         type: integer
     *         required: false
     *         description: Get ticket list by page
     *       - name: limit
     *         in: query
     *         type: integer
     *         required: false
     *         description: Get ticket list by limit
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description: Get tickets list Successfully.
     * 
     */
        public listTickets(): any {
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
    
                            supportModel.getTicketsList(user_id, keyword, page, limit, function (error: boolean, data: any, code: string) {
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
     * /support/add-ticket:
     *   post:
     *     tags:
     *       - SupportController
     *     description: 
     *      add Ticket 
     *     consumes:
     *       - multipart/form-data
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: formData
     *         name: document
     *         type: file
     *         required: false
     *       - in: formData
     *         name: product_id
     *         type: string
     *         required: true
     *         description: Product Id
     *       - in: formData
     *         name: title
     *         type: string
     *         required: true
     *         description: title
     *       - in: formData
     *         name: description
     *         type: string
     *         required: true
     *         description: Description
     *       - name: token
     *         in: header
     *         type: string
     *         required: false
     *         description: token
     *     responses:
     *       200:
     *         description:  Ticket submitted Successfully
     * 
     */
     public addTicket(): any {
        return [
            authenticateJWT,
            this.supportValidation.addTicket(),
            async (request: Request, response: Response) => {
                try {
                    // Extract the validation errors from a request.
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        let ticketData = {
                            user_id: +request.headers.userId,
                            user_product_id: +request.body.product_id,
                            description: request.body.description,
                            status : 1,
                            title : request.body.title,
                            createdBy:+request.headers.userId,
                            updatedBy:+request.headers.userId
                        };
                        supportModel.addTicket(ticketData, function (error: boolean, ticketObj: any, code: string) {
                            if (!error) {
                                if(request.files.length){
                                    let subFolderName = randomstring.generate({
                                        length: 6,
                                        charset: 'alphabetic'
                                    });
                                    s3.uploadFileToLocalAndSaveToS3('uploadProductTicketDocs', 'support/tickets/documents', subFolderName, request, response, ['file'], ticketObj.id, async function (err: any, docName: any) {
                                        if (err) {
                                            return apiResponse.ErrorResponse(response, "SUPPORT0005");
                                        } else {
                                            const files = [];
                                            docName.forEach(function (name, index) {
                                                files.push('support/tickets/documents' + name);
                                            });
                                            ticketObj["document_path"] = files[0];
                                            supportModel.saveTicketDocumentData(ticketObj.id, files[0], async function (error: boolean, filesData: any, fileCode: string) {
                                                if (!error) {
                                                    userModel.getUserDetail(+request.headers.userId, function (error, userDetail,code) {
                                                        if (error) {
                                                            return apiResponse.ErrorResponse(response, code);
                                                        } else {
                                                            mailer.send(process.env.EMAIL_ADDRESS, userDetail.email, 'ticket raised status', `Hello User, <br/><br/> Your ticket has been subbmitted Successfully. 
                                                            <br/><br/> We will look into the issue and will back to you shortly.`, (err, result) => {
                                                                if (err) {
                                                                    return apiResponse.validationErrorWithData(response, 'SUPPORT0007',err);
                                                                } else{
                                                                    return apiResponse.successResponseWithData(response, 'Tickets has been raised successfully', ticketObj);
                                                                } 
                                                            });
                                                        }
                                                    })
                                                } else {
                                                    return apiResponse.ErrorResponse(response, "SUPPORT0005");
                                                }
                                            })
                                        }
                                    });
                                } else {
                                    userModel.getUserDetail(+request.headers.userId, function (error, userDetail,code) {
                                        if (error) {
                                            return apiResponse.ErrorResponse(response, code);
                                        } else {
                                            mailer.send(process.env.EMAIL_ADDRESS, userDetail.email, 'ticket raised status', `Hello User, <br/> Your ticket has been subbmitted Successfully. 
                                            <br/> We will look into the issue and will back to you shortly`, (err, result) => {
                                                if (err) {
                                                    return apiResponse.validationErrorWithData(response, 'SUPPORT0007',err);
                                                } else{
                                                    return apiResponse.successResponseWithData(response, code, ticketObj);
                                                } 
                                            });
                                        }
                                    })
                                }
                            
                            }else {
                                return apiResponse.ErrorResponse(response, "SUPPORT0003");
                            }
                        });
                    }
                } catch (error) {
                    //throw error in json response with status 500.
                    return apiResponse.ErrorResponse(response, "GEN0004");
                }
            }
        ]
    }
    /**
       * @swagger
       * /support/{ticketId}/save-comment:
       *   post:
       *     tags:
       *       - SupportController
       *     summary: Save Comment
       *     parameters:
       *       - in: path
       *         name: ticketId
       *         schema:
       *           type: integer
       *         required: true
       *         description: ticket ID
       *       - in: body
       *         name: comment
       *         schema:
       *           type: object
       *           required:
       *             - comment
       *           properties:
       *             comment:
       *               type: string
       *               description: support comment
       *       - name: token
       *         in: header
       *         type: string
       *         required: false
       *         description: token
       *     responses:
       *       200:
       *         description: Support comment saved Successfully.
       */
     public saveComment(): any {
        return [
            authenticateJWT,
            this.supportValidation.saveComment(),
            async (request: Request, response: Response) => {
                try {
                    const errors = validationResult(request);
                    if (!errors.isEmpty()) {
                        // Display sanitized values/errors messages.
                        return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                    } else {
                        let ticketData = {
                            support_ticket_id: +request.params.ticketId,
                            comment: request.body.comment,
                            user_id: +request.headers.userId,
                            created_by: +request.headers.userId,
                        };
                            supportModel.saveComment(ticketData, function (error: boolean, data: any, code: string) {
                                if (error) {
                                    return apiResponse.ErrorResponse(response, "SUPPORT0010");
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
    * /support/status/{supportTicketId}:
    *   put:
    *     tags:
    *       - SupportController
    *     summary: Mark ticket status as resolved
    *     parameters:
    *       - in: path
    *         name: supportTicketId
    *         type: integer
    *         required: true
    *       - name: token
    *         in: header
    *         type: string
    *         required: true
    *     responses:
    *       200:
    *         description: Update ticket status as resolved successfully.
    * 
    */
        public updateStatusAsResolved(): any {
            return [
                authenticateJWT,
                this.supportValidation.supportTicketIdValidation(),
                async (request: Request, response: Response) => {
                    try {
                        const errors = validationResult(request);
                        if (!errors.isEmpty()) {
                            // Display sanitized values/errors messages.
                            return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                        } else {
                            supportModel.updateStatusAsResolved(parseInt(request.params.supportTicketId), function (error: boolean, code: string) {
                                if (!error) {
                                    return apiResponse.successResponse(response, code);
                                }
                                return apiResponse.ErrorResponse(response, code);
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
    * /support/{supportTicketId}:
    *   get:
    *     tags:
    *       - SupportController
    *     summary: Get a ticket detail by ticket ID
    *     parameters:
    *       - in: path
    *         name: supportTicketId
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
    *         description: Get ticket detail Successfully.
    * 
    */

        public getSupportTicketById(): any {
            return [
                authenticateJWT,
                this.supportValidation.supportTicketIdValidation(),
                async (request: Request, response: Response) => {
                    try {
                        const errors = validationResult(request);
                        if (!errors.isEmpty()) {
                            // Display sanitized values/errors messages.
                            return apiResponse.validationErrorWithData(response, "GEN0003", errors.array());
                        } else {
                            supportModel.getSupportTicketById(parseInt(request.params.supportTicketId), function (error: boolean, data: any, code: string) {
                                if (!error) {
                                    return apiResponse.successResponseWithData(response, code, data);
                                }
                                return apiResponse.ErrorResponse(response, code);
                            })
                        }
                    } catch (err) {
                        return apiResponse.ErrorResponse(response, "GEN0004");
                    }
                }
            ]
        }
}
export default SupportController;