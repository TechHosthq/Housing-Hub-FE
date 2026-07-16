Housing Hub — Landing Page Design Review
Figma design vs. live build — feedback for Precious
1. Hero Section
1. Search bar filters (main issue)
In the design, each filter (Location, Property Type, Price Range, Bedrooms) is just one line of text with a
dropdown arrow — like "Location ".⌄
In the build, a small label has been added on top ("LOCATION") with "Select" in bold underneath —
making it two lines instead of one. Please remove the extra label and match the single-line style from
Figma.
2. Search bar size
Because of the extra label above, the search bar is taller and bigger than it should be. Once point 1 is
fixed, it should naturally shrink back to match the design.
3. Headline text weight
"Find Homes in Nigeria" looks bolder/heavier in the build than in the design. Please check the font weight
being used and match it to the Figma file — it should look lighter, not this heavy.
4. Spacing around the hero text
There is more empty space above and below the headline/search bar in the build compared to Figma.
Please tighten this up to match the design proportions.
2. Properties Grid Section
1. Missing second row and pagination
The design shows 6 properties in 2 rows of 3, plus pagination (page 1, 2) at the bottom. The build
currently shows only 3 properties in one row. Please add the second row and the pagination control.
2. Badge wording is different
Design uses "New" and "Recommended" tags on the property cards. The build uses "VERIFIED" on all
cards instead. Please switch back to "New" / "Recommended" as shown in Figma — unless this was an
intentional product decision, worth confirming first.
3. Bed/Bath label style
Design shows "3 Bedrooms" and "2 Bathrooms" written out in full. The build shows the shortened "4
Bed" and "1 Bath". Please spell it out fully to match Figma.
3. Property Card — Style & Layout
1. Image placement/cropping
In Figma, the property image fills the card cleanly and shows the full front of the house in frame. In the
build, the image is zoomed in/cropped differently. Please adjust the image container so it crops/positions
the photo the same way as Figma — check the object-fit/positioning settings.
2. Badge shape and placement
In Figma, the badge ("New"/"Recommended") is a small pill sitting at the top-left corner, closely fitted to
the text. In the build, the "VERIFIED" badge is wider and more rounded, and sits slightly differently.
Please match the badge's size, padding, and corner radius to Figma.
3. Font weight — property title
In Figma, the property name ("Javeele House") is in a medium/semi-bold weight. In the build, the
property names look bolder/heavier than the design. Please reduce the font weight to match.
4. Font weight & color — price
In Figma, the price is bold but a lighter shade of blue. In the build, the price appears in a darker, heavier
blue and slightly bolder. Please match the exact color and weight from the Figma style.
5. Bed/Bath tag styling
In Figma, the bed/bath info sits as a plain row with icons, no background. In the build, they're wrapped in
light grey pill backgrounds — this wasn't in the design. Please remove the grey background and match the
flat style from Figma.
4. "How Housing Hub Works" Section
1. Missing hover state on step cards
In Figma, when a user hovers over any of the 4 step cards, that card gets a blue border/background
highlight, then returns to the plain grey style when the mouse moves away. In the build, there is currently
no hover interaction on the step cards — they stay static regardless of mouse position. Please add this
hover state (blue border/background) to each card.
2. Image container shape
In Figma, the image placeholder on the left is a clean square block. In the build, the illustrated image
(magnifying glass over house) sits in a container that's taller and narrower than the design's proportions.
Please adjust the image container's width/height ratio to match Figma's square shape.
3. Card spacing between steps
In Figma, there's tighter, even spacing between all 4 step cards. In the build, the spacing looks slightly
larger/uneven, especially around Step 1. Please align the vertical gaps to match Figma exactly.
4. Font weight — step titles
In Figma, titles like "Browse & Search" are semi-bold. In the build, titles like "View Property Details"
look slightly bolder/heavier. Please match the exact weight.
5. "Are You a Homeowner?" Section
1. Subtext wrapping
In Figma, "List your property and connect with verified buyers and renters" fits on one line. In the build,
the same text wraps to two lines — the text container is narrower than it should be. Please widen the text
block so it stays on one line.
Aside from this, the layout, image, and buttons ("List Your Property" / "Learn More") all match well in
position, color, and style — no other changes needed here.
6. Footer Section
1. Logo casing
In Figma, the footer logo reads "Housing hub" — with a lowercase "h" in "hub." In the build, it reads
"Housing Hub" — capital "H" in "Hub." Please match the casing exactly as designed.
2. Logo spacing
In Figma, there's more breathing room between the logo icon and the "Housing hub" text. In the build, the
icon and text are sitting too close together — the spacing is tighter than the design. Please increase the
gap between the icon and the text to match Figma.
3. Link columns
Figma shows 4 links per column under "For Customers," "For Homeowners," and "Support" (e.g. also
"Track Status," "Profile & KYC," "Inspection Requests," "KYC Verification," "Terms of Service,"
"Privacy Policy"). Please double check the full footer in the live build to confirm all links are present and
match Figma's list exactly.
7. Navigation Issues
1. "List Properties" and "Browse Homes" tabs
Both the "List Properties" and "Browse Homes" nav links are currently redirecting to the sign-in screen.
These should take the user to their intended pages (property listing flow and browse/search results)
instead of forcing a login first. Please check the routing/links for both.
8. Registration Screen (Sign Up)
1. Phone number input dropdown
The phone number input box currently has a country-code dropdown attached to it. Please remove this
dropdown.
2. Customer type options
The "customer type" selection should include: a) Buyer/Renter, b) Homeowner, c) Agent. Please confirm
all three options are present and correctly labeled on the registration screen.
3. "Continue with Google" font weight
The "Continue with Google" button text is too bold. Please change it to use the regular (non-bold) font
weight.
4. Email verification not working
Email verification is currently not working — the verification email cannot be confirmed, and it's also
landing in spam instead of the inbox. Please check the email verification flow and sender configuration to
fix deliverability.
5. Shadow behind buttons (global)
There's a drop shadow behind buttons across the entire design (not just this screen). Please remove this
shadow from all buttons site-wide.
