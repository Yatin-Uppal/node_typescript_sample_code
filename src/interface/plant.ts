import { int } from "aws-sdk/clients/datapipeline"

interface AddFunctionalities {
    plantId: number | any,
    plantPartId: number | any,
    functionalityId: number | any,
    sourceId: number,
    explanation?: string,
    bioActiveCompounds?: string,
    comment?: string,
    edibleParts?: string,
    sourceLink?: string,
    createdBy: number | any
}

interface PlantProductCat {
    plantId: number | string,
    productCategoryId: number | string,
    status: number,
    createdBy: number | any
}


interface PlantFoodCat {
    plantId: number | string,
    foodCategoryId: number | string,
    status: number,
    createdBy: number | any
}

interface addPlantExtraction {
    plantId: number | string,
    plantPartId: number | string,
    formId: number | string,
    plantSubPartId: number | string,
    preparation: number | string,
    status: number,
    createdBy: number | any
}

interface updatePlantExtraction {
    plantPartId?: number | string,
    formId?: number | string,
    plantSubPartId?: number | string,
    preparation?: number | string,
    status?: number,
    updatedBy: number | any
}
interface UpdateFunctionalities {
    plantFunctionalitiesId: number | any,
    plantId?: number | any,
    plantPartId?: number | any,
    functionalityId?: number | any,
    explanation?: string,
    bioActiveCompounds?: string,
    comment?: string,
    edibleParts?: string,
    sourceId?: number,
    sourceLink?: string,
    updatedBy: number | any
}

interface AddPlant {
    commonName: string,
    scientificName: string,
    foodCategoryId: number,
    species: string,
    genus: string,
    family: string,
    edibleRating: string,
    remarks: string,
    edibleParts: string,
    sourceId: number | any,
    status: number,
    createdBy: number | any,
}

interface UpdatePlant {
    plantId: number,
    commonName: string | unknown,
    scientificName?: string | unknown,
    family?: string | unknown,
    edibleUse?: string | unknown,
    remarks?: string | unknown,
    edibleParts?: string | unknown,
    comment?: string | unknown,
    updatedBy: number | any,
}

interface PlantMapWithFoodCat {
    plantId: number,
    foodCategoryId: number,
    createdBy: number | any,
}

interface addLabSample {
    sampleNo: string,
    plantId: number | string,
    plantPartId: number | string,
    formId: number | string,
    plantSubPartId: number | string,
    preparation: number | string,
    supplierId: number | string,
    status: number,
    createdBy: number | any
}

interface updateLabSample {
    sampleNo: string,
    //plantId: number | string,
    plantPartId: number | string,
    formId: number | string,
    plantSubPartId: number | string,
    preparation: number | string,
    supplierId: number | string,
    //status: number,
    updatedBy: number | any
}

interface addLabSampleValidation {
    labSampleId: number | string,
    observationInputs: any,
    ph: number | string,
    ohc: number | string,
    dsg: number | string,
    whc: number | string,
    bd: number | string,
    fc: number | string,
    fs: number | string,
    lgc: number | string,
    moisture: number | string,
    analysisStatus: number | string,
    disposalStatus: number | string,
    createdBy: number | any
}

interface UpdateLabSampleValidation {
    observation_inputs: any,
    ph: number | string,
    ohc: number | string,
    dsg: number | string,
    whc: number | string,
    bd: number | string,
    fc: number | string,
    fs: number | string,
    lgc: number | string,
    ec: number | string,
    es: number | string,
    moisture: number | string,
    analysisStatus: number | string,
    disposalStatus: number | string,
    updatedBy: number | any
}



export { AddPlant, PlantMapWithFoodCat, UpdatePlant, AddFunctionalities, UpdateFunctionalities, PlantProductCat, PlantFoodCat, addPlantExtraction, updatePlantExtraction, addLabSample, updateLabSample, addLabSampleValidation, UpdateLabSampleValidation as updateLabSampleValidation };