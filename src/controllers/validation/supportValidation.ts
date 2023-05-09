import { body, check } from "express-validator";
class SupportValidation {
    public addTicket() {
        return [
            body("product_id").isNumeric().trim().withMessage("Product Id Should be numeric."),
            body("description").notEmpty().isString().withMessage("Ticket description must be a non empty field."),
            body("title").notEmpty().isString().withMessage("Title must be a non empty field."),
            // Sanitize fields.
            body("product_id").escape(),
            body("description").escape(),
            body("title").escape(),
        ]
    }
    
    public saveComment() {
        return [
            body("comment").notEmpty().isString().withMessage("Comment must be a non empty string")
        ]
    }
    
    public supportTicketIdValidation() {
        return [
            check('supportTicketId').isNumeric().trim().withMessage("Ticket Id should be numeric.")
        ]
    }
}
export default SupportValidation;