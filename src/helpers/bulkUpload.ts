import * as xlsx from 'xlsx';
import * as moment from 'moment';
import * as randomstring from 'randomstring';
import * as _ from 'lodash';
import plantsModel from "../models/plantsModel";

class BulkUpload {

    constructor(){
       
    }

    public readBulkFile(uploadedFile) {
        //convert array data into json
        var headers = [];
        var sheet = uploadedFile;

        if (sheet['!ref']) {

            var range = xlsx.utils.decode_range(sheet['!ref']);

            var C, R = range.s.r;
            /* start in the first row */
            /* walk every column in the range */
            const configDateFields = ['End Time', 'Start Time', 'Listing Start Date', 'Listing End Date', 'Service Transfer Date', 'Redemption Expired Date', 'Redeemed Date', 'Postponed Date', 'Conveyed To HUD Date', 'DDLPI', 'Last Sold', 'Unavailable Date', 'Auction Date', 'File Received', 'Foreclosure Atty Referral', 'Judgement Entered', 'First Legal Action Completed', 'Valuation Date', 'Foreclosure Sale Held Date', 'Foreclosure Resume Date', 'Attorney Referral date']

            for (C = range.s.c; C <= range.e.c; ++C) {
                var cell = sheet[xlsx.utils.encode_cell({
                    c: C,
                    r: R
                })];
                /* find the cell in the first row */

                var hdr = C; // replaced header with coulumn name
                if (cell && cell.t) {
                    hdr = xlsx.utils.format_cell(cell);
                }
                headers.push(hdr);
            }
            // For each sheets, convert to json.
            var data = xlsx.utils.sheet_to_json(uploadedFile);
            if (data.length > 0) {
                data.forEach(function (row) {
                    // Set empty cell to blank string ' '.
                    headers.forEach(function (hd) {
                        if (configDateFields.includes(hd) && row[hd]) {
                            // Handle Day Light Saving Time Dilation By UTC Time Standard
                            var date = new Date(row[hd]);
                            if (date instanceof Date && !isNaN(date.valueOf())) { // Check If Date is Valid
                                let isoDate = new Date(row[hd]).toISOString();
                                if (moment(isoDate).isDST()) { // Check if Date is Under Day Light Saving Time
                                    let haltTime = moment(isoDate).utcOffset();
                                    row[hd] = moment(isoDate).utcOffset(-1 * (haltTime)).format('MM/DD/YYYY');
                                }
                            }
                        }
                        if (row[hd] === undefined) {
                            row[hd] = null;
                        }
                    });
                });
            }
            return data;
        }
    }

    public readBulkFileColName(uploadedFile) {
        //convert array data into json
        var headers = [];
        var sheet = uploadedFile;
        var range = xlsx.utils.decode_range(sheet['!ref']);
        var C, R = range.s.r;
        /* start in the first row */
        /* walk every column in the range */
        
        for (C = range.s.c; C <= range.e.c; ++C) {
            var cell = sheet[xlsx.utils.encode_cell({
                c: C,
                r: R
            })];
            /* find the cell in the first row */

            var hdr = C; // replaced header with coulumn name
            if (cell && cell.t) {
                hdr = xlsx.utils.format_cell(cell);
            }
            headers.push(hdr);
        }
        
        return headers;
    }

    public bulkDuplicate(bulkData, uploadType, callback) {
        var commonNameArray = [];
        var matchedCommonName = [];
        let errorFields : { [key: string]: any } = {};
        let fields: { [key: string]: any } = {};
        var combinationCheck :{ [key: string]: any } = {};
        var commonCombinationCheckArray = [];
        // var isDataValidType :{ [key: string]: any } = {};
        // let isNumeric = str => parseFloat(str) === parseFloat(str)

        bulkData.forEach(function (obj, index) {

            let newObj = Object.entries(obj)
            .map((obj) => [obj[0].trim(), obj[1]])
            .reduce((accum, [k, v]) => {
                accum[k as string] = v;
                return accum;
            }, {});
         
            if (uploadType == 'plant') {
                if (!(commonNameArray.indexOf(newObj["Common Name"]) == -1)) {
                    (newObj["Common Name"]) ? matchedCommonName.push(newObj["Common Name"]) : null;
                    errorFields[index + 1] = { name: "Common Name already exists" }
                    fields[index + 1] = ["name"]
                }
                commonNameArray.push(newObj["Common Name"]);
            } 

            if (uploadType == 'additive') {
                if ((commonCombinationCheckArray.includes(JSON.stringify([newObj['Additive Name'], newObj['Functionality'], newObj['Product Category'], newObj['Food Category']])))) {
                    let msg = "Combination of Additive Name, Functionality, Product Category & Food Category already exist."
                    combinationCheck[index + 1] = {
                        "name": msg,
                        "foodCategory": msg,
                        "productCategory": msg,
                        "functionality": msg,
                    }
                }
                commonCombinationCheckArray.push(JSON.stringify([newObj['Additive Name'], newObj['Functionality'], newObj['Product Category'], newObj['Food Category']]))
            }
        });

        commonNameArray = undefined;
        commonCombinationCheckArray = undefined;
   
        matchedCommonName = _.uniq(matchedCommonName);

        if (matchedCommonName.length && uploadType == 'plant') {
            return callback(true, {
                'matchedCommonName': matchedCommonName,
                'errorFields': errorFields,
                'fields' : fields,
            });
        }  

        if (Object.keys(combinationCheck).length && uploadType == 'additive') {
            return callback(true, {
                'combinationCheck': combinationCheck,
                'errorFields': errorFields ? errorFields : null,
                'fields': fields ? fields : null,
            });
        } else {
            return callback(false, null, null);
        }
    }

