import type {
  ChatProductSuggestion,
  Product,
  ProductDescriptionRequest,
  ProductDescriptionResponse,
  ProductFunction,
  ProductTag,
  AiProvider,
} from "@/lib/contracts";

function limitText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}.`;
}

export function buildProductSuggestions(
  products: Product[],
  message: string,
  requireMatch = false,
): ChatProductSuggestion[] {
  const normalizedMessage = message.toLowerCase();
  const matchedProducts = products
    .filter((product) => {
      const haystack = [
        product.name,
        product.shortDescription,
        product.form,
        ...product.functions,
        ...product.tags,
      ]
        .join(" ")
        .toLowerCase();

      return normalizedMessage
        .split(/\s+/)
        .filter((word) => word.length > 3)
        .some((word) => haystack.includes(word));
    })
    .slice(0, 3);

  if (requireMatch && matchedProducts.length === 0) {
    return [];
  }

  const fallbackProducts = products.slice(0, 3);
  const suggestions = matchedProducts.length > 0 ? matchedProducts : fallbackProducts;

  return suggestions.map((product) => ({
    productId: product.id,
    name: product.name,
    price: product.price,
    href: `/products/${product.slug}`,
    reason: `${product.name} cocok untuk kebutuhan ${product.functions.join(", ")}.`,
    imageUrl: product.image.src,
  }));
}

export function normalizeProductDescription(
  input: ProductDescriptionRequest,
  fullDescriptionMarkdown: string,
  providerUsed: AiProvider,
): ProductDescriptionResponse {
  const suggestedTags: ProductTag[] = input.form === "diffuser" ? ["aroma-calm"] : ["nilam-passport"];
  const suggestedFunctions: ProductFunction[] = input.functions;

  return {
    providerUsed,
    shortDescription: limitText(
      `${input.productName} berbasis nilam Aceh dengan profil aroma ${input.aromaProfile}.`,
      160,
    ),
    fullDescriptionMarkdown,
    suggestedTags,
    suggestedFunctions,
    passportDraftSuggestion: {
      origin: input.origin,
      aromaProfile: input.aromaProfile
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
      functions: input.functions,
      usage: "Gunakan sesuai petunjuk pada label produk dan kebutuhan harian.",
      safetyNotes: input.safetyNotes,
    },
    safetyNotice: input.safetyNotes,
    missingFields: [],
  };
}
