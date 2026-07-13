import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baseUrl = "https://gutterworx-yorkshire.netlify.app";
const phoneDisplay = "07811 367556";
const phone = "07811367556";
const whatsapp = "447811367556";
const email = "info@gutterworx.uk";
const facebook = "https://www.facebook.com/gutterworxuk";

const services = [
  { slug: "seamless-guttering", name: "Seamless Guttering", icon: "↓", short: "Continuous aluminium guttering roll-formed on site to suit the exact dimensions of your property." },
  { slug: "fascias-and-soffits", name: "Fascias & Soffits", icon: "▰", short: "Neat, low-maintenance uPVC roofline systems fitted to protect exposed timber and improve kerb appeal." },
  { slug: "roof-repairs", name: "Roof Repairs", icon: "⌂", short: "Practical repairs for slipped tiles, damaged pointing, leaks, storm damage and other roofing faults." },
  { slug: "cut-and-drop", name: "Cut & Drop", icon: "↔", short: "5-inch and 6-inch Ogee seamless gutter supplied to roofers, joiners and other trade customers." },
  { slug: "roofing-services", name: "Roofing Services", icon: "▲", short: "Supporting roofing work when your roofline project needs more than guttering alone." }
];

const locations = [
  { slug: "wakefield", name: "Wakefield", county: "West Yorkshire", nearby: "Ossett, Horbury, Normanton and surrounding WF postcodes", local: "From traditional terraces and semis to newer housing around the district, Wakefield properties need rainwater systems that can cope with Yorkshire downpours without relying on multiple weak joints." },
  { slug: "leeds", name: "Leeds", county: "West Yorkshire", nearby: "Morley, Rothwell, Garforth and surrounding LS postcodes", local: "Leeds has a wide mix of stone terraces, suburban family homes and commercial premises. We measure each roofline individually so the gutter profile, outlets and downpipes are appropriate for the building rather than using a one-size-fits-all layout." },
  { slug: "barnsley", name: "Barnsley", county: "South Yorkshire", nearby: "Darton, Dodworth, Royston and surrounding S postcodes", local: "Barnsley homes are exposed to year-round rain and changing temperatures. A well-fitted aluminium system gives owners a durable alternative to short plastic sections while keeping the roofline crisp and tidy." },
  { slug: "wetherby", name: "Wetherby", county: "West Yorkshire", nearby: "Boston Spa, Tadcaster, Collingham and nearby villages", local: "Around Wetherby, rooflines range from established stone properties to modern developments. On-site roll forming lets us create continuous gutter runs to suit both, with fewer joints and a clean finish." },
  { slug: "harrogate", name: "Harrogate", county: "North Yorkshire", nearby: "Knaresborough, Ripley, Pannal and surrounding HG postcodes", local: "Harrogate's varied housing stock calls for careful detailing. We focus on accurate measurement, considered outlet positions and a finish that complements the property as well as moving rainwater effectively." },
  { slug: "huddersfield", name: "Huddersfield", county: "West Yorkshire", nearby: "Brighouse, Holmfirth, Mirfield and surrounding HD postcodes", local: "Stone-built homes and exposed hillside properties around Huddersfield can place real demands on a roofline. Seamless aluminium reduces the number of joints across long eaves and gives a robust, low-maintenance result." },
  { slug: "halifax", name: "Halifax", county: "West Yorkshire", nearby: "Sowerby Bridge, Elland, Hebden Bridge and nearby areas", local: "Halifax and the Calder Valley combine heavy rainfall with many older stone properties. We tailor every gutter run on site, paying close attention to falls, outlets and safe discharge into the existing drainage arrangement." },
  { slug: "selby", name: "Selby", county: "North Yorkshire", nearby: "Sherburn in Elmet, Brayton, Riccall and nearby villages", local: "For Selby homes, an efficient rainwater system helps keep walls, foundations and external finishes protected. Our continuous aluminium guttering is formed at the property for a precise fit and a smarter roofline." }
];

function esc(value) {
  return String(value).replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
}

