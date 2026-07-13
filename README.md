# Gutterworx

Production static website for Gutterworx, serving West Yorkshire and surrounding areas.

## Stack

- Plain semantic HTML
- One shared CSS file
- One small vanilla JavaScript file for the mobile menu and conditional quote fields
- Netlify Forms for quote enquiries
- No package manager, dependencies, build command or generated runtime

## Approved design source

The saved homepage preview at `https://madereal-websites-admin.netlify.app/preview.html?id=gutterworx` is the visual source of truth. Production pages must retain its centred cinematic hero, Oswald typography, glass navigation, black/red palette, service-card treatment, gallery structure and contact styling.

## Pages

- Standard: Home, About, Services, Gallery, Areas, Contact, Privacy
- Services: Seamless Guttering, Fascias & Soffits, Roof Repairs, Cut & Drop, Roofing Services
- Locations: Wakefield, Leeds, Barnsley, Wetherby, Harrogate, Huddersfield, Halifax, Selby

## Local preview

Serve the folder with any static file server, for example:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment

Netlify publishes the repository root. There is no build command. Pushes to the GitHub `main` branch trigger Netlify production deployment automatically.

The quote form is detected and processed by Netlify Forms. Submissions redirect to `/thank-you/`.
