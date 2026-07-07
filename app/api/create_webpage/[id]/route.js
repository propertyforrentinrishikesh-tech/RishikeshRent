import connectDB from "@/lib/connectDB";
import Webpage from "@/models/Webpage";
import { NextResponse } from "next/server";

const ALLOWED_TEMPLATE_TYPES = new Set(["design1", "design2", "design3"]);

const sanitizeTemplateType = (templateType) => {
  if (ALLOWED_TEMPLATE_TYPES.has(templateType)) return templateType;
  return "design1";
};

const ALLOWED_UPDATE_FIELDS = new Set([
  "title",
  "slug",
  "active",
  "templateType",
  "firstTitle",
  "imageFirst",
  "bannerImage",
  "secondTitle",
  "createTags",
  "postedBy",
  "highlights",
  "paragraphSections",
  "paragraphFirstImage",
  "paragraphSecondImage",
  "tableTitle",
  "tableRows",
  "blockquoteMainTitle",
  "blockquoteLeftTitle",
  "blockquoteDescription",
  "blockquoteTags",
  "accordionTags",
  "advertisementImage",
  "advertisementUrl",
  "sideThumbImage",
  "sideThumbName",
  "sideThumbDesignation",
  "sideThumbDescription",
  "facebookUrl",
  "youtubeUrl",
  "instaUrl",
  "googleUrl",
  "mainProfileImage",
  "imageGallery",
  "section",
]);

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const webpage = await Webpage.findById(id);
    if (!webpage) {
      return NextResponse.json({ error: "Webpage not found" }, { status: 404 });
    }

    return NextResponse.json(webpage, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch webpage", message: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const update = {};
    Object.keys(body || {}).forEach((key) => {
      if (ALLOWED_UPDATE_FIELDS.has(key)) {
        update[key] = body[key];
      }
    });

    if (typeof body.templateType === "string") {
      update.templateType = sanitizeTemplateType(body.templateType);
    }

    if (typeof body.slug === "string") {
      update.slug = body.slug.trim().toLowerCase();
    }

    if (typeof body.title === "string") {
      update.title = body.title.trim();
    }

    if (body.sideThumbImage && typeof body.sideThumbImage === "object") {
      update.sideThumbImage = {
        url: body.sideThumbImage.url || "",
        key: body.sideThumbImage.key || body.sideThumbImageKey || "",
      };
    }

    if (typeof body.sideThumbImage === "string") {
      update.sideThumbImage = {
        url: body.sideThumbImage,
        key: body.sideThumbImageKey || "",
      };
    }

    const updated = await Webpage.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Webpage not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update webpage", message: error.message }, { status: 500 });
  }
}
