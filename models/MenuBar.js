import { Schema, models, model } from "mongoose";


const MenuBarSchema = new Schema(
    {
        section: { type: String, default: "frontend", index: true },
        showOnFrontend: { type: Boolean, default: false, index: true },
        active: { type: Boolean },
        order: { type: Number },
        title: { type: String },
        subMenu: [
            {
                title: { type: String },
                url: { type: String },
                active: { type: Boolean },
                order: { type: Number },
                showOnFrontend: { type: Boolean, default: false },
                banner: { url: { type: String }, key: { type: String } },
                profileImage: { url: { type: String }, key: { type: String } },
                packages: { type: [Schema.Types.ObjectId], ref: "Package", default: [] },
            }
        ]
    },
    { timestamps: true }
);

export default models.MenuBar || model("MenuBar", MenuBarSchema);
