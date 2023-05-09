
interface addPlantRegions{
    plantId: number,
    regionId: number,
    createdBy: number|any,
}
interface addAdditiveRegions{
    additiveId: number| any,
    regionId: number| any,
    createdBy: number|any
}


export {addPlantRegions,addAdditiveRegions};