export enum CarTyreType {
    Letnie,
    Zimowe,
    Całoroczne,
    Inne
};

export const CarTyreTypeNames = {
    [CarTyreType.Letnie]: 'Letnie',
    [CarTyreType.Zimowe]: 'Zimowe',
    [CarTyreType.Całoroczne]: 'Całoroczne',
    [CarTyreType.Inne]: 'Inne'
};

export const getTyreTypeName = (tyreType: CarTyreType) => {
    return CarTyreTypeNames[tyreType];
};