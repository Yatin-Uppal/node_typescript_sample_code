interface AddFunctionalities{
    additiveId:number | any,
    functionalityId:number | any,
    additiveSubPart:string | any,
    createdBy: number|any,
    createdAt: string
}

interface AdditiveProductCat{
    additiveId: number|string,
    productCategoryId: number|string,
    status: number,
    createdBy: number|any,
    createdAt: string
}


interface AdditiveFoodCat{
    additiveId: number|string,
    foodCategoryId: number|string,
    status: number,
    createdBy: number|any,
    createdAt: string
}

interface AdditiveReplacement{
    additiveId: number|string,
    plantFunctionalityId: number|string,
    plantExtractionId: number|string,
    productCategory: Array<any>,
    foodCategory : Array<any>,
    createdBy: number|any
}

interface AdditiveUpdateReplacement{
    additiveReplacementId: number|string,
    plantFunctionalityId: number|string,
    plantExtractionId: number|string,
    updatedBy: number|any
}

interface addAdditivesynonyms{
    additiveId: number|string,
    synonyms: string,
    language: any,
    createdBy: number|any
}

interface updateAdditivesynonyms{
    additiveId: number|string,
    additiveSynonymId: number|string,
    synonyms?: string,
    language?: any,
    createdBy: number|any
}

interface AdditiveReplacementRegions{
    combinationId: number|string,
    regionId: number|string,
    createdBy: number|any,
    createdAt: string   
}

interface UpdateFunctionalities{
    additiveFunctionalitiesId: number|any,
    additiveId?:number | any,
    functionalityId?:number | any,
    additiveSubPart?:string | any,
    updatedBy: number|any,
    updatedAt: string
}

interface AddAdditives{
    name: string,
    functionality: number,
    productCategory: number,
    number: string,
    publicId: number,
    foodCategory?:number,
    maxLevel?: number,
    remarks?: string|any,
    comments: string|any,
    status: number,
    createdBy: number|any,
    createdAt: string
}

interface UpdateAdditives{
    additiveId:number,
    name: string | unknown,
    maxLevel: string | unknown,
    number: number | unknown,
    status: number | unknown,
    updatedBy: number | any,
    updatedAt: string | unknown
}

interface AdditivesMapWithFoodCat{
    additivesId:number,
    foodCategoryId: number,
    createdBy: number|any,
    createdAt: string
}


export {AddAdditives,AdditivesMapWithFoodCat,UpdateAdditives,AddFunctionalities, AdditiveUpdateReplacement, updateAdditivesynonyms,addAdditivesynonyms,UpdateFunctionalities,AdditiveProductCat,AdditiveFoodCat,AdditiveReplacement,AdditiveReplacementRegions};