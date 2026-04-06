/**
 * Maps service section anchors to quote form dropdown values.
 * Service section anchors are hyphenated while form values use underscores.
 */
export const SERVICE_ANCHOR_TO_FORM_VALUE: Record<string, string> = {
  "service-post-construction": "post_construction",
  "service-final-clean": "final_clean",
  "service-commercial": "commercial",
  "service-move": "move_in_out",
  "service-windows": "window",
};

/**
 * Maps industry card identifiers to their default service type.
 */
export const INDUSTRY_TO_SERVICE_TYPE: Record<string, string> = {
  "general-contractors": "post_construction",
  "property-managers": "final_clean",
  "commercial-spaces": "commercial",
};
