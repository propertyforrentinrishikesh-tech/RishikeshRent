export const PUBLIC_MENU_SECTIONS = {
  frontend: "frontend",
  hotel: "hotel",
  pilgrimage: "pilgrimage",
  property: "property",
}

export function getPublicMenuSection(pathname = "") {
  const normalizedPath = String(pathname || "").toLowerCase()

  if (normalizedPath.startsWith("/hotels")) {
    return PUBLIC_MENU_SECTIONS.hotel
  }

  if (normalizedPath.startsWith("/piligrimage")) {
    return PUBLIC_MENU_SECTIONS.pilgrimage
  }

  if (normalizedPath.startsWith("/properties")) {
    return PUBLIC_MENU_SECTIONS.property
  }

  return PUBLIC_MENU_SECTIONS.frontend
}
