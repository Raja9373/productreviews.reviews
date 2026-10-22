export interface SchemaIssue {
  entityType: string;
  severity: "error" | "warning";
  message: string;
}

export interface SchemaValidationReport {
  isValid: boolean;
  totalEntitiesChecked: number;
  errorCount: number;
  warningCount: number;
  issues: SchemaIssue[];
  timestamp: string;
}

export function validatePageJsonLd(): SchemaValidationReport {
  if (typeof document === "undefined") {
    return {
      isValid: true,
      totalEntitiesChecked: 0,
      errorCount: 0,
      warningCount: 0,
      issues: [],
      timestamp: new Date().toISOString()
    };
  }

  const issues: SchemaIssue[] = [];
  const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  const entities: any[] = [];

  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script.textContent || "{}");
      if (Array.isArray(parsed)) {
        entities.push(...parsed);
      } else if (parsed["@graph"] && Array.isArray(parsed["@graph"])) {
        entities.push(...parsed["@graph"]);
      } else {
        entities.push(parsed);
      }
    } catch (e: any) {
      issues.push({
        entityType: "JSON",
        severity: "error",
        message: `Invalid JSON-LD syntax: ${e?.message}`
      });
    }
  }

  const totalEntitiesChecked = entities.length;

  for (const entity of entities) {
    const type = entity["@type"] || "Unknown";

    if (type === "Product") {
      if (!entity.name || typeof entity.name !== "string" || !entity.name.trim()) {
        issues.push({
          entityType: "Product",
          severity: "error",
          message: "Product schema is missing required 'name' property."
        });
      }
      if (entity.aggregateRating) {
        const ar = entity.aggregateRating;
        if (!ar.ratingValue || (!ar.reviewCount && !ar.ratingCount)) {
          issues.push({
            entityType: "AggregateRating",
            severity: "error",
            message: "AggregateRating within Product schema requires 'ratingValue' and 'reviewCount' or 'ratingCount'."
          });
        }
      }
      if (entity.review) {
        const rev = entity.review;
        if (!rev.author || !rev.author.name) {
          issues.push({
            entityType: "Review",
            severity: "warning",
            message: "Review schema is recommended to include an 'author' object with a 'name'."
          });
        }
      }
    } else if (type === "Review") {
      if (!entity.author || !entity.author.name) {
        issues.push({
          entityType: "Review",
          severity: "error",
          message: "Review schema requires an 'author' property with a name."
        });
      }
      if (!entity.reviewRating && !entity.reviewBody) {
        issues.push({
          entityType: "Review",
          severity: "error",
          message: "Review schema requires either 'reviewRating' or 'reviewBody'."
        });
      }
    } else if (type === "AggregateRating") {
      if (!entity.ratingValue) {
        issues.push({
          entityType: "AggregateRating",
          severity: "error",
          message: "AggregateRating schema is missing required 'ratingValue'."
        });
      }
      if (!entity.reviewCount && !entity.ratingCount) {
        issues.push({
          entityType: "AggregateRating",
          severity: "error",
          message: "AggregateRating schema requires 'reviewCount' or 'ratingCount'."
        });
      }
    } else if (type === "FAQPage") {
      if (!entity.mainEntity || !Array.isArray(entity.mainEntity) || entity.mainEntity.length === 0) {
        issues.push({
          entityType: "FAQPage",
          severity: "error",
          message: "FAQPage schema requires a 'mainEntity' array of Questions and Answers."
        });
      }
    } else if (type === "BreadcrumbList") {
      if (!entity.itemListElement || !Array.isArray(entity.itemListElement) || entity.itemListElement.length === 0) {
        issues.push({
          entityType: "BreadcrumbList",
          severity: "error",
          message: "BreadcrumbList schema requires an 'itemListElement' array of ListItems."
        });
      }
    }
  }

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;

  return {
    isValid: errorCount === 0,
    totalEntitiesChecked,
    errorCount,
    warningCount,
    issues,
    timestamp: new Date().toISOString()
  };
}
