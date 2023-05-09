import * as express from 'express';
import SupportController from '../controllers/supportController';
import * as multer from 'multer';
const upload = multer();
class Support {
    private supportController: SupportController;
    private router: express.Router;
    constructor() {
        this.supportController = new SupportController();
        this.router = express.Router();
    }
    public route(): any {
        this.router.get("/list", this.supportController.listTickets());
        this.router.post("/add-ticket", upload.any(), this.supportController.addTicket());
        this.router.post('/:ticketId/save-comment', this.supportController.saveComment());
        this.router.put("/status/:supportTicketId", this.supportController.updateStatusAsResolved());
        this.router.get("/:supportTicketId", this.supportController.getSupportTicketById());
        
        return this.router;
    }
}
export default Support;