    public bulkDuplicateJson(bulkData, uploadType, callback) {
        var commonNameArray = [];
        var matchedCommonName : { [key: string]: any } = {};
        let errorFields : { [key: string]: any } = {};
        let fields: { [key: string]: any } = {};
        var combinationCheck :{ [key: string]: any } = {};
        var commonCombinationCheckArray = []
        var isDataValidType :{ [key: string]: any } = {};

        for (let index in bulkData) {

            if (uploadType == 'plant') {
                if (!(commonNameArray.indexOf(bulkData[index].name) == -1)) {
                    (bulkData[index].name.toString().toLowerCase()) ? matchedCommonName[index] = bulkData[index].name.toString().toLowerCase() : null;
                    errorFields[index] = { name: "Common Name already exists" }
                    fields[index] = ["name"]
                }

                commonNameArray.push(bulkData[index].name);

            }
          
            if (uploadType == 'additive') {
                if ((commonCombinationCheckArray.includes(JSON.stringify([bulkData[index].name, bulkData[index].foodCategory, bulkData[index].productCategory, bulkData[index].functionality])))) {
                    let msg = "Combination of Additive Name, Functionality, Product Category & Food Category already exist."
                    combinationCheck[index] = {
                        "name": msg,
                        "foodCategory": msg,
                        "productCategory": msg,
                        "functionality": msg,
                    }
                }

                if (bulkData[index].name && bulkData[index].foodCategory && bulkData[index].productCategory && bulkData[index].functionality) {
                    commonCombinationCheckArray.push(JSON.stringify([bulkData[index].name, bulkData[index].foodCategory, bulkData[index].productCategory, bulkData[index].functionality]))
                }
            }

        }

        commonNameArray = undefined;
       // matchedCommonName = _.uniq(matchedCommonName);


        if (Object.keys(matchedCommonName).length > 0) {
            return callback(true, {
                'matchedCommonName': matchedCommonName,
                'errorFields': errorFields,
                'fields': fields
            }, bulkData);
        }

        if (Object.keys(combinationCheck).length > 0 ) {
           return callback(true, {
                'combinationCheck': combinationCheck ? combinationCheck : null ,
                'errorFields': errorFields ? errorFields : null,
                'fields': fields ? fields : null,
                //'isDataValidType': isDataValidType
            }, bulkData);
        }

        else {
           return callback(false, null, null);
        }
    }

    public processCsvPlantData(data) {
        var plantList: {[key: string]: any} = {};
        let missingFields = [];

        // console.log(JSON.stringify(data));
        data.forEach(function(obj, index) {
            //console.log(JSON.stringify(obj, undefined, 2));
            
            var plantDetail: {[key: string]: any} = {};

            plantList[Number(index)+1] = plantDetail; // Assigning the key for objects.

            let newObj = Object.entries(obj)
                .map((obj) => [obj[0].trim(), obj[1]])
                .reduce((accum, [k, v]) => {
                    accum[k as string] = v;
                    return accum;
                }, {});   

            /* propertyDetail Object*/
            plantDetail.name = (newObj['Common Name'] && newObj['Common Name'] !== null) ? newObj['Common Name'] : missingFields.push('Common Name');
            plantDetail.scientific_name = (newObj['Scientific Name'] || newObj['Scientific Name'] !== null) ? newObj['Scientific Name'] : null;
            plantDetail.family = (newObj['Family'] && newObj['Family'] !== null) ? newObj['Family'] : null;
            plantDetail.remarks = (newObj['Remarks'] && newObj['Remarks'] !== null) ? newObj['Remarks'] : null;
            plantDetail.comment = (newObj['Comment'] && newObj['Comment'] !== null) ? newObj['Comment'] : null;
            plantDetail.edible_parts = (newObj['Edible Parts'] && newObj['Edible Parts'] !== null) ? newObj['Edible Parts'] : null;
            plantDetail.edible_use = (newObj['Edible Uses'] && newObj['Edible Uses'] !== null) ? newObj['Edible Uses'] : null;
            plantDetail.source_database = (newObj['Source'] && newObj['Source'] !== null) ? newObj['Source'] : null;

        });
        missingFields = _.uniq(missingFields);
        return {plantList,missingFields};
    }

