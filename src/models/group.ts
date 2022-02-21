export const trans = (value: string, t: any): string => {
    let trans = "";
    switch (value) {
        case "Council":
            trans = t("default.council");
            break;
        case "Community":
            trans = t("default.community");
            break;
        case "Foundation":
            trans = t("default.investor");
            break;
        default:
            break;
    }
    return trans;
};