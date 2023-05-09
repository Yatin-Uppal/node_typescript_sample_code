import { body, check } from "express-validator";

class AddProduct {
    public addProduct() {
        return [
            body("product_name").isLength({ min: 1, max: 50 }).trim().withMessage("Product name cannot be empty."),
            body("product_category_id").isNumeric().withMessage("Invalid Product Category."),
            body("food_category_id").isNumeric().withMessage("Invalid Food Category."),
            body("product_description").isLength({ max: 5000 }).trim().withMessage("Product description cannot be of more than 5000 chars."),


            // Sanitize fields.
            body("product_name").escape(),
            body("product_category_id").escape(),
            body("food_category_id").escape(),
            body("product_description").escape(),
        ]
    }
    public addProductTeamMember() {
        return [
            body("user_product_id").isNumeric().withMessage("Invalid Product."),
            body("teamMembers").isArray().notEmpty().withMessage('Please add team members'),

            // Sanitize fields.
            body("user_product_id").escape(),
        ]
    }
    public addProductKPI() {
        return [
            body("kpi").isArray().notEmpty().withMessage('Please add kpis'),
            body("user_product_id").isNumeric().withMessage("Invalid Product."),
            // Sanitize fields.
            body("user_product_id").escape(),
        ]
    }
    public editProductTeamMember() {
        return [
            body("teamMembers").isArray().notEmpty().withMessage('Please add team members'),
        ]
    }
    public editProductKPI() {
        return [
            body("id").isNumeric().withMessage("Invalid KPI id."),
            body("user_product_id").isNumeric().withMessage("Invalid Product."),
            body("user_product_kpi_lookup_id").isNumeric().withMessage("Invalid KPI lookup id."),
            body("kpi_level").isNumeric().withMessage("Invalid KPI level."),
            body("kpi_value").isString().withMessage("kpi value must be a non-empty string."),
            // Sanitize fields.
            body("id").escape(),
            body("user_product_id").escape(),
            body("user_product_kpi_lookup_id").escape(),
            body("kpi_level").escape(),
            body("kpi_value").escape(),
        ]
    }

    public deleteProductImages() {
        return [
            body("product_id").isNumeric().withMessage("Product id must be integer."),
            body("image_ids").isArray().notEmpty().isNumeric()
                .withMessage("Image ids must be a non empty array of integers."),

            // Sanitize fields.
            body("product_id").escape(),
        ]
    }

    public updateDefaultImage() {
        return [
            body("image_id").notEmpty().isNumeric().withMessage("Image ids must be a non empty array of integers."),
            //Sanitize Fields
            body("image_id").escape(),
        ]
    }

    public productIdValidation() {
        return [
            check('productId').isNumeric().trim().withMessage("Product Id Should be numeric.")
        ]
    }

    public addProductAdditives() {
        return [
            body("addIngredient").notEmpty().isString().withMessage("Add Ingredient must be a non empty string"),
            body("ingredients.*").isArray().notEmpty().isString().withMessage("Ingredients must be a non empty array of strings.")
        ]
    }
    public updateProductAdditive() {
        return [
            check('productId').isNumeric().trim().withMessage("Product Id Should be numeric."),
            check('productAdditiveId').isNumeric().trim().withMessage("Product Additive Id Should be numeric."),
            body("additive_name").notEmpty().isString().withMessage("Additive Name must be a non empty string"),
        ]
    }
    public addShareProduct() {
        return [
            check('productId').isNumeric().trim().withMessage("Product Id Should be numeric."),
            body("[]").isArray().notEmpty().withMessage("body must be a non empty array of strings.").isEmail().withMessage("body must have a valid email address."),
        ]
    }
    public productSearchReplacements() {
        return [
            body("additivesId").isArray().notEmpty().isNumeric().withMessage("AdditivesId must be a non empty array of integers."),
        ]
    }
    public addProductReplacementToListValidation() {
        return [
            check('productId').isNumeric().trim().withMessage("Product Id Should be numeric."),
            check('additivePlantReplacementId').isNumeric().trim().withMessage("Additive Plant ReplacementId Id Should be numeric.")
        ]
    }

    public productReplacementIdValidation() {
        return [
            check('productReplacementId').isNumeric().trim().withMessage("Product Replacement Id Should be numeric.")
        ]
    }
    public addLogForSingleReplacementValidation() {
        return [
            check('productId').isNumeric().trim().withMessage("Product Id Should be numeric."),
            check('productAdditiveReplacementId').isNumeric().trim().withMessage("Product Additive ReplacementId Id Should be numeric."),
            body("comment").notEmpty().isString().withMessage("Comment must be a non empty string"),
            body("tags.*").optional().isArray().isString().withMessage("tags must be an array of strings.")
        ]
    }
    public addLogForSingleReplacementGroupValidation() {
        return [
            check('productId').isNumeric().trim().withMessage("Product Id Should be numeric."),
            check('productReplacementGroupId').isNumeric().trim().withMessage("Product replacement group Id should be numeric."),
            body("comment").notEmpty().isString().withMessage("Comment must be a non empty string"),
            body("tags.*").optional().isArray().isString().withMessage("Tags must be an array of strings.")
        ]
    }


    public saveComment() {
        return [
            body("comment").notEmpty().isString().withMessage("Comment must be a non empty string")
        ]
    }
    public plantAdditiveReplacementValidation() {
        return [
            check('groupId').isNumeric().trim().notEmpty().withMessage("Group Id Should be numeric and can not be null."),
            check('productId').optional().isNumeric().trim().withMessage("Product Id Should be numeric and can not be null."),
        ]
    }

    public formulationGroupValidation() {
        return [
            check('formulationId').optional().isNumeric().trim().notEmpty().withMessage("Formulation Should be numeric and can not be null."),
            check('productId').isNumeric().trim().withMessage("Product Id Should be numeric and can not be null."),
        ]
    }

    public addUpdateformulationGroupValidation() {
        return [
            check('formulationId').optional().isNumeric().trim().notEmpty().withMessage("Formulation Should be numeric and can not be null."),
            check('productId').isNumeric().trim().withMessage("Product Id Should be numeric and can not be null."),
            body("comment").isLength({ min: 100 }).trim().withMessage("Formulation comment should be minimum of 100 characters."),

        ]
    }

    public productReplacementGroupValidation() {
        return [
            body("comment").isLength({ min: 100 }).trim().withMessage("Group comment should be minimum of 100 characters."),

        ]
    }

    public feedbackValidation() {
        return [
            body('productId').isNumeric().trim().withMessage("Product Id Should be numeric and can not be null."),
            body('ingredientName').isString().trim().withMessage("Ingredient Name Should be string and can not be null."),
            body('email').isString().isEmail().trim().withMessage("Email Should be string and can not be null."),
            body("comment").notEmpty().isString().withMessage("Comment must be a non empty string")
        ]
    }
    public addSensoryEvaluation() {
        return [
            body("sensoryEvaluations").isArray().notEmpty().withMessage('Please add sensory evaluations.')
        ]
    }

    public addFormulationTrials() {
        return [
            body("formulationTrials").isArray().notEmpty().withMessage('Please add formulation trials.')
        ]
    }

    public editSensoryEvaluation() {
        return [
            body("sensroyEvaluationData").isArray().notEmpty().withMessage('Please add sensory evaluations')
        ]
    }

    public editFormulationTrial() {
        return [
            body("formulationTrials").isArray().notEmpty().withMessage('Please add sensory evaluations')
        ]
    }

}



export default AddProduct;