    public plantValidation(bulkDataList){
        let data: {[key:string]: any} = {};
        let fields: {[key:string]: any} = {};

        for(let index in bulkDataList) {
            
            let validationObj: {[key:string]: any} = {}
            let fieldSet = [];
            
            if(bulkDataList[index].name == null || bulkDataList[index].name == ""){
                validationObj.name = "Common Name should not empty.";
                fieldSet.push('name');
            }
            
            if(Object.keys(validationObj).length){
                data[index] = validationObj;
                fields[index] = fieldSet;
            }
        };


        return {data,fields}

    }
    

    public additivesValidation(bulkDataList){
        let data: {[key:string]: any} = {};
        let fields: {[key:string]: any} = {};

        
        for(let index in bulkDataList) {
            
            let validationObj: {[key:string]: any} = {}
            let fieldSet = [];
             
            if(bulkDataList[index].name == null || bulkDataList[index].name == null || bulkDataList[index].name == ""){
                validationObj.name = "Additive Name should not empty.";
                fieldSet.push('name');
            }
            if(bulkDataList[index].functionality == null || bulkDataList[index].functionality == null || bulkDataList[index].functionality == ""){
                validationObj.functionality = "Functionality should not empty.";
                fieldSet.push('functionality');
            }
            if(bulkDataList[index].productCategory ==  null || bulkDataList[index].productCategory == null || bulkDataList[index].productCategory == ""){
                validationObj.productCategory = "Product Category should not empty.";
                fieldSet.push('productCategory');
            }
            if(bulkDataList[index].foodCategory == null || bulkDataList[index].foodCategory == null || bulkDataList[index].foodCategory == ""){
                validationObj.foodCategory = "Food Category should not empty.";
                fieldSet.push('foodCategory');
            }


            if(Object.keys(validationObj).length){
                data[index] = validationObj;
                fields[index] = fieldSet;
            }
        };
        return {data,fields}
    }

    public processCsvAdditiveData(data) {
        var additiveList: {[key: string]: any} = {};
        let missingFields = [];

        // console.log(JSON.stringify(data));
        data.forEach(function(obj, index) {
            //console.log(JSON.stringify(obj, undefined, 2));
            
            var additiveDetail: {[key: string]: any} = {};

            additiveList[Number(index)+1] = additiveDetail; // Assigning the key for objects.
 
            let newObj = Object.entries(obj)
                .map((obj) => [obj[0].trim(), obj[1]])
                .reduce((accum, [k, v]) => {
                    accum[k as string] = v;
                    return accum;
                }, {});
             
            additiveDetail.name = (newObj['Additive Name'] && newObj['Additive Name'] !== null) ? newObj['Additive Name'] : missingFields.push('Additive Name');
            additiveDetail.functionality = (newObj['Functionality'] && newObj['Functionality'] !== null) ? newObj['Functionality'] : missingFields.push('Functionality');
            additiveDetail.productCategory = (newObj['Product Category'] && newObj['Product Category'] !== null) ? newObj['Product Category'] : missingFields.push('Product Category');
            additiveDetail.foodCategory = (newObj['Food Category'] && newObj['Food Category'] !== null) ? newObj['Food Category'] : missingFields.push('Food Category');
            additiveDetail.maxLevel = (newObj['Max Level'] && newObj['Max Level'] !== null) ? newObj['Max Level'] : null;
            additiveDetail.eNumber = (newObj['E Number'] && newObj['E Number'] !== null) ? newObj['E Number'] : null;
            additiveDetail.remarks = (newObj['Remarks'] && newObj['Remarks'] !== null) ? newObj['Remarks'] : null;
            additiveDetail.comments = (newObj['Comment'] && newObj['Comment'] !== null) ? newObj['Comment'] : null;

        });
        missingFields = _.uniq(missingFields);
        console.log(missingFields,'missingFields')
        return {additiveList,missingFields};
    }

}

export default new BulkUpload();
