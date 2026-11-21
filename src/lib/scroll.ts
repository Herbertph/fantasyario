/** Scrolls to an in-page section; CSS `scroll-behavior` decides smooth vs. instant (reduced motion). */
export function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({ block: 'start' });
}
