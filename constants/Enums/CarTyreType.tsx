export enum CarTyreType {
    Letnie,
    Zimowe,
    Całoroczne,
    Inne
};

const CarTyreTypeNames = {
    [CarTyreType.Letnie]: 'Letnie',
    [CarTyreType.Zimowe]: 'Zimowe',
    [CarTyreType.Całoroczne]: 'Całoroczne',
    [CarTyreType.Inne]: 'Inne'
};

export const getTyreTypeName = (tyreType: CarTyreType) => {
    console.log(`[getTyreTypeName] tyreType: ${tyreType} `);
    return CarTyreTypeNames[tyreType];
};