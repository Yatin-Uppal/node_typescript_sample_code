import * as cron from "node-cron";
import CronController from "../controllers/cronController";

let cronController = new CronController();

const dailyReportCron = () => {
  //if(process.env.APP_ENV == "prod"){
  cron.schedule("59 59 23 * * *", () => {
    console.log("daily report cron start");
    cronController.emailReportCron();
    console.log("daily report cron complete");
  });
  //}
};


export default { dailyReportCron };