function write(route, content) {
  const target = path.join(root, route);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function prefixFor(route) {
  const depth = route.split("/").length - 1;
  return depth === 0 ? "" : "../".repeat(depth);
}

function schemaFor(type, data = {}) {
  const common = {
    "@context": "https://schema.org",
    "@type": type,
    name: data.name || "Gutterworx",
    url: data.url || baseUrl,
    telephone: `+44${phone.slice(1)}`,
    email,
    image: `${baseUrl}/assets/images/hero.jpg`,
    areaServed: locations.map(location => location.name)
  };
  if (type === "HomeAndConstructionBusiness") {
    common.description = "Seamless aluminium guttering, fascias, soffits, cut and drop trade supply and roof repairs across West Yorkshire and surrounding areas.";
    common.priceRange = "££";
    common.sameAs = [facebook];
  }
  return JSON.stringify({ ...common, ...data });
}

function head({ route, title, description, type = "website", schema, noindex = false }) {
  const prefix = prefixFor(route);
  const cleanPath = route === "index.html" ? "/" : `/${route.replace(/index\.html$/, "")}`;
  const canonical = `${baseUrl}${cleanPath}`;
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow,max-image-preview:large">'}
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en-gb" href="${canonical}">
  <meta name="theme-color" content="#050505">
  <meta property="og:locale" content="en_GB">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="Gutterworx">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${baseUrl}/assets/images/hero.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${prefix}assets/images/logo.webp" type="image/webp">
  <link rel="stylesheet" href="${prefix}assets/css/site.css?v=4">
  <script type="application/ld+json">${schema || schemaFor("HomeAndConstructionBusiness", { url: canonical })}</script>
</head>`;
}

function header(prefix, current = "") {
  const navItem = (key, href, label) => `<a href="${prefix}${href}"${current === key ? ' aria-current="page"' : ""}>${label}</a>`;
  const serviceMenu = services.map(service => `<a href="${prefix}services/${service.slug}/">${esc(service.name)}</a>`).join("");
  const areaMenu = locations.map(location => `<a href="${prefix}locations/${location.slug}/">${esc(location.name)}</a>`).join("");
  return `<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container nav-wrap">
    <a class="brand" href="${prefix}" aria-label="Gutterworx home"><img src="${prefix}assets/images/logo.webp" alt="Gutterworx" width="845" height="139"></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">☰</button>
    <nav class="nav" id="primary-nav" aria-label="Primary navigation">
      ${navItem("about", "about/", "About")}
      <div class="nav-group">
        ${navItem("services", "services/", "Services")}
        <div class="nav-dropdown" role="group" aria-label="Service pages"><a href="${prefix}services/">All services</a>${serviceMenu}</div>
      </div>
      ${navItem("gallery", "gallery/", "Our work")}
      <div class="nav-group">
        ${navItem("areas", "areas/", "Areas")}
        <div class="nav-dropdown nav-dropdown-areas" role="group" aria-label="Area pages"><a href="${prefix}areas/">All areas</a>${areaMenu}</div>
      </div>
      ${navItem("contact", "contact/", "Contact")}
      <a class="btn btn-red btn-small" href="${prefix}contact/">Request a quote</a>
    </nav>
    <a class="btn btn-small header-call" href="tel:${phone}">${phoneDisplay}</a>
  </div>
</header>`;
}

function floating() {
  return `<aside class="floating-actions" aria-label="Quick contact">
  <a class="float-btn" href="tel:${phone}" aria-label="Call Gutterworx">☎</a>
  <a class="float-btn whatsapp" href="https://wa.me/${whatsapp}?text=Hi%20Gutterworx%2C%20I%27d%20like%20a%20quote." aria-label="WhatsApp Gutterworx" target="_blank" rel="noopener">WA</a>
</aside>`;
}

function footer(prefix) {
  const serviceLinks = services.map(service => `<a href="${prefix}services/${service.slug}/">${esc(service.name)}</a>`).join("");
  const areaLinks = locations.map(location => `<a href="${prefix}locations/${location.slug}/">${esc(location.name)}</a>`).join("");
  return `${floating()}
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand"><img src="${prefix}assets/images/logo.webp" alt="Gutterworx" width="845" height="139"><p>Seamless aluminium guttering, fascias, soffits, cut and drop trade supply and supporting roofing services across West Yorkshire and surrounding areas.</p></div>
      <div><p class="footer-title">Company</p><div class="footer-links"><a href="${prefix}">Home</a><a href="${prefix}about/">About</a><a href="${prefix}gallery/">Our work</a><a href="${prefix}contact/">Request a quote</a><a href="${prefix}privacy/">Privacy</a></div></div>
      <div><p class="footer-title">Services</p><div class="footer-links"><a href="${prefix}services/">All services</a>${serviceLinks}</div></div>
      <div><p class="footer-title">Areas</p><div class="footer-links"><a href="${prefix}areas/">All areas</a>${areaLinks}</div></div>
      <div><p class="footer-title">Contact</p><div class="footer-links"><a href="tel:${phone}">${phoneDisplay}</a><a href="https://wa.me/${whatsapp}" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:${email}">${email}</a><a href="${facebook}" target="_blank" rel="noopener">Facebook</a></div></div>
    </div>
    <div class="footer-bottom"><span>© <span data-year>2026</span> Gutterworx. All rights reserved.</span><span>Serving West Yorkshire and surrounding areas.</span><span class="madereal-credit">Website by <a href="https://madereal.uk" target="_blank" rel="noopener">madereal.uk</a></span></div>
  </div>
</footer>
<script src="${prefix}assets/js/site.js" defer></script>
</body>
</html>`;
}

function breadcrumbs(prefix, items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${prefix}">Home</a>${items.map((item, i) => `<span>${item.href && i < items.length - 1 ? `<a href="${prefix}${item.href}">${esc(item.name)}</a>` : esc(item.name)}</span>`).join("")}</nav>`;
}

function pageHero(prefix, title, intro, items = []) {
  return `<section class="page-hero"><div class="container">${breadcrumbs(prefix, items)}<p class="eyebrow">Gutterworx · West Yorkshire</p><h1>${title}</h1><p class="lead">${intro}</p></div></section>`;
}

function serviceCards(prefix, limit = services.length) {
  return `<div class="cards${limit === 4 ? " four" : ""}">${services.slice(0, limit).map(service => `<article class="card"><div class="card-icon" aria-hidden="true">${service.icon}</div><h3>${esc(service.name)}</h3><p>${esc(service.short)}</p><a class="text-link" href="${prefix}services/${service.slug}/">View service →</a></article>`).join("")}</div>`;
}

function areaCards(prefix) {
  return `<div class="areas-grid">${locations.map(location => `<a class="area-link" href="${prefix}locations/${location.slug}/"><strong>${location.name}</strong><span>${location.county} · View area →</span></a>`).join("")}</div>`;
}

function quoteForm() {
  return `<form class="form-shell" name="quote-request" method="POST" action="/thank-you/" data-netlify="true" netlify-honeypot="bot-field" data-quote-form>
  <input type="hidden" name="form-name" value="quote-request">
  <p class="honeypot"><label>Do not fill this out: <input name="bot-field" type="text"></label></p>
  <div class="form-grid">
    <div class="field"><label for="name">Full name *</label><input id="name" name="name" type="text" autocomplete="name" required></div>
    <div class="field"><label for="phone">Phone number *</label><input id="phone" name="phone" type="tel" autocomplete="tel" required></div>
    <div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email"></div>
    <div class="field"><label for="postcode">Postcode / area *</label><input id="postcode" name="postcode" type="text" autocomplete="postal-code" required></div>
    <div class="field full"><label for="service">What would you like a quote for? *</label><select id="service" name="service" required><option value="">Choose a service</option><option>Seamless Guttering</option><option>Fascias &amp; Soffits</option><option>Roof Repair</option><option>Cut &amp; Drop Trade Service</option><option>Other Work or Enquiry</option></select></div>
    <fieldset class="cut-drop-fields" data-cut-drop-fields hidden><legend class="fieldset-title">Cut &amp; Drop details</legend>
      <div class="field"><label for="profile">Ogee gutter profile *</label><select id="profile" name="cut_drop_profile" required><option value="">Choose a profile</option><option>5 inch Ogee (127mm)</option><option>6 inch Ogee (152mm)</option></select></div>
      <div class="field"><label for="length">Total length required (metres) *</label><input id="length" name="cut_drop_length_metres" type="number" min="1" step="0.1" inputmode="decimal" required></div>
      <div class="field"><label for="corners">Number / type of corners</label><input id="corners" name="cut_drop_corners" type="text" placeholder="e.g. 2 external, 1 internal"></div>
      <div class="field"><label for="outlets">Number of outlets</label><input id="outlets" name="cut_drop_outlets" type="number" min="0" inputmode="numeric"></div>
      <div class="field"><label for="colour">Required colour</label><input id="colour" name="cut_drop_colour" type="text" placeholder="e.g. black, white or anthracite"></div>
      <div class="field"><label for="date">Preferred cut / delivery date</label><input id="date" name="cut_drop_preferred_date" type="date"></div>
      <div class="field full"><label for="site-address">Site / delivery address *</label><textarea id="site-address" name="cut_drop_address" rows="3" required></textarea></div>
    </fieldset>
    <div class="field full"><label for="message">Tell us about the job *</label><textarea id="message" name="message" required placeholder="Include approximate dimensions, access details and anything else that will help us quote."></textarea></div>
  </div>
  <p class="form-note">By sending this form you agree that Gutterworx may contact you about this enquiry. See our <a href="/privacy/">privacy notice</a>.</p>
  <button class="btn btn-red" type="submit">Send quote request →</button>
</form>`;
}

function cta(prefix, text = "Ready to improve your roofline?") {
  return `<section class="cta-band"><div class="container cta-flex"><h2>${text}</h2><div class="button-row"><a class="btn btn-red" href="${prefix}contact/">Request a free quote</a><a class="btn" href="tel:${phone}">Call ${phoneDisplay}</a></div></div></section>`;
}

function doc({ route, title, description, current, main, schema, noindex = false }) {
  const prefix = prefixFor(route);
  return `${head({ route, title, description, schema, noindex })}${header(prefix, current)}<main id="main">${main(prefix)}</main>${footer(prefix)}`;
}

write("index.html", doc({
  route: "index.html",
  title: "Seamless Guttering West Yorkshire | Gutterworx",
  description: "Gutterworx installs seamless aluminium guttering, fascias and soffits across West Yorkshire, with roof repairs and 5-inch or 6-inch Ogee cut and drop for trade customers.",
  main: prefix => `<section class="hero"><img class="hero-bg" src="assets/images/hero.jpg" alt="Black seamless aluminium guttering installed by Gutterworx" width="333" height="333"><div class="container hero-copy"><p class="eyebrow">Seamless rainwater systems · West Yorkshire</p><h1>Seamless systems.<span>Flawless finish.</span></h1><p class="lead">Made-to-measure aluminium guttering, fascias and soffits for homes and businesses — plus a flexible 5-inch and 6-inch Ogee cut and drop service for the trade.</p><div class="button-row"><a class="btn btn-red" href="contact/">Get a free quote</a><a class="btn" href="services/seamless-guttering/">Explore seamless guttering</a></div></div></section>
  <section class="trust-strip" aria-label="Key benefits"><div class="trust-grid container"><div class="trust-item"><strong>Made on site</strong><span>Measured for your property</span></div><div class="trust-item"><strong>Fewer joints</strong><span>Reduced weak points</span></div><div class="trust-item"><strong>5” & 6”</strong><span>Ogee trade options</span></div><div class="trust-item"><strong>Free quotes</strong><span>No obligation</span></div></div></section>
  <section class="section"><div class="container split"><div><p class="eyebrow">Specialist roofline work</p><h2>Built to manage <span class="red">Yorkshire weather.</span></h2><hr class="rule"><p class="lead">Seamless guttering is formed in continuous lengths at your property, helping remove the joints that commonly become weak points in traditional sectional systems.</p><p class="muted">Gutterworx focuses first on guttering, fascias and soffits. Where the surrounding roof needs attention, we can also quote for practical repair work so the whole roofline performs as it should.</p><ul class="checks"><li>Aluminium seamless systems</li><li>uPVC fascias and soffits</li><li>Roofline repairs</li><li>Trade cut and drop</li></ul><a class="btn" href="about/">About Gutterworx</a></div><div class="image-card"><img src="assets/images/seamless-install.jpg" alt="Seamless aluminium gutter run with black outlet" width="414" height="414" loading="lazy"><div class="image-label">Continuous gutter runs are roll-formed on site for a clean, accurately measured fit.</div></div></div></section>
  <section class="section panel-section"><div class="container"><div class="section-head center"><p class="eyebrow">Services</p><h2>Everything your roofline needs.</h2><hr class="rule"><p class="lead">Residential installation, supporting roofing work and trade supply across West Yorkshire and surrounding areas.</p></div>${serviceCards("", 4)}<div class="button-row" style="justify-content:center;margin-top:34px"><a class="btn" href="services/">View all services</a></div></div></section>
  <section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Recent work</p><h2>Made to measure. <span class="red">Made to last.</span></h2><hr class="rule"></div><div class="gallery"><figure><img src="assets/images/project-seamless.jpg" alt="Seamless aluminium guttering on a brick home" width="414" height="414" loading="lazy"><figcaption>Seamless gutter installation</figcaption></figure><figure><img src="assets/images/project-fascia.jpg" alt="Black fascia and guttering detail" width="414" height="414" loading="lazy"><figcaption>Roofline detail</figcaption></figure><figure><img src="assets/images/project-roof-repair.jpg" alt="Guttering installed on a stone property" width="414" height="414" loading="lazy"><figcaption>Stone property roofline</figcaption></figure><figure><img src="assets/images/testimonial.jpg" alt="Gutterworx forming guttering at a property" width="414" height="414" loading="lazy"><figcaption>Formed on site</figcaption></figure><figure><img src="assets/images/seamless-install.jpg" alt="Close-up of Ogee aluminium guttering" width="414" height="414" loading="lazy"><figcaption>Ogee profile</figcaption></figure></div><div class="button-row" style="margin-top:28px"><a class="btn" href="gallery/">View our work</a><a class="btn" href="${facebook}" target="_blank" rel="noopener">Follow on Facebook</a></div></div></section>
  <section class="section panel-section"><div class="container split"><div><p class="eyebrow">Customer feedback</p><h2>A finish people <span class="red">recommend.</span></h2><hr class="rule"><div class="testimonial"><blockquote>“Absolutely brilliant service. The seamless gutters look incredible and the team were professional from start to finish.”</blockquote><cite>Customer feedback shared with Gutterworx</cite></div></div><div><p class="eyebrow">Areas covered</p><h2>Across West Yorkshire <span class="red">and beyond.</span></h2><hr class="rule"><p class="muted">We cover Wakefield, Leeds, Barnsley, Wetherby, Harrogate, Huddersfield, Halifax and Selby, along with nearby towns and villages.</p><a class="btn" href="areas/">Find your area</a></div></div></section>
  <section class="section quote" id="quote"><div class="narrow"><div class="section-head center"><p class="eyebrow">Free quotation</p><h2>Tell us what you need.</h2><hr class="rule"><p class="lead">Choose a service below. Trade customers will see the extra cut and drop options automatically.</p></div>${quoteForm()}</div></section>`
}));

write("about/index.html", doc({ route: "about/index.html", current: "about", title: "About Gutterworx | Seamless Guttering Specialists", description: "Meet Gutterworx, specialists in seamless aluminium guttering, fascias, soffits and roofline work across West Yorkshire and surrounding areas.", main: prefix => `${pageHero(prefix, "Roofline specialists with a seamless focus.", "Gutterworx puts seamless aluminium guttering, fascias and soffits at the centre of every project, backed by practical roofing knowledge when the surrounding roofline needs attention.", [{name:"About"}])}<section class="section"><div class="container split"><div class="prose"><p class="eyebrow">Our approach</p><h2>Measured carefully. Fitted properly.</h2><p>Every property is different. Roof length, outlet positions, existing drainage and access all affect the right solution, which is why we inspect the job and quote around the actual building.</p><p>For seamless installations, aluminium coil is roll-formed at the property into continuous lengths. That gives a clean appearance while reducing the number of joints that can become vulnerable over time.</p><h3>Residential and trade work</h3><p>Homeowners can ask us to manage the complete gutter and roofline package. Roofers, joiners and other trades can use our cut and drop service when they need accurately formed 5-inch or 6-inch Ogee guttering for their own installation.</p><ul><li>Clear, no-obligation quotations</li><li>Careful measurement and practical advice</li><li>Work planned around the property and access</li><li>West Yorkshire and surrounding areas covered</li></ul></div><div class="image-card"><img src="${prefix}assets/images/testimonial.jpg" alt="Gutterworx forming seamless guttering on site" width="414" height="414"><div class="image-label">Formed on site to the measurements of the job.</div></div></div></section>${cta(prefix, "Talk to Gutterworx about your property.")}` }));

write("services/index.html", doc({ route: "services/index.html", current: "services", title: "Guttering & Roofline Services | Gutterworx", description: "Explore seamless aluminium guttering, fascia and soffit installation, roof repairs, roofing services and 5-inch or 6-inch Ogee cut and drop from Gutterworx.", main: prefix => `${pageHero(prefix, "Guttering, roofline and trade services.", "Our main focus is seamless guttering, fascias and soffits. We also provide cut and drop for the trade and supporting roof repairs where required.", [{name:"Services"}])}<section class="section"><div class="container">${serviceCards(prefix)}</div></section><section class="section panel-section"><div class="narrow prose"><h2>Not sure which service you need?</h2><p>Send a few details and, if possible, photos of the roofline. We can advise whether you need a full replacement, a targeted repair or a trade supply quote. All quotations are based on the actual project rather than generic online pricing.</p><div class="button-row"><a class="btn btn-red" href="${prefix}contact/">Request a quote</a><a class="btn" href="https://wa.me/${whatsapp}" target="_blank" rel="noopener">Send photos on WhatsApp</a></div></div></section>` }));

const serviceContent = {
  "seamless-guttering": { title: "Seamless Aluminium Guttering", desc: "Made-to-measure seamless aluminium guttering installed across West Yorkshire. Continuous Ogee runs formed on site by Gutterworx.", intro: "Continuous aluminium gutter runs formed at your property for fewer joints, a precise fit and a crisp finish.", image: "project-seamless.jpg", why: "Traditional plastic guttering is assembled from short sections joined together. Those connections can move, distort or begin to leak. Seamless guttering is roll-formed in long continuous runs, so joints are generally limited to necessary corners and outlets.", bullets: ["Formed to the measured length of the roofline", "Fewer joints across straight runs", "Strong, low-maintenance aluminium", "Clean Ogee profile", "Suitable for homes and many commercial rooflines", "Outlet and downpipe layout considered as part of the job"], faq: [["Is seamless guttering completely joint-free?", "Straight lengths are formed continuously, but corners, outlets and some changes in direction still require fittings. The key benefit is removing the repeated joints found along sectional gutter runs."],["Can you replace fascias at the same time?", "Yes. If existing fascia boards or soffits need attention, we can include them in the quotation so the full roofline is dealt with together."],["Which areas do you cover?", "We cover the eight listed areas across West Yorkshire and surrounding parts of Yorkshire, and can consider nearby locations depending on the project."]] },
  "fascias-and-soffits": { title: "Fascias & Soffits", desc: "uPVC fascia and soffit replacement across West Yorkshire from Gutterworx, installed alongside seamless aluminium guttering or as a roofline project.", intro: "Protect exposed roof edges and give your property a neater, lower-maintenance finish with properly fitted fascias and soffits.", image: "project-fascia.jpg", why: "Fascias support the front edge of the roofline and provide the fixing surface for guttering. Soffits close the underside of the eaves. When either is damaged, poorly covered or deteriorating, water and pests can find routes into vulnerable areas.", bullets: ["Replacement uPVC fascia boards", "Vented or appropriate soffit arrangements", "Bargeboards and roofline finishing", "Guttering and downpipes coordinated with the new fascia", "Rotten or damaged roofline assessed before covering", "Colour choices discussed during quotation"], faq: [["Can you cap existing timber?", "The right approach depends on the condition of the timber. We inspect it first and will not recommend covering material that needs to be removed or repaired."],["Can fascia and soffit work be combined with seamless gutters?", "Yes. Combining the work often creates the most consistent finish and ensures the new gutter has a sound fixing surface."],["How do I get a price?", "Use the quote form and include the property type, approximate roofline length and photos if available. We will then arrange the next step."]] },
  "roof-repairs": { title: "Roof Repairs", desc: "Local roof repairs from Gutterworx across West Yorkshire, including leaks, slipped tiles, storm damage and roofline-related faults.", intro: "Targeted roofing work for leaks, storm damage and roofline defects discovered alongside guttering and fascia projects.", image: "project-roof-repair.jpg", why: "A leaking gutter is not always the only issue at the eaves. Slipped tiles, tired pointing, damaged underlay at the edge or poor previous repairs can all allow water to reach areas it should not. We assess the visible cause and explain the practical repair options.", bullets: ["Slipped or broken tile replacement", "Localised leak investigation", "Storm-damage repairs", "Pointing and roof-edge defects", "Roofline faults identified during gutter work", "Clear advice when a wider roofing specialist is needed"], faq: [["Do you provide emergency repairs?", "Contact us by phone or WhatsApp with photos and your location. Availability depends on existing work and safe access, but we will advise what is possible."],["Will you inspect the guttering too?", "Yes. Roof and gutter problems often interact, so we look at how water is reaching and leaving the roofline."],["Do you offer full re-roofs?", "Roofing services can be discussed, although seamless guttering, fascias and soffits remain our main focus. Send details and we will confirm whether the work is in scope."]] },
  "cut-and-drop": { title: "Cut & Drop Seamless Guttering", desc: "Trade cut and drop seamless guttering across West Yorkshire. Order 5-inch or 6-inch Ogee aluminium guttering formed on site by Gutterworx.", intro: "A flexible seamless gutter supply service for roofers, joiners, builders and other trade customers — available in 5-inch and 6-inch Ogee profiles.", image: "testimonial.jpg", why: "Cut and drop lets your team handle the installation while we provide the specialist roll-forming equipment and accurately formed aluminium lengths. Tell us the profile, total length, outlets, corners, colour, site address and preferred date using the dedicated fields on our quote form.", bullets: ["5-inch Ogee (127mm) option", "6-inch Ogee (152mm) option", "Continuous lengths formed for the job", "Suitable for roofers, joiners and builders", "Corners, outlets and colour captured at quotation", "Site or delivery details agreed in advance"], faq: [["What measurements do you need?", "Provide the required total length, individual run lengths if relevant, profile size, number and type of corners, outlets and site address. We will clarify anything else before confirming."],["Do you install cut and drop orders?", "The cut and drop option is intended for trade customers carrying out their own installation. If you want Gutterworx to install the system, choose Seamless Guttering on the quote form instead."],["Can I choose 5-inch or 6-inch Ogee?", "Yes. Both profiles are included as options in the trade quote form."]] },
  "roofing-services": { title: "Supporting Roofing Services", desc: "Supporting roofing services from Gutterworx across West Yorkshire, quoted alongside guttering, fascia and soffit work where appropriate.", intro: "Practical roofing support when a guttering or roofline project reveals related problems that should be put right.", image: "project-roof-repair.jpg", why: "Gutterworx is gutter, fascia and soffit focused. Roofing work is available where it complements that core service or where the project is a suitable fit. This keeps the recommendation centred on what the property actually needs.", bullets: ["Roof-edge and eaves repairs", "Tile and slate replacement", "Localised leak repairs", "Storm damage assessment", "Work coordinated with roofline replacement", "Honest confirmation when work falls outside our scope"], faq: [["Is roofing your main service?", "No. Seamless guttering, fascias and soffits are our main focus. Roofing work is a supporting service and is quoted when it is appropriate for the job."],["Can I still enquire about a roofing issue?", "Yes. Choose Roof Repair or Other Work or Enquiry on the form and include photos where possible."],["Which locations do you cover?", "We cover Wakefield, Leeds, Barnsley, Wetherby, Harrogate, Huddersfield, Halifax and Selby, plus surrounding areas by arrangement."]] }
};

for (const service of services) {
  const c = serviceContent[service.slug];
  const route = `services/${service.slug}/index.html`;
  const pageSchema = schemaFor("Service", { name: `${c.title} | Gutterworx`, url: `${baseUrl}/services/${service.slug}/`, serviceType: c.title, provider: { "@type": "HomeAndConstructionBusiness", name: "Gutterworx", telephone: `+44${phone.slice(1)}` } });
  write(route, doc({ route, current: "services", title: `${c.title} West Yorkshire | Gutterworx`, description: c.desc, schema: pageSchema, main: prefix => `${pageHero(prefix, c.title, c.intro, [{name:"Services",href:"services/"},{name:c.title}])}<section class="section"><div class="container split"><div class="prose"><p class="eyebrow">The service</p><h2>What to expect.</h2><p>${c.why}</p><h3>Included in the conversation</h3><ul>${c.bullets.map(item => `<li>${item}</li>`).join("")}</ul><div class="button-row"><a class="btn btn-red" href="${prefix}contact/?service=${service.slug}">Request a quote</a><a class="btn" href="https://wa.me/${whatsapp}" target="_blank" rel="noopener">Ask on WhatsApp</a></div></div><div class="image-card"><img src="${prefix}assets/images/${c.image}" alt="${c.title} work by Gutterworx" width="414" height="414"><div class="image-label">Gutterworx · ${c.title} · West Yorkshire and surrounding areas</div></div></div></section><section class="section panel-section"><div class="narrow"><div class="section-head"><p class="eyebrow">Questions</p><h2>${c.title} FAQs.</h2><hr class="rule"></div><div class="faq">${c.faq.map(([q,a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></div></section>${cta(prefix, `Get a quote for ${c.title.toLowerCase()}.`)}` }));
}

write("gallery/index.html", doc({ route: "gallery/index.html", current: "gallery", title: "Gutterworx Project Gallery | Guttering & Roofline Work", description: "View recent seamless guttering, fascia, soffit and roofline work completed by Gutterworx across Yorkshire.", main: prefix => `${pageHero(prefix, "Recent guttering and roofline work.", "A selection of seamless guttering, fascia and supporting roofline projects. Follow Gutterworx on Facebook for the latest updates.", [{name:"Our work"}])}<section class="section"><div class="container"><div class="gallery"><figure><img src="${prefix}assets/images/project-seamless.jpg" alt="Seamless aluminium guttering installed on brick property" width="414" height="414"><figcaption>Seamless gutter installation</figcaption></figure><figure><img src="${prefix}assets/images/project-fascia.jpg" alt="Black gutter and fascia installation" width="414" height="414"><figcaption>Fascia and gutter detail</figcaption></figure><figure><img src="${prefix}assets/images/project-roof-repair.jpg" alt="Gutter installation on stone property" width="414" height="414"><figcaption>Stone property roofline</figcaption></figure><figure><img src="${prefix}assets/images/testimonial.jpg" alt="Trade gutter forming equipment at work" width="414" height="414"><figcaption>Cut and drop preparation</figcaption></figure><figure><img src="${prefix}assets/images/seamless-install.jpg" alt="Close-up seamless Ogee guttering" width="414" height="414"><figcaption>Ogee aluminium profile</figcaption></figure><figure><img src="${prefix}assets/images/hero.jpg" alt="Black guttering on a residential property" width="333" height="333"><figcaption>Completed roofline</figcaption></figure></div><div class="button-row" style="margin-top:32px"><a class="btn btn-red" href="${prefix}contact/">Request a quote</a><a class="btn" href="${facebook}" target="_blank" rel="noopener">View Facebook</a></div></div></section>${cta(prefix)}` }));

write("areas/index.html", doc({ route: "areas/index.html", current: "areas", title: "Areas Covered | Gutterworx West Yorkshire", description: "Gutterworx covers Wakefield, Leeds, Barnsley, Wetherby, Harrogate, Huddersfield, Halifax, Selby and surrounding areas.", main: prefix => `${pageHero(prefix, "West Yorkshire and surrounding areas.", "We install seamless guttering, fascias and soffits and provide cut and drop trade supply across the eight areas below and nearby towns and villages.", [{name:"Areas"}])}<section class="section"><div class="container">${areaCards(prefix)}<div class="notice" style="margin-top:30px">Outside these locations? Send your postcode and project details. We can confirm whether your address is within the current working area.</div></div></section>${cta(prefix, "Ask whether we cover your postcode.")}` }));

for (const location of locations) {
  const route = `locations/${location.slug}/index.html`;
  const locationSchema = schemaFor("Service", { name: `Seamless Guttering in ${location.name}`, url: `${baseUrl}/locations/${location.slug}/`, serviceType: `Seamless guttering, fascias and soffits in ${location.name}`, areaServed: { "@type": "City", name: location.name } });
  write(route, doc({ route, current: "areas", title: `Seamless Guttering ${location.name} | Gutterworx`, description: `Seamless aluminium guttering, fascias, soffits, roof repairs and trade cut and drop in ${location.name} and surrounding areas. Request a free Gutterworx quote.`, schema: locationSchema, main: prefix => `${pageHero(prefix, `Seamless guttering in ${location.name}.`, `Made-to-measure aluminium guttering, fascias and soffits for properties in ${location.name}, ${location.county}, with trade cut and drop also available.`, [{name:"Areas",href:"areas/"},{name:location.name}])}<section class="section"><div class="container split"><div class="prose"><p class="eyebrow">Local roofline service</p><h2>Guttering built around the property.</h2><p>${location.local}</p><p>Gutterworx forms seamless guttering on site to the measured length of each run. Reducing repeated straight-line joints creates a cleaner appearance and removes many of the common weak points found in short sectional systems.</p><h3>Services available around ${location.name}</h3><ul><li>Seamless aluminium guttering installation</li><li>uPVC fascia and soffit replacement</li><li>Downpipes and rainwater outlet planning</li><li>Targeted roof and roofline repairs</li><li>5-inch and 6-inch Ogee cut and drop for trade customers</li></ul><p>We also cover ${location.nearby}. Send your postcode if you are unsure whether the property is within range.</p><div class="button-row"><a class="btn btn-red" href="${prefix}contact/">Request a ${location.name} quote</a><a class="btn" href="tel:${phone}">Call ${phoneDisplay}</a></div></div><div class="image-card"><img src="${prefix}assets/images/project-seamless.jpg" alt="Seamless guttering available in ${location.name}" width="414" height="414"><div class="image-label">Measured and formed for each roofline in ${location.name} and surrounding areas.</div></div></div></section><section class="section panel-section"><div class="container"><div class="section-head"><p class="eyebrow">Available services</p><h2>Roofline work in ${location.name}.</h2><hr class="rule"></div>${serviceCards(prefix, 4)}</div></section><section class="section"><div class="narrow"><div class="section-head"><p class="eyebrow">Common questions</p><h2>${location.name} FAQs.</h2><hr class="rule"></div><div class="faq"><details><summary>Do you provide free quotes in ${location.name}?</summary><p>Yes. Submit the property details and preferred service, and we will arrange the appropriate next step for a no-obligation quotation.</p></details><details><summary>Can trade customers order cut and drop locally?</summary><p>Yes. Choose Cut & Drop on the form and provide the 5-inch or 6-inch Ogee profile, lengths, corners, outlets, colour, address and preferred date.</p></details><details><summary>Can fascia and soffit work be included?</summary><p>Yes. We can assess and quote for the complete roofline, including fascias, soffits, gutters, outlets and downpipes.</p></details></div></div></section>${cta(prefix, `Need guttering in ${location.name}?`)}` }));
}

write("contact/index.html", doc({ route: "contact/index.html", current: "contact", title: "Request a Quote | Contact Gutterworx", description: `Request a free quote for seamless guttering, fascias and soffits, roof repairs or 5-inch and 6-inch Ogee cut and drop. Call Gutterworx on ${phoneDisplay}.`, main: prefix => `${pageHero(prefix, "Request a free quotation.", "Choose the work you need and tell us about the property. Cut and drop customers will see the additional trade fields automatically.", [{name:"Contact"}])}<section class="section quote"><div class="narrow">${quoteForm()}</div></section><section class="section-sm panel-section"><div class="container cards"><div class="card"><div class="card-icon">☎</div><h3>Call</h3><p>Speak directly about the job.</p><a class="text-link" href="tel:${phone}">${phoneDisplay}</a></div><div class="card"><div class="card-icon">WA</div><h3>WhatsApp</h3><p>Send project details and photos.</p><a class="text-link" href="https://wa.me/${whatsapp}" target="_blank" rel="noopener">Start a chat →</a></div><div class="card"><div class="card-icon">f</div><h3>Facebook</h3><p>See recent Gutterworx updates.</p><a class="text-link" href="${facebook}" target="_blank" rel="noopener">Visit Facebook →</a></div></div></section>` }));

write("privacy/index.html", doc({ route: "privacy/index.html", title: "Privacy Notice | Gutterworx", description: "How Gutterworx handles personal information submitted through this website, by phone, email or WhatsApp.", main: prefix => `${pageHero(prefix, "Privacy notice.", "How personal information is used when you contact Gutterworx or submit a quote request.", [{name:"Privacy"}])}<section class="section"><article class="narrow prose"><p><strong>Last updated:</strong> 13 July 2026</p><h2>Information we collect</h2><p>When you request a quote we may collect your name, phone number, email address, postcode, project address, service requirements and any other details or photographs you choose to provide.</p><h2>How we use it</h2><p>We use this information to respond to the enquiry, assess the requested work, prepare or discuss a quotation, arrange visits and keep reasonable records of customer communications.</p><h2>Forms and service providers</h2><p>This website is hosted by Netlify. Form submissions are processed through Netlify Forms and are made available to Gutterworx for responding to the enquiry. If you contact us through WhatsApp, Facebook or email, those providers process the communication under their own privacy terms.</p><h2>Sharing and retention</h2><p>We do not sell personal information. Details may be shared with a service provider only where reasonably necessary to operate the website, communicate with you or carry out the requested work. Enquiry records are retained only as long as reasonably needed for business, legal and accounting purposes.</p><h2>Your choices</h2><p>You can ask what personal information is held about you, request a correction or ask for information to be deleted where there is no legal reason to retain it.</p><h2>Contact</h2><p>For a privacy request, email <a href="mailto:${email}">${email}</a> or call <a href="tel:${phone}">${phoneDisplay}</a>.</p></article></section>` }));

write("thank-you/index.html", doc({ route: "thank-you/index.html", title: "Thank You | Gutterworx", description: "Your Gutterworx quote request has been sent.", noindex: true, main: prefix => `<section class="page-hero" style="min-height:70vh;display:grid;align-items:center"><div class="narrow"><p class="eyebrow">Message sent</p><h1>Thanks — we’ll be in touch.</h1><p class="lead">Your quote request has been received. If the job is urgent, call ${phoneDisplay} or send a WhatsApp message.</p><div class="button-row"><a class="btn btn-red" href="tel:${phone}">Call now</a><a class="btn" href="${prefix}">Back to home</a></div></div></section>` }));

write("404.html", doc({ route: "404.html", title: "Page Not Found | Gutterworx", description: "The requested Gutterworx page could not be found.", noindex: true, main: prefix => `<section class="page-hero" style="min-height:70vh;display:grid;align-items:center"><div class="narrow"><p class="eyebrow">404 · Page not found</p><h1>That page has moved.</h1><p class="lead">Use the links below to return to the main site or request a quote.</p><div class="button-row"><a class="btn btn-red" href="${prefix}">Home</a><a class="btn" href="${prefix}contact/">Request a quote</a></div></div></section>` }));

const sitemapRoutes = ["", "about/", "services/", ...services.map(s => `services/${s.slug}/`), "gallery/", "areas/", ...locations.map(l => `locations/${l.slug}/`), "contact/", "privacy/"];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map(route => `  <url><loc>${baseUrl}/${route}</loc><lastmod>2026-07-13</lastmod><changefreq>${route === "" ? "weekly" : "monthly"}</changefreq><priority>${route === "" ? "1.0" : route.startsWith("locations/") || route.startsWith("services/") ? "0.8" : "0.7"}</priority></url>`).join("\n")}\n</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /thank-you/\nSitemap: ${baseUrl}/sitemap.xml\n`);
write("site.webmanifest", JSON.stringify({ name: "Gutterworx", short_name: "Gutterworx", start_url: "/", display: "standalone", background_color: "#050505", theme_color: "#050505" }, null, 2));

for (const file of fs.readdirSync(root, { recursive: true }).filter(file => file.endsWith(".html"))) {
  const full = path.join(root, file);
  const parts = fs.readFileSync(full, "utf8").split(/(<script type="application\/ld\+json">[\s\S]*?<\/script>)/g);
  const cleaned = parts.map(part => part.startsWith('<script type="application/ld+json">') ? part : part
    .replace(/&(?![a-zA-Z0-9#]+;)/g, "&amp;")
    .replaceAll(phoneDisplay, "07811 367556")
    .replace('class="button-row" style="justify-content:center;margin-top:34px"', 'class="button-row actions-center"')
    .replace('class="button-row" style="margin-top:28px"', 'class="button-row actions-spaced"')
    .replace('class="button-row" style="margin-top:32px"', 'class="button-row actions-spaced"')
    .replace('class="notice" style="margin-top:30px"', 'class="notice notice-spaced"')
    .replace('class="page-hero" style="min-height:70vh;display:grid;align-items:center"', 'class="page-hero empty-state-hero"')
  ).join("");
  fs.writeFileSync(full, cleaned);
}

console.log(`Generated ${sitemapRoutes.length + 2} HTML routes plus sitemap and robots.txt.`);
