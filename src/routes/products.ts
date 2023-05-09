import * as express from 'express';
import ProductsController from '../controllers/productsController';
import * as multer from 'multer';
const upload = multer();
class Products {
    private productsController: ProductsController;
    private router: express.Router;


    constructor() {
        this.productsController = new ProductsController();
        this.router = express.Router();
    }
    public route(): any {
        this.router.get("/categories/list", this.productsController.productsCategoriesList());
        this.router.get("/food-categories/list", this.productsController.foodCategoriesList());
        this.router.post("/add", upload.any(), this.productsController.addProduct());
        this.router.get("/list", this.productsController.listProducts());
        this.router.get("/team-members", this.productsController.productTeamMemberList());
        this.router.get("/kpi/:product_id", this.productsController.productKPIList());
        this.router.get("/kpi-listing/", this.productsController.productKPIListing());
        this.router.post("/add-team-members", this.productsController.addTeamMembersToProduct());
        this.router.post("/add-product-sensory-trials", this.productsController.createUserProductSensoryTrials());
        this.router.put("/edit-product-sensory-trial", this.productsController.editUserProductFormulationTrial());
        this.router.delete("/delete-formulation-trials", this.productsController.deleteFormulationTrial());
        this.router.get("/get-product-sensory-trial/:formulation_id", this.productsController.getUserProductFormulationTrial());
        // this.router.delete("/delete-team-member", this.productsController.deleteProductTeamMember());
        this.router.post("/add-product-kpi", this.productsController.addProductKPI());
        this.router.put("/edit-product-kpi", this.productsController.editProductKPIByID());
        this.router.put("/edit-team-member", this.productsController.editProductTeamMember());
        this.router.delete("/delete-team-member", this.productsController.deleteProductTeamMember());
        this.router.get("/team-member-roles", this.productsController.productTeamMemberRolesList());
        this.router.delete("/delete/:productId", this.productsController.deleteProduct());
        this.router.put("/edit/:productId", this.productsController.editProduct());
        this.router.post("/add-image/:productId", upload.any(), this.productsController.addImageProduct());
        this.router.delete("/product-images", this.productsController.deleteImageProduct());
        this.router.get("/detail/:productId", this.productsController.productDetail());
        this.router.put("/update-default-image/:productId", this.productsController.updateDefaultImage());
        this.router.put("/status/:productId", this.productsController.updateStatusForCompleteProduct());
        this.router.post('/:productId/add-bulk-product-additives', upload.any(), this.productsController.searchBulkAddProductAdditives());
        this.router.put('/:productId/edit-product-additive/:productAdditiveId', this.productsController.updateProductAdditive());
        this.router.delete('/:productId/delete-product-additive/:productAdditiveId', this.productsController.deleteProductAdditive());
        this.router.post('/:productId/share-product/:encryptedProductId', this.productsController.addShareProduct());
        this.router.get('/shared-products/list', this.productsController.listShareProducts());
        this.router.get('/:productId/share-products/already-shared-list', this.productsController.listEmailsProductAlreadyShareWith());
        this.router.post('/:productId/share-products/revoke-email/:userId', this.productsController.RevokeEmailProductAlreadyShareWith());
        this.router.post('/:productId/search-replacements', this.productsController.productSearchReplacements());
        this.router.get("/popular-products/list", this.productsController.listPopularProducts());
        this.router.post("/:productId/add-replacement/:additivePlantReplacementId", this.productsController.addProductReplacementToList());
        this.router.delete("/:productId/delete-replacement/:productReplacementId", this.productsController.deleteProductReplacement());
        this.router.post("/:productId/replacement-log-add/:productAdditiveReplacementId", upload.any(), this.productsController.addLogForSingleReplacement());
        this.router.get("/:productId/:productAdditiveReplacementId/replacement-log-details/:productReplacementLogId", this.productsController.getProductReplacementLogDetail());
        this.router.put("/:productId/:productAdditiveReplacementId/replacement-log-edit/:productReplacementLogId", upload.any(), this.productsController.updateSingleProductReplacementLog());
        this.router.get("/:productId/replacement-details/:additivePlantReplacementId", this.productsController.getProductRelacementDetail());
        this.router.post('/:productId/save-comment', this.productsController.saveComment());
        this.router.get('/:productId/replacement-log-tags', this.productsController.getUniqueReplacementLogTags());
        this.router.post("/:productId/create-replacement-group", this.productsController.createReplacementGroup());
        this.router.put("/:productId/:groupId/update-replacement-group", this.productsController.updateReplacementGroup());
        this.router.delete("/:productId/delete-replacement-group/:groupId", this.productsController.deletePlantAdditiveReplacementGroup());
        this.router.get('/:productId/get-replacement-groups', this.productsController.getReplacementGroupsForProduct());
        this.router.post("/:productId/replacement-group-log-add/:productReplacementGroupId", upload.any(), this.productsController.addLogForGroupReplacement());
        this.router.put("/:productId/:productReplacementGroupId/replacement-group-log-edit/:productReplacementLogId", upload.any(), this.productsController.updateSingleProductReplacementGroupLog());
        this.router.get("/:productId/:productReplacementGroupId/replacement-group-log-details", this.productsController.getProductReplacementGroupLogDetail());
        this.router.post("/:productId/search-plant-replacement-suggestion", this.productsController.searchPlantsReplacementSuggestions());
        this.router.post("/:productId/create-product-formulation", this.productsController.createFormulation());
        this.router.put("/:productId/:formulationId/update-product-formulation", this.productsController.updateProductFormulation());
        this.router.delete("/:productId/delete-product-formulation/:formulationId", this.productsController.deleteProductFormulation());
        this.router.get('/:productId/get-product-formulation', this.productsController.getFormulationForProduct());
        this.router.post("/:productId/product-formulation-log-add/:formulationId", upload.any(), this.productsController.addLogForProductFormulation());
        this.router.get('/:productId/:formulationId/product-formulation-log-details', this.productsController.getProductFormulationLogDetail());
        this.router.get('/get-product-formulation-by-id/:id', this.productsController.productFormulationByFormulationId());
        this.router.put("/:productId/:formulationId/product-formulation-log-edit/:formulationLogId", upload.any(), this.productsController.updateSingleProductFormulationLog());
        this.router.get('/:productId/replacement-group-log-tags', this.productsController.getUniqueReplacementGroupLogTags());
        this.router.get('/:productId/product-formulation-log-tags', this.productsController.getUniqueFormulationLogTags());
        this.router.post('/add-feedback', this.productsController.AddFeedbackForProductIngredient());
        this.router.post('/:productId/search-replacements-with-tags', this.productsController.productSearchReplacementsWithTags());
        this.router.post("/:productId/create-duplicate-replacement-groups", this.productsController.createDuplicateReplacementGroup());
        this.router.post("/:productId/create-duplicate-product-formulation", this.productsController.createDuplicateFormulation());
        this.router.post("/add-sensory-evaluation", this.productsController.createUserProductSensoryEvaluationKpi());
        this.router.get("/get-sensory-evaluation/:productId", this.productsController.getUserProductSensoryEvaluationKpi());
        this.router.put("/edit-sensory-evaluation", this.productsController.editUserProductSensoryEvaluationKpi());
        this.router.delete("/delete-sensory-evaluation", this.productsController.deleteSensoryEvaluation());



        return this.router;
    }
}

export default Products;
