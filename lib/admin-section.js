export const ADMIN_SECTIONS = {
  frontend: "frontend",
  hotel: "hotel",
  piligrimage: "piligrimage",
  property: "property",
}

export const ADMIN_SECTION_ROUTE_PREFIX = {
  frontend: "/admin",
  hotel: "/admin/hotel_extranet",
  piligrimage: "/admin/pilgrimage_dashboard",
  property: "/admin/property_extranet",
}

export function normalizeAdminSection(section) {
  if (typeof section !== "string") {
    return ADMIN_SECTIONS.frontend
  }

  const normalized = section.trim().toLowerCase()
  return ADMIN_SECTIONS[normalized] || ADMIN_SECTIONS.frontend
}

export function getAdminSectionFilter(section) {
  const normalizedSection = normalizeAdminSection(section)

  if (normalizedSection === ADMIN_SECTIONS.frontend) {
    return {
      $or: [
        { section: ADMIN_SECTIONS.frontend },
        { section: { $exists: false } },
      ],
    }
  }

  return { section: normalizedSection }
}