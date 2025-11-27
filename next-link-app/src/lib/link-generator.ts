import { z } from "zod";

export const linkInputSchema = z.object({
  url: z.string().url(),
  title: z.string().trim().optional(),
  type: z.enum(["flickr", "secondlife"]),
});

export type LinkInput = z.infer<typeof linkInputSchema>;

export function buildLink(input: LinkInput) {
  const parsed = linkInputSchema.parse(input);
  const title = parsed.title && parsed.title.length > 0 ? parsed.title : parsed.url;

  if (parsed.type === "flickr") {
    return `<a href="${parsed.url}" target="_blank" rel="noopener noreferrer">${title}</a>`;
  }

  return `[${parsed.url} ${title}]`;
}
