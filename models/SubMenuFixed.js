import { Schema, models, model } from "mongoose";


const SubMenuFixedSchema = new Schema(
    {
        section: { type: String, default: "frontend", index: true },
        showOnFrontend: { type: Boolean, default: false, index: true },
        active: { type: Boolean },
        catTitle: { type: String },
        subCat: [
            {
                title: { type: String },
                showOnFrontend: { type: Boolean, default: false },
                subCatPackage: [
                    {
                        title: { type: String },
                        url: { type: String },
                        active: { type: Boolean },
                        showOnFrontend: { type: Boolean, default: false },
                    }
                ],
                active: { type: Boolean },
            }
        ]
    },
    { timestamps: true }
);

export default models.SubMenuFixed || model("SubMenuFixed", SubMenuFixedSchema);