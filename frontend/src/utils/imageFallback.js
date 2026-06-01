// Export a small SVG data URL used as an inline fallback when image requests fail
const fallbackSvg = encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
  <rect width='100%' height='100%' fill='#FEF3C7'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='28' fill='#92400E'>Cashews</text>
</svg>
`);

export const FALLBACK_IMAGE = `data:image/svg+xml;charset=UTF-8,${fallbackSvg}`;
export default FALLBACK_IMAGE;
