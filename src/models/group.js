export const trans = (value, t) => {
    let trans = "";
    switch (value) {
        case "Insiders":
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