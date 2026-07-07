import { Schema, model, models } from "mongoose";

const ImageSchema = new Schema(
  {
    url: { type: String, default: "" },
    key: { type: String, default: "" },
  },
  { _id: false }
);
const HighlightSchema = new Schema(
  {
    title: { type: String, default: "" },
    point: { type: String, default: "" },
  },
  { _id: false }
);

const ParagraphSectionSchema = new Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    firstImage: { type: ImageSchema, default: () => ({}) },
    secondImage: { type: ImageSchema, default: () => ({}) },
    bulletPoints: { type: [String], default: [""] },
  },
  { _id: false }
);

const TableRowSchema = new Schema(
  {
    column1: { type: String, default: "" },
    column2: { type: String, default: "" },
  },
  { _id: false }
);

const AccordionTagSchema = new Schema(
  {
    left: { type: String, default: "" },
    right: { type: String, default: "" },
  },
  { _id: false }
);

const WebpageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    active: { type: Boolean, default: true },
    section:{type:String,required:true},
    templateType: {
      type: String,
      enum: ["design1", "design2", "design3"],
      default: "design1",
    },
    firstTitle: { type: String, default: "" },
    imageFirst: { type: ImageSchema, default: () => ({}) },
    bannerImage: { type: ImageSchema, default: () => ({}) },
    secondTitle: { type: String, default: "" },
    createTags: { type: [String], default: [""] },
    postedBy: {
      admin: { type: Boolean, default: false },
      user: { type: Boolean, default: false },
    },
    highlights: { type: [HighlightSchema], default: [{ title: "", point: "" }] },
    paragraphSections: {
      type: [ParagraphSectionSchema],
      default: [{ title: "", description: "", firstImage: {}, secondImage: {}, bulletPoints: [""] }],
    },
    paragraphFirstImage: { type: ImageSchema, default: () => ({}) },
    paragraphSecondImage: { type: ImageSchema, default: () => ({}) },
    tableTitle: { type: String, default: "" },
    tableRows: { type: [TableRowSchema], default: [{ column1: "", column2: "" }] },
    blockquoteMainTitle: { type: String, default: "" },
    blockquoteLeftTitle: { type: String, default: "" },
    blockquoteDescription: { type: String, default: "" },
    blockquoteTags: { type: [String], default: [""] },
    accordionTags: { type: [AccordionTagSchema], default: [{ left: "", right: "" }] },
    advertisementImage: { type: ImageSchema, default: () => ({}) },
    advertisementUrl: { type: String, default: "" },
    sideThumbImage: { type: ImageSchema, default: () => ({}) },
    sideThumbName: { type: String, default: "" },
    sideThumbDesignation: { type: String, default: "" },
    sideThumbDescription: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    instaUrl: { type: String, default: "" },
    googleUrl: { type: String, default: "" },
    mainProfileImage: { type: ImageSchema, default: () => ({}) },
    imageGallery: { type: [ImageSchema], default: [] },
  },
  { timestamps: true }
);

export default models.Webpage || model("Webpage", WebpageSchema);
