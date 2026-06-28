export function isElementInDocument(element: Element): boolean {
  return document.body.contains(element);
}
