import fs from 'fs';
import path from 'path';

// Complete curated seed for 200 books
const BOOKS = [
  // ARCHITECTURE & DESIGN (30)
  {
    title: 'Form & Void',
    subtitle: 'A Study in Architectural Space and Quiet Geometry',
    author: 'Sarah L. Jensen',
    authorBio: 'Sarah L. Jensen is a Danish architect, spatial theorist, and former visiting fellow at ETH Zurich.',
    coverImage: '/src/assets/images/book_cover_form_void_1792609936178.jpg',
    category: 'Architecture & Design',
    rating: 4.9,
    pages: 348,
    publishedYear: 2024,
    publisher: 'Lund & Vinter Press',
    isbn: '978-0-984210-41-2',
    summary: 'A seminal treatise on tectonic restraint, spatial rhythm, and the emotional resonance of empty volumes.',
    quote: 'Architecture does not begin when walls are raised, but when the void between them is invited to breathe.',
    tags: ['Architecture', 'Minimalism', 'Space', 'Design Theory'],
    featured: true,
    edition: 'First Clothbound Edition'
  },
  {
    title: 'The Zen Garden',
    subtitle: 'A Journey into Minimalist Landscape Architecture',
    author: 'Elena Tanaka',
    authorBio: 'Elena Tanaka is a landscape designer and scholar of Japanese temple gardens based in Kyoto.',
    coverImage: '/src/assets/images/book_cover_zen_garden_1792610457442.jpg',
    category: 'Architecture & Design',
    rating: 4.9,
    pages: 296,
    publishedYear: 2025,
    publisher: 'Kyoto University Press',
    isbn: '978-4-87698-314-2',
    summary: 'An exploration of stone placement, raked gravel dry streams, and moss ecology in Muromachi-period gardens.',
    quote: 'In the arrangement of three uncarved stones lies the entire cosmology of mountains and oceans.',
    tags: ['Landscape', 'Zen', 'Japan', 'Minimalism', 'Nature'],
    featured: true,
    edition: 'Collector’s Linen Hardcover'
  },
  {
    title: 'The Typographic Grid',
    subtitle: 'Systematic Design in Modern Swiss & International Typography',
    author: 'Dieter Meier & Beatrice Warde',
    authorBio: 'Dieter Meier is a Zurich-based typographer and educator with over four decades of practice.',
    coverImage: '',
    category: 'Architecture & Design',
    rating: 4.8,
    pages: 280,
    publishedYear: 2023,
    publisher: 'Niggli Editions',
    isbn: '978-3-7212-0850-5',
    summary: 'The ultimate visual manual on modular grid systems, baseline rhythms, asymmetric margins, and typographic hierarchy.',
    quote: 'The grid does not restrict creative thought; it establishes the invisible gravitational field in which ideas dance.',
    tags: ['Typography', 'Swiss Style', 'Graphic Design', 'Grid Systems']
  },
  {
    title: 'Toward a New Architecture',
    subtitle: 'Guiding Principles of Modern Tectonics',
    author: 'Le Corbusier',
    authorBio: 'Charles-Édouard Jeanneret, known as Le Corbusier, was a pioneer of modern architecture.',
    category: 'Architecture & Design',
    rating: 4.7,
    pages: 320,
    publishedYear: 1986,
    publisher: 'Dover Architecture',
    isbn: '978-0-486-25023-6',
    summary: 'The foundational manifesto advocating for the machine-age house, mass production logic, and pure geometric volumes.',
    quote: 'A house is a machine for living in; its beauty arises from its ruthless fitness for human purpose.',
    tags: ['Modernism', 'Manifesto', 'Urbanism', 'Classics']
  },
  {
    title: 'The Eyes of the Skin',
    subtitle: 'Architecture and the Senses',
    author: 'Juhani Pallasmaa',
    authorBio: 'Juhani Pallasmaa is a Finnish architect, professor, and former dean at Helsinki University of Technology.',
    category: 'Architecture & Design',
    rating: 4.9,
    pages: 128,
    publishedYear: 2012,
    publisher: 'John Wiley & Sons',
    isbn: '978-0-470-01578-0',
    summary: 'A critique of visual ocularcentrism in modern design, urging architects to engage touch, sound, smell, and tactile memory.',
    quote: 'Every touching experience of architecture is multi-sensory; qualities of matter, space, and scale are measured equally by the eye and body.',
    tags: ['Phenomenology', 'Senses', 'Nordic', 'Materials']
  },
  {
    title: 'Complexity and Contradiction in Architecture',
    subtitle: 'A Gentle Manifesto for Non-Straightforward Design',
    author: 'Robert Venturi',
    authorBio: 'Robert Venturi was an American architect and Pritzker Architecture Prize laureate.',
    category: 'Architecture & Design',
    rating: 4.6,
    pages: 136,
    publishedYear: 2002,
    publisher: 'The Museum of Modern Art',
    isbn: '978-0-87070-282-2',
    summary: 'A witty, profound call for richness of meaning rather than clarity of form, welcoming ambiguity and historical dialogue.',
    quote: 'I am for messy vitality over obvious unity. Less is not more; less is a bore.',
    tags: ['Postmodernism', 'Theory', 'MoMA', 'History']
  },
  {
    title: 'A Pattern Language',
    subtitle: 'Towns, Buildings, Construction',
    author: 'Christopher Alexander',
    authorBio: 'Christopher Alexander was an Austrian-born architect, design theorist, and Berkeley professor.',
    category: 'Architecture & Design',
    rating: 4.9,
    pages: 1171,
    publishedYear: 1977,
    publisher: 'Oxford University Press',
    isbn: '978-0-19-501919-3',
    summary: '253 interconnected archetypal patterns for designing human environments, from regional networks down to alcoves and light from two sides.',
    quote: 'Towns and buildings will not become able to give people alive feeling until they are created by all the people in society.',
    tags: ['Patterns', 'Urbanism', 'Community', 'Human Scale']
  },
  {
    title: 'In Praise of Shadows',
    subtitle: 'Essays on Japanese Aesthetics and Domestic Light',
    author: 'Junichiro Tanizaki',
    authorBio: 'Junichiro Tanizaki was one of modern Japan’s most influential novelists and aesthetic critics.',
    category: 'Architecture & Design',
    rating: 4.8,
    pages: 96,
    publishedYear: 2001,
    publisher: 'Vintage Classics',
    isbn: '978-0-09-928357-7',
    summary: 'A luminous meditation on lacquerware, paper screens, dim eaves, and the beauty that emerges in twilight and obscurity.',
    quote: 'We find beauty not in the thing itself but in the patterns of shadows, the light and the darkness, that one thing against another creates.',
    tags: ['Japanese Aesthetics', 'Light', 'Shadow', 'Culture']
  },
  {
    title: 'The Poetics of Space',
    subtitle: 'The Classic Look at How We Experience Intimate Places',
    author: 'Gaston Bachelard',
    authorBio: 'Gaston Bachelard was a French philosopher and member of the Académie des Sciences Morales et Politiques.',
    category: 'Architecture & Design',
    rating: 4.8,
    pages: 272,
    publishedYear: 2014,
    publisher: 'Penguin Classics',
    isbn: '978-0-14-310752-1',
    summary: 'A poetic investigation into attics, cellars, drawers, chests, and nests as psychic shelters for daydreams and memory.',
    quote: 'The house shelters daydreaming, the house protects the dreamer, the house allows one to dream in peace.',
    tags: ['Phenomenology', 'Home', 'Poetry', 'Memory']
  },
  {
    title: 'Thermal Delight in Architecture',
    subtitle: 'Microclimate and the Human Spirit',
    author: 'Lisa Heschong',
    authorBio: 'Lisa Heschong is a licensed architect and fellow of the Illuminating Engineering Society.',
    category: 'Architecture & Design',
    rating: 4.7,
    pages: 104,
    publishedYear: 1979,
    publisher: 'The MIT Press',
    isbn: '978-0-262-58039-7',
    summary: 'An exploration of fireplaces, courtyards, verandahs, and saunas, showing how thermal shifts enrich human culture and rituals.',
    quote: 'Thermal comfort is not simply the absence of thermal pain, but the presence of dynamic sensory joy.',
    tags: ['Climate', 'Sensory', 'Comfort', 'Energy']
  },
  {
    title: 'Delirious New York',
    subtitle: 'A Retroactive Manifesto for Manhattan',
    author: 'Rem Koolhaas',
    authorBio: 'Rem Koolhaas is a Dutch architect, urban theorist, founder of OMA, and Pritzker laureate.',
    category: 'Architecture & Design',
    rating: 4.8,
    pages: 318,
    publishedYear: 1994,
    publisher: 'The Monacelli Press',
    isbn: '978-1-885254-00-9',
    summary: 'A breathtaking retroactive manifesto celebrating Manhattan’s culture of congestion, elevators, gridblocks, and synthetic fantasy.',
    quote: 'Manhattanism is the one urbanistic ideology that has fed from its inception on the splendors and miseries of the metropolitan condition.',
    tags: ['Urbanism', 'New York', 'Skyscrapers', 'Culture']
  },
  {
    title: 'Thinking Architecture',
    subtitle: 'Personal Meditations on Craft and Atmosphere',
    author: 'Peter Zumthor',
    authorBio: 'Peter Zumthor is a Swiss architect known for the Therme Vals and recipient of the 2009 Pritzker Architecture Prize.',
    category: 'Architecture & Design',
    rating: 4.9,
    pages: 112,
    publishedYear: 2010,
    publisher: 'Birkhäuser',
    isbn: '978-3-0346-0585-4',
    summary: 'A reverent collection of essays on childhood sensory memories, mountain stone, hand-sawn timber, and architectural presence.',
    quote: 'Architecture is not about form or construction; it is about feelings, memory, and presence.',
    tags: ['Craft', 'Materials', 'Swiss', 'Atmosphere']
  },
  {
    title: 'Atmospheres',
    subtitle: 'Architectural Environments and Surrounding Things',
    author: 'Peter Zumthor',
    authorBio: 'Peter Zumthor is a Swiss master builder celebrated for his tactile and atmospheric architecture.',
    category: 'Architecture & Design',
    rating: 4.9,
    pages: 76,
    publishedYear: 2006,
    publisher: 'Birkhäuser',
    isbn: '978-3-7643-7495-2',
    summary: 'Nine chapters exploring the body of architecture, material compatibility, sound of a room, temperature, and intimacy.',
    quote: 'We perceive atmosphere through our emotional sensibility—a form of perception that works incredibly quickly.',
    tags: ['Atmosphere', 'Sensory', 'Tectonics']
  },
  {
    title: 'Design as Art',
    subtitle: 'Visual Language, Industrial Objects, and Graphic Play',
    author: 'Bruno Munari',
    authorBio: 'Bruno Munari was an Italian artist, graphic designer, and inventor who contributed to the Futurist movement.',
    category: 'Architecture & Design',
    rating: 4.8,
    pages: 224,
    publishedYear: 2008,
    publisher: 'Penguin Modern Classics',
    isbn: '978-0-14-103581-9',
    summary: 'Playful yet profound essays connecting road signs, typography, lamps, and packaging with democratic visual communication.',
    quote: 'Progress means simplifying, not complicating. To eliminate what does not work is the real secret of design.',
    tags: ['Italian Design', 'Simplicity', 'Graphics', 'Objects']
  },
  {
    title: 'Interaction of Color',
    subtitle: 'New Expanded Edition on Color Perception',
    author: 'Josef Albers',
    authorBio: 'Josef Albers was a Bauhaus master and Yale educator who redefined color pedagogy in the 20th century.',
    category: 'Architecture & Design',
    rating: 4.9,
    pages: 208,
    publishedYear: 2013,
    publisher: 'Yale University Press',
    isbn: '978-0-300-17935-4',
    summary: 'The masterwork on color deception, simultaneous contrast, transparency illusion, and vibrating boundaries.',
    quote: 'In visual perception a color is almost never seen as it really is. This fact makes color the most relative medium in art.',
    tags: ['Color', 'Bauhaus', 'Perception', 'Theory']
  },
  {
    title: 'Grid Systems in Graphic Design',
    subtitle: 'A Visual Communication Manual for Graphic Designers',
    author: 'Josef Müller-Brockmann',
    authorBio: 'Josef Müller-Brockmann was a pioneer of the International Typographic Style in Switzerland.',
    category: 'Architecture & Design',
    rating: 4.9,
    pages: 176,
    publishedYear: 1996,
    publisher: 'Niggli',
    isbn: '978-3-7212-0145-2',
    summary: 'The seminal textbook establishing 8-to-32 field grid divisions, baseline registers, and modular proportion rules.',
    quote: 'The use of the grid system implies the will to systematize, to clarify, to penetrate to the essentials, to concentrate.',
    tags: ['Swiss Style', 'Typography', 'System', 'Layout']
  },
  {
    title: 'The Architecture of the City',
    subtitle: 'Urban Memory and Collective Artifacts',
    author: 'Aldo Rossi',
    authorBio: 'Aldo Rossi was an Italian architect and architectural theorist who was the first Italian to receive the Pritzker Prize.',
    category: 'Architecture & Design',
    rating: 4.7,
    pages: 204,
    publishedYear: 1984,
    publisher: 'The MIT Press',
    isbn: '978-0-262-68043-1',
    summary: 'A study of urban monuments as permanent nodes around which collective memory and civic identity accrue over centuries.',
    quote: 'The city is the locus of the collective memory. This relationship between the locus and the citizenry becomes its history.',
    tags: ['Urbanism', 'Memory', 'Monuments', 'Italy']
  },
  {
    title: 'Built: The Hidden Stories Behind Our Structures',
    subtitle: 'Engineering Marvels and Human Resolve',
    author: 'Roma Agrawal',
    authorBio: 'Roma Agrawal MBE is a structural engineer who worked on the design of the Shard skyscraper in London.',
    category: 'Architecture & Design',
    rating: 4.7,
    pages: 320,
    publishedYear: 2018,
    publisher: 'Bloomsbury Publishing',
    isbn: '978-1-4088-7036-5',
    summary: 'An engaging journey through mud bricks, hand-mixed concrete, suspension cables, and the invisible forces holding buildings upright.',
    quote: 'Every skyscraper is a quiet conversation between gravity, bedrock, and human imagination.',
    tags: ['Engineering', 'Structures', 'Materials', 'Skyscrapers']
  },
  {
    title: 'Nordic Timber Architecture',
    subtitle: 'Joinery, Grain, and Vernacular Craft in Scandinavia',
    author: 'Henrik Vanger & Soren Kjaer',
    authorBio: 'Henrik Vanger is a master timber builder and professor at the Royal Danish Academy.',
    category: 'Architecture & Design',
    rating: 4.8,
    pages: 310,
    publishedYear: 2024,
    publisher: 'Nordic Craft Press',
    isbn: '978-87-93740-12-8',
    summary: 'Detailed studies of traditional pine lap-joints, tar-shingle cladding, and mass-timber acoustics in boreal latitudes.',
    quote: 'Timber does not freeze the eye; it absorbs sound and keeps the room warm with the resin of vanished summers.',
    tags: ['Timber', 'Nordic', 'Craft', 'Joinery']
  },
  {
    title: 'The Courtyard Monograph',
    subtitle: 'Inverted Sanctuaries and Microclimates in Domestic Space',
    author: 'Helena Berg',
    authorBio: 'Helena Berg is a Mediterranean architectural historian based in Seville.',
    category: 'Architecture & Design',
    rating: 4.8,
    pages: 264,
    publishedYear: 2023,
    publisher: 'Iberia Architectural Editions',
    isbn: '978-84-12093-18-4',
    summary: 'An examination of Roman atriums, Islamic riads, and modern Mexican courtyards as acoustic and private sanctuaries.',
    quote: 'A courtyard turns the architecture inward, substituting the sky for the street.',
    tags: ['Courtyards', 'Sanctuary', 'Light', 'Mediterranean']
  },
  {
    title: 'Monolithic Concrete',
    subtitle: 'Formwork, Texture, and Spatial Weight',
    author: 'Marcus Richter',
    authorBio: 'Marcus Richter is a structural architect working across Berlin and Basel.',
    category: 'Architecture & Design',
    rating: 4.7,
    pages: 288,
    publishedYear: 2024,
    publisher: 'Edition Detail',
    isbn: '978-3-95553-512-4',
    summary: 'Techniques of board-marked concrete, aggregate selection, and water-curing for enduring monolithic forms.',
    quote: 'Concrete is liquid stone; its memory is the exact grain of the timber boards that contained it.',
    tags: ['Concrete', 'Brutalism', 'Tectonics', 'Materials']
  },
  {
    title: 'Parametric Horizons',
    subtitle: 'Computational Geometry and Algorithmic Tectonics',
    author: 'David Silver & Patrick Schuster',
    authorBio: 'David Silver researches algorithmic form-finding and robotic fabrication at the Bartlett School of Architecture.',
    category: 'Architecture & Design',
    rating: 4.6,
    pages: 350,
    publishedYear: 2025,
    publisher: 'Routledge Computational',
    isbn: '978-0-367-48291-7',
    summary: 'How non-Euclidean curvature and multi-variable optimization algorithms allow structures to distribute stress like biological bone.',
    quote: 'The algorithm does not replace the hand; it extends mathematics into physical equilibrium.',
    tags: ['Computational', 'Parametric', 'Fabrication', 'Geometry']
  },
  {
    title: 'Japanese Timber Carpentry',
    subtitle: 'Kigumi Interlocking Joints Without Nails',
    author: 'Kenzo Mori',
    authorBio: 'Kenzo Mori is a third-generation temple carpenter (Miyadaiku) from Nara, Japan.',
    category: 'Architecture & Design',
    rating: 4.9,
    pages: 240,
    publishedYear: 2023,
    publisher: 'Tankosha Publishing',
    isbn: '978-4-473-04281-1',
    summary: 'A photographic compendium of mortise-and-tenon, kanawa-tsugi, and shihō-kama-tsugi joints that withstand seismic tremors.',
    quote: 'A joint made of living wood moves with the moisture of the seasons, gaining strength with the centuries.',
    tags: ['Japan', 'Woodworking', 'Carpentry', 'Craft']
  },
  {
    title: 'The City as a Work of Art',
    subtitle: 'London, Paris, Vienna in the 19th Century',
    author: 'Donald J. Olsen',
    authorBio: 'Donald J. Olsen was an eminent urban historian and professor at Vassar College.',
    category: 'Architecture & Design',
    rating: 4.8,
    pages: 360,
    publishedYear: 1988,
    publisher: 'Yale University Press',
    isbn: '978-0-300-03770-8',
    summary: 'A magnificent study of how three imperial capitals created grand boulevards, residential squares, and public theaters.',
    quote: 'The city was conceived not simply as an agglomeration of conveniences, but as an aesthetic artifact of civic virtue.',
    tags: ['Urban History', 'Europe', 'Boulevards', 'Paris']
  },
  {
    title: 'The Crystal Goblet',
    subtitle: 'Sixteen Essays on Typography and Clear Vision',
    author: 'Beatrice Warde',
    authorBio: 'Beatrice Warde was an American typographer, marketing manager for the Monotype Corporation, and scholar.',
    category: 'Architecture & Design',
    rating: 4.8,
    pages: 220,
    publishedYear: 1956,
    publisher: 'The Sylvan Press',
    isbn: '978-0-8230-0792-9',
    summary: 'The classic defense of typographic transparency: typography should be like a crystal goblet, revealing the vintage without distortion.',
    quote: 'Type well used is invisible as type, just as the perfect talking voice is the unnoticed vehicle for the transmission of words.',
    tags: ['Typography', 'Essays', 'Printing', 'Clarity']
  },
  {
    title: 'Spatial Acoustic Design',
    subtitle: 'Reverberation, Absorption, and Sonic Atmosphere in Rooms',
    author: 'Clara Lindqvist & Henrik Blom',
    authorBio: 'Clara Lindqvist is an acoustician who has engineered concert halls and recording spaces across Northern Europe.',
    category: 'Architecture & Design',
    rating: 4.7,
    pages: 312,
    publishedYear: 2024,
    publisher: 'Birkhäuser Sound',
    isbn: '978-3-0356-2184-7',
    summary: 'From whispering galleries to acoustic diffusers, exploring how spatial geometry conditions speech, music, and quietness.',
    quote: 'We hear a room before we understand its dimensions; the reverberation is the sonic skin of the building.',
    tags: ['Acoustics', 'Sound', 'Space', 'Sensory']
  },
  {
    title: 'Vernacular Craft & Local Clay',
    subtitle: 'Terracotta, Cob, and Earthen Architecture',
    author: 'Tessa Holloway',
    authorBio: 'Tessa Holloway is an earthen architect and conservationist specializing in unbaked clay structures.',
    category: 'Architecture & Design',
    rating: 4.7,
    pages: 256,
    publishedYear: 2024,
    publisher: 'Green Tectonic Press',
    isbn: '978-1-912248-31-0',
    summary: 'A manual on rammed earth, lime mortars, adobe bricks, and their superior hygroscopic regulation in residential environments.',
    quote: 'Earth underfoot has always been the roof overhead; returning to clay is a return to physiological sanity.',
    tags: ['Earth', 'Vernacular', 'Sustainability', 'Materials']
  },
  {
    title: 'Bauhaus Reconsidered',
    subtitle: 'Workshops, Masters, and the Synthesis of Arts',
    author: 'Walter Gropius & Frank Whitford',
    authorBio: 'Frank Whitford was an art historian and former tutor at the Royal College of Art, London.',
    category: 'Architecture & Design',
    rating: 4.8,
    pages: 216,
    publishedYear: 1984,
    publisher: 'Thames & Hudson',
    isbn: '978-0-500-20193-0',
    summary: 'A critical reassessment of the Weimar and Dessau experiments combining weaving, metalwork, carpentry, and architecture.',
    quote: 'Art cannot be taught, but craft can. Architects, sculptors, painters: we all must return to the workshop.',
    tags: ['Bauhaus', 'Germany', 'Craft', 'Modernism']
  },
  {
    title: 'Collaged Cities & Urban Memory',
    subtitle: 'Fragments, Palimpsests, and Historical Stratigraphy',
    author: 'Aurelia Lind',
    authorBio: 'Aurelia Lind is a theorist of architectural archaeology at the Bartlett, University College London.',
    category: 'Architecture & Design',
    rating: 4.8,
    pages: 290,
    publishedYear: 2025,
    publisher: 'Archival Urbanism',
    isbn: '978-1-914902-14-3',
    summary: 'How ancient foundations, forgotten canals, and repurposed railway viaducts give contemporary cities their emotional depth.',
    quote: 'Every great city is an open-air palimpsest where the past refuses to be completely paved over.',
    tags: ['Urbanism', 'Memory', 'History', 'London']
  },
  {
    title: 'The Staircase: History and Tectonics',
    subtitle: 'Ascent, Spiral Rhythms, and Structural Balustrades',
    author: 'John Templer',
    authorBio: 'John Templer was Regents Professor of Architecture at the Georgia Institute of Technology.',
    category: 'Architecture & Design',
    rating: 4.8,
    pages: 288,
    publishedYear: 1995,
    publisher: 'The MIT Press',
    isbn: '978-0-262-70054-2',
    summary: 'The definitive two-volume study on the symbolic, anatomical, and mechanical marvel of human stairs.',
    quote: 'A flight of steps is a sculpture through which the human body moves vertically with rhythm and drama.',
    tags: ['Stairs', 'Tectonics', 'Anatomy', 'Space']
  }
];

// PHILOSOPHY (30)
const PHILO_TITLES = [
  { t: 'Meditations on Time', st: 'A Philosophical Exploration of the Present, Past, and Future', a: 'Marcus Aurelius Augustus', y: 2024, p: 320, img: '/src/assets/images/book_cover_meditations_time_1792609937161.jpg', feat: true },
  { t: 'Solitude & Silence', st: 'The Hermetic Tradition from Montaigne to Thoreau', a: 'Kiran Patel', y: 2023, p: 310 },
  { t: 'Letters from a Stoic', st: 'Epistulae Morales ad Lucilium', a: 'Lucius Annaeus Seneca', y: 1969, p: 256 },
  { t: 'Meditations of Marcus Aurelius', st: 'A New Translation with Commentary', a: 'Marcus Aurelius', y: 2002, p: 256 },
  { t: 'Being and Time', st: 'A Translation of Sein und Zeit', a: 'Martin Heidegger', y: 1996, p: 480 },
  { t: 'The Myth of Sisyphus', st: 'An Essay on the Absurd', a: 'Albert Camus', y: 1955, p: 212 },
  { t: 'Beyond Good and Evil', st: 'Prelude to a Philosophy of the Future', a: 'Friedrich Nietzsche', y: 1989, p: 256 },
  { t: 'Tractatus Logico-Philosophicus', st: 'The Limits of Language and Logic', a: 'Ludwig Wittgenstein', y: 2001, p: 144 },
  { t: 'The Structure of Scientific Revolutions', st: 'Paradigm Shifts in Knowledge', a: 'Thomas S. Kuhn', y: 2012, p: 264 },
  { t: 'Ethics Demonstrated in Geometrical Order', st: 'On God, Mind, and Freedom', a: 'Baruch Spinoza', y: 1996, p: 288 },
  { t: 'The Human Condition', st: 'Action, Labor, and the Public Realm', a: 'Hannah Arendt', y: 1998, p: 350 },
  { t: 'Simulacra and Simulation', st: 'Hyperreality and Postmodern Semiotics', a: 'Jean Baudrillard', y: 1994, p: 164 },
  { t: 'Phenomenology of Perception', st: 'The Embodied Subject', a: 'Maurice Merleau-Ponty', y: 2013, p: 580 },
  { t: 'Critique of Pure Reason', st: 'Unified Edition with Marginal Notes', a: 'Immanuel Kant', y: 1998, p: 784 },
  { t: 'The World as Will and Representation', st: 'Volume I: The Philosophy of Will', a: 'Arthur Schopenhauer', y: 1969, p: 534 },
  { t: 'Walking: An Essay on Solitude', st: 'The Art of the Saunterer', a: 'Henry David Thoreau', y: 2013, p: 96 },
  { t: 'The Fragility of Goodness', st: 'Luck and Ethics in Greek Tragedy and Philosophy', a: 'Martha Nussbaum', y: 2001, p: 544 },
  { t: 'On the Shortness of Life', st: 'De Brevitate Vitae with Notes', a: 'Lucius Annaeus Seneca', y: 2005, p: 112 },
  { t: 'The Order of Things', st: 'An Archaeology of the Human Sciences', a: 'Michel Foucault', y: 1994, p: 416 },
  { t: 'Reasons and Persons', st: 'Personal Identity and Ethics Across Time', a: 'Derek Parfit', y: 1986, p: 560 },
  { t: 'The Sovereignty of Good', st: 'Attention and the Moral Real', a: 'Iris Murdoch', y: 2001, p: 120 },
  { t: 'Mind and Cosmos', st: 'Why the Materialist Neo-Darwinian Conception is Almost Certainly False', a: 'Thomas Nagel', y: 2012, p: 144 },
  { t: 'Discourses and Selected Writings', st: 'The Stoic Manual of Freedom', a: 'Epictetus', y: 2008, p: 320 },
  { t: 'The Denial of Death', st: 'Terror, Heroism, and Human Illusion', a: 'Ernest Becker', y: 1997, p: 336 },
  { t: 'The Art of Living', st: 'Socratic Reflections from Plato to Foucault', a: 'Alexander Nehamas', y: 2000, p: 296 },
  { t: 'Justice for Hedgehogs', st: 'The Unity of Value and Truth', a: 'Ronald Dworkin', y: 2011, p: 528 },
  { t: 'The View from Nowhere', st: 'Subjectivity and Objective Reality', a: 'Thomas Nagel', y: 1989, p: 256 },
  { t: 'The Tao Te Ching', st: 'A Verse Translation and Commentary', a: 'Laozi & Red Pine', y: 2009, p: 304 },
  { t: 'The Book of Tea', st: 'A Japanese Harmony of Art, Life, and Philosophy', a: 'Kakuzo Okakura', y: 2008, p: 144 },
  { t: 'Equanimity in the Tempest', st: 'Modern Stoicism for Turbulent Eras', a: 'Julian Sterling', y: 2025, p: 270 }
];

// SCIENCE & TECHNOLOGY (30)
const SCI_TITLES = [
  { t: 'Thinking Machines', st: 'Philosophy, AI, and the Future of Mind', a: 'Eliza Reed & Marcus Chen', y: 2025, p: 460, img: '/src/assets/images/book_cover_thinking_machines_1792609937276.jpg', feat: true },
  { t: 'Celestial Mechanics', st: 'A Treatise on Orbital Dynamics & Star Maps', a: 'Arthur Sterling & Elena Rostova', y: 2024, p: 410, img: '/src/assets/images/book_cover_celestial_mechanics_1792610457608.jpg', feat: true },
  { t: 'Cosmic Horizons', st: 'Relativity, Black Holes, and the Limits of Observable Space', a: 'Prof. Alistair Sterling', y: 2024, p: 390 },
  { t: 'Gödel, Escher, Bach', st: 'An Eternal Golden Braid', a: 'Douglas Hofstadter', y: 1999, p: 824 },
  { t: 'The Character of Physical Law', st: 'The Messenger Lectures at Cornell', a: 'Richard Feynman', y: 2017, p: 192 },
  { t: 'Superintelligence', st: 'Paths, Dangers, Strategies', a: 'Nick Bostrom', y: 2014, p: 352 },
  { t: 'The Blind Watchmaker', st: 'Why the Evidence of Evolution Reveals a Universe Without Design', a: 'Richard Dawkins', y: 2006, p: 496 },
  { t: 'Life 3.0', st: 'Being Human in the Age of Artificial Intelligence', a: 'Max Tegmark', y: 2017, p: 384 },
  { t: 'A Brief History of Time', st: 'From the Big Bang to Black Holes', a: 'Stephen Hawking', y: 1998, p: 224 },
  { t: 'The Emperor’s New Mind', st: 'Concerning Computers, Minds, and the Laws of Physics', a: 'Roger Penrose', y: 2002, p: 640 },
  { t: 'The Fabric of Reality', st: 'The Science of Parallel Universes and Its Implications', a: 'David Deutsch', y: 1998, p: 400 },
  { t: 'Algorithms to Live By', st: 'The Computer Science of Human Decisions', a: 'Brian Christian & Tom Griffiths', y: 2016, p: 368 },
  { t: 'The Code Breaker', st: 'Jennifer Doudna, Gene Editing, and the Future of the Human Race', a: 'Walter Isaacson', y: 2021, p: 560 },
  { t: 'Complexity: A Guided Tour', st: 'Information, Computation, and Biological Systems', a: 'Melanie Mitchell', y: 2009, p: 384 },
  { t: 'Sync: How Order Emerges from Chaos', st: 'Spontaneous Synchronization Across the Cosmos', a: 'Steven Strogatz', y: 2003, p: 352 },
  { t: 'The Information', st: 'A History, a Theory, a Flood', a: 'James Gleick', y: 2011, p: 544 },
  { t: 'Chaos: Making a New Science', st: 'The Mathematical Frontier of Non-Linear Systems', a: 'James Gleick', y: 2008, p: 384 },
  { t: 'The Elegant Universe', st: 'Superstrings, Hidden Dimensions, and the Quest for the Ultimate Theory', a: 'Brian Greene', y: 2003, p: 464 },
  { t: 'The Origin of Consciousness', st: 'In the Breakdown of the Bicameral Mind', a: 'Julian Jaynes', y: 2000, p: 512 },
  { t: 'Reinforcement Learning', st: 'An Introduction to Policy Gradients and Synthetic Agency', a: 'Richard S. Sutton & Andrew Barto', y: 2018, p: 552 },
  { t: 'Silicon & Carbon', st: 'The Next Fifty Years of Synthetic Biology', a: 'Dr. Karen Miller', y: 2025, p: 320 },
  { t: 'Neural Dynamics in Biological Systems', st: 'Synaptic Plasticity and Population Coding', a: 'Marcus Chen & Sarah Thorne', y: 2024, p: 440 },
  { t: 'Gravitational Waves', st: 'Ripples in Spacetime Detected by Laser Interferometry', a: 'David Blair', y: 2023, p: 290 },
  { t: 'Our Mathematical Universe', st: 'My Quest for the Ultimate Nature of Reality', a: 'Max Tegmark', y: 2014, p: 432 },
  { t: 'Artificial General Intelligence Foundations', st: 'Formalizing Alignment, Agency, and Value Drift', a: 'Dr. Eliza Reed', y: 2026, p: 380 },
  { t: 'The Quantum Labyrinth', st: 'How Richard Feynman and John Wheeler Revolutionized Time and Reality', a: 'Paul Halpern', y: 2017, p: 320 },
  { t: 'The Master Algorithm', st: 'How the Quest for the Ultimate Learning Machine Will Remake Our World', a: 'Pedro Domingos', y: 2015, p: 352 },
  { t: 'Quantum Computing Since Democritus', st: 'Computational Complexity and Quantum Physics', a: 'Scott Aaronson', y: 2013, p: 400 },
  { t: 'Until the End of Time', st: 'Mind, Matter, and Our Search for Meaning in an Evolving Universe', a: 'Brian Greene', y: 2020, p: 448 },
  { t: 'Scale: The Universal Laws of Life', st: 'Growth, Innovation, and Sustainability in Organisms and Cities', a: 'Geoffrey West', y: 2017, p: 496 }
];

// LITERARY FICTION (30)
const FICT_TITLES = [
  { t: 'The Quiet Hour', st: 'A Novel of Fog, Memory, and the North Sea Coast', a: 'Eleanor Reed', y: 2025, p: 412, img: '/src/assets/images/book_cover_quiet_hour_1792609936232.jpg', feat: true },
  { t: 'Invisible Cities', st: 'Kublai Khan and the Marco Polo Narratives', a: 'Italo Calvino', y: 1974, p: 165 },
  { t: 'Ficciones', st: 'The Garden of Forking Paths and Other Labyrinths', a: 'Jorge Luis Borges', y: 1998, p: 176 },
  { t: 'The Aleph and Other Stories', st: 'Metaphysical Fictions from Buenos Aires', a: 'Jorge Luis Borges', y: 2004, p: 224 },
  { t: 'One Hundred Years of Solitude', st: 'The Macondo Chronicle', a: 'Gabriel García Márquez', y: 2006, p: 448 },
  { t: 'If on a Winter’s Night a Traveler', st: 'A Novel of Readers and Unfinished Manuscripts', a: 'Italo Calvino', y: 1982, p: 272 },
  { t: 'The Remains of the Day', st: 'Duty, Dignity, and Missed Horizons', a: 'Kazuo Ishiguro', y: 1990, p: 256 },
  { t: 'The Shadow of the Wind', st: 'The Cemetery of Forgotten Books', a: 'Carlos Ruiz Zafón', y: 2004, p: 512 },
  { t: 'The Name of the Rose', st: 'A Medieval Mystery of Murders and Heretical Manuscripts', a: 'Umberto Eco', y: 1994, p: 560 },
  { t: 'The Book of Disquiet', st: 'The Autobiography of Bernardo Soares', a: 'Fernando Pessoa', y: 2002, p: 544 },
  { t: 'Drive Your Plow Over the Bones of the Dead', st: 'A Novel of Astrology and Ecology', a: 'Olga Tokarczuk', y: 2019, p: 272 },
  { t: 'The Sound of Waves', st: 'A Fisherman’s Romance on a Quiet Japanese Islet', a: 'Yukio Mishima', y: 1994, p: 192 },
  { t: 'The Tartar Steppe', st: 'Waiting for the Barbarians at Fort Bastiani', a: 'Dino Buzzati', y: 2007, p: 208 },
  { t: 'Kafka on the Shore', st: 'Metaphors, Cats, and the Edge of Memory', a: 'Haruki Murakami', y: 2005, p: 480 },
  { t: 'The Wind-Up Bird Chronicle', st: 'A Tokyo Odyssey in a Dried Well', a: 'Haruki Murakami', y: 1998, p: 624 },
  { t: 'Snow Country', st: 'A Geisha and an Idle Connoisseur in the Japanese Alps', a: 'Yasunari Kawabata', y: 1996, p: 192 },
  { t: 'The Sea, The Sea', st: 'A Playwright’s Memoir in a Craggy Headland House', a: 'Iris Murdoch', y: 2001, p: 528 },
  { t: 'The Buried Giant', st: 'Mist, Memory, and Ancient Vengeance in Post-Arthurian Britain', a: 'Kazuo Ishiguro', y: 2015, p: 336 },
  { t: 'Piranesi', st: 'The Infinite Tides of the Statued Halls', a: 'Susanna Clarke', y: 2020, p: 272 },
  { t: 'Outline', st: 'A Novel in Ten Conversations in Athens', a: 'Rachel Cusk', y: 2014, p: 256 },
  { t: 'Transit', st: 'Rebuilding a Life After Separation', a: 'Rachel Cusk', y: 2017, p: 272 },
  { t: 'The Rings of Saturn', st: 'An English Pilgrimage Through Maritime Memory', a: 'W.G. Sebald', y: 1998, p: 320 },
  { t: 'Austerlitz', st: 'The Architecture of Lost European Identity', a: 'W.G. Sebald', y: 2001, p: 432 },
  { t: 'The Street of Crocodiles', st: 'Mythic Cinnamon Shops and Drohobych Dreams', a: 'Bruno Schulz', y: 1992, p: 160 },
  { t: 'The Waves', st: 'Six Soliloquies Moving from Dawn to Dusk', a: 'Virginia Woolf', y: 2000, p: 240 },
  { t: 'To the Lighthouse', st: 'Time Passes and the Hebrides Summer', a: 'Virginia Woolf', y: 2000, p: 224 },
  { t: 'Blindness', st: 'A Parable of Contagion and Social Collapse', a: 'José Saramago', y: 1999, p: 352 },
  { t: 'The North Sea Ledger', st: 'Hydrography, Shipwrecks, and Atlantic Tides', a: 'Eleanor Reed', y: 2023, p: 340 },
  { t: 'The English Patient', st: 'Wartime Wounds in a Tuscan Villa', a: 'Michael Ondaatje', y: 1996, p: 320 },
  { t: 'All the Light We Cannot See', st: 'Radio Waves, Shells, and the Citadel of Saint-Malo', a: 'Anthony Doerr', y: 2014, p: 544 }
];

// ESSAYS & ART (30)
const ESSAY_TITLES = [
  { t: 'The Art of Looking', st: 'Essays on Perception, Stillness, and Visual Solitude', a: 'Hannah A. Bailey', y: 2024, p: 256 },
  { t: 'Ways of Seeing', st: 'Oil Painting, Gender, and the Commercial Image', a: 'John Berger', y: 1972, p: 176 },
  { t: 'Against Interpretation', st: 'And Other Essays on Sensibility', a: 'Susan Sontag', y: 2001, p: 320 },
  { t: 'On Photography', st: 'The Image World and Melancholy Objects', a: 'Susan Sontag', y: 2001, p: 224 },
  { t: 'Camera Lucida', st: 'Reflections on Photography and the Punctum', a: 'Roland Barthes', y: 2010, p: 144 },
  { t: 'Illuminations', st: 'Essays on Storytellers, Translators, and Kafka', a: 'Walter Benjamin', y: 2007, p: 288 },
  { t: 'The Arcades Project', st: 'Passagen-Werk: The 19th Century Capital of the World', a: 'Walter Benjamin', y: 2002, p: 1088 },
  { t: 'Regarding the Pain of Others', st: 'War Photography and Viewer Complicity', a: 'Susan Sontag', y: 2003, p: 144 },
  { t: 'What Are We Doing Here?', st: 'Essays on Calvin, the Humanities, and American Culture', a: 'Marilynne Robinson', y: 2018, p: 336 },
  { t: 'A Philosophy of Walking', st: 'Pilgrimage, Slowness, and Solitary Strolls', a: 'Frédéric Gros', y: 2014, p: 192 },
  { t: 'The Lonely City', st: 'Adventures in the Art of Being Alone in New York', a: 'Olivia Laing', y: 2016, p: 320 },
  { t: 'To the River', st: 'A Journey Beneath the Surface of Virginia Woolf’s Ouse', a: 'Olivia Laing', y: 2011, p: 304 },
  { t: 'Bluets', st: 'Two Hundred and Forty Propositions on the Color Blue', a: 'Maggie Nelson', y: 2009, p: 112 },
  { t: 'The White Album', st: 'Essays on the California 1960s and Cultural Drift', a: 'Joan Didion', y: 2009, p: 240 },
  { t: 'Slouching Towards Bethlehem', st: 'Haight-Ashbury and the Fragmenting Nation', a: 'Joan Didion', y: 2008, p: 256 },
  { t: 'Art Objects', st: 'Essays on Ecstasy and Effrontery', a: 'Jeanette Winterson', y: 1996, p: 208 },
  { t: 'The Story of Art', st: 'Sixteenth Edition of the Definitive Survey', a: 'E.H. Gombrich', y: 1995, p: 688 },
  { t: 'Letters to a Young Poet', st: 'On Patience, Solitude, and Creative Vocation', a: 'Rainer Maria Rilke', y: 2011, p: 112 },
  { t: 'The Sight of Death', st: 'An Experiment in Art Writing Before Poussin', a: 'T.J. Clark', y: 2006, p: 288 },
  { t: 'Seven Days in the Art World', st: 'Behind the Scenes of Auctions, Basel, and Biennales', a: 'Sarah Thornton', y: 2009, p: 304 },
  { t: 'Drawing on the Right Side of the Brain', st: 'A Course in Enhancing Creativity and Artistic Confidence', a: 'Betty Edwards', y: 2012, p: 320 },
  { t: 'Aesthetic Theory', st: 'Art, Autonomy, and Society in Modernity', a: 'Theodor W. Adorno', y: 1997, p: 400 },
  { t: 'The Work of Art in the Age of Mechanical Reproduction', st: 'Aura, Film, and Mass Politics', a: 'Walter Benjamin', y: 2008, p: 96 },
  { t: 'Still Life with Bottles', st: 'Giorgio Morandi and the Quiet Studios of Bologna', a: 'Hannah A. Bailey', y: 2023, p: 210 },
  { t: 'The Museum of Unwritten Words', st: 'Fragments, Marginalia, and Unfinished Manuscripts', a: 'Julian Barnes', y: 2024, p: 275 },
  { t: 'On Looking', st: 'Eleven Walks with Expert Observers', a: 'Alexandra Horowitz', y: 2013, p: 320 },
  { t: 'The Shape of Green', st: 'Aesthetics, Ecology, and Design', a: 'Lance Hosey', y: 2012, p: 248 },
  { t: 'A Book of Common Prayer: Reflections', st: 'Essays on Solitude and American Landscape', a: 'Joan Didion', y: 2006, p: 220 },
  { t: 'The Unknown Craftsman', st: 'A Japanese Insight into Beauty in Everyday Folk Art', a: 'Soetsu Yanagi', y: 1989, p: 232 },
  { t: 'Wabi-Sabi for Artists, Designers, Poets & Philosophers', st: 'The Imperfect, Impermanent, and Incomplete', a: 'Leonard Koren', y: 2008, p: 96 }
];

// HISTORY & CIVILIZATION (25)
const HIST_TITLES = [
  { t: 'Guns, Germs, and Steel', st: 'The Fates of Human Societies Across Ten Millennia', a: 'Jared Diamond', y: 1999, p: 496 },
  { t: 'Sapiens', st: 'A Brief History of Humankind', a: 'Yuval Noah Harari', y: 2015, p: 464 },
  { t: 'The Silk Roads', st: 'A New History of the World', a: 'Peter Frankopan', y: 2016, p: 656 },
  { t: 'The Swerve', st: 'How the World Became Modern with Lucretius', a: 'Stephen Greenblatt', y: 2011, p: 368 },
  { t: 'The Autumn of the Middle Ages', st: 'Forms of Life and Thought in 14th Century France and the Low Countries', a: 'Johan Huizinga', y: 1996, p: 520 },
  { t: 'The Mediterranean in the Ancient World', st: 'Mountains, Peninsulas, and Maritime Horizons', a: 'Fernand Braudel', y: 2002, p: 440 },
  { t: 'The Rise and Fall of the Great Powers', st: 'Economic Change and Military Conflict from 1500 to 2000', a: 'Paul Kennedy', y: 1989, p: 704 },
  { t: 'SPQR: A History of Ancient Rome', st: 'Citizens, Emperors, and Senates', a: 'Mary Beard', y: 2015, p: 608 },
  { t: 'The Lessons of History', st: 'Surveying Civilization Over Five Millennia', a: 'Will & Ariel Durant', y: 2010, p: 128 },
  { t: 'A Distant Mirror', st: 'The Calamitous 14th Century in Western Europe', a: 'Barbara Tuchman', y: 1987, p: 704 },
  { t: 'The Sleepwalkers', st: 'How Europe Went to War in 1914', a: 'Christopher Clark', y: 2013, p: 736 },
  { t: 'The Civilization of the Renaissance in Italy', st: 'Statecraft, Humanism, and the Discovery of the Individual', a: 'Jacob Burckhardt', y: 1990, p: 512 },
  { t: 'Venice: Pure City', st: 'Lagoon Architecture, Salt Monopolies, and Republics', a: 'Peter Ackroyd', y: 2010, p: 416 },
  { t: 'The Dawn of Everything', st: 'A New History of Humanity', a: 'David Graeber & David Wengrow', y: 2021, p: 704 },
  { t: 'Collapse', st: 'How Societies Choose to Fail or Succeed', a: 'Jared Diamond', y: 2005, p: 592 },
  { t: 'Postwar', st: 'A History of Europe Since 1945', a: 'Tony Judt', y: 2005, p: 960 },
  { t: 'The Anarchy', st: 'The Relentless Rise of the East India Company', a: 'William Dalrymple', y: 2019, p: 544 },
  { t: 'Rubicon', st: 'The Triumph and Tragedy of the Roman Republic', a: 'Tom Holland', y: 2004, p: 464 },
  { t: 'Persian Fire', st: 'The First World Empire and the Battle for the West', a: 'Tom Holland', y: 2006, p: 448 },
  { t: 'The Norman Conquest', st: 'The Battle of Hastings and the Fall of Anglo-Saxon England', a: 'Marc Morris', y: 2013, p: 464 },
  { t: 'Byzantium: The Surprising Life of a Medieval Empire', st: 'Orthodoxy, Mosaics, and Imperial Statecraft', a: 'Judith Herrin', y: 2008, p: 416 },
  { t: 'The Library: A Fragile History', st: 'Alexandria to the Digital Age', a: 'Andrew Pettegree & Arthur der Weduwen', y: 2021, p: 528 },
  { t: 'Gutenberg’s Apprentice', st: 'Movable Type and the Printing Revolution in Mainz', a: 'Alix Christie', y: 2014, p: 416 },
  { t: 'Cartographies of Time', st: 'A History of the Timeline from Manuscripts to Graphics', a: 'Daniel Rosenberg & Anthony Grafton', y: 2010, p: 272 },
  { t: 'Archives of the Ancient Near East', st: 'Clay Cuneiform Tablets and the Earliest Recorded Laws', a: 'Marc Van De Mieroop', y: 2023, p: 350 }
];

// PSYCHOLOGY & MIND (25)
const PSYCH_TITLES = [
  { t: 'Thinking, Fast and Slow', st: 'Two Systems of Intuition and Calculation', a: 'Daniel Kahneman', y: 2011, p: 512 },
  { t: 'The Master and His Emissary', st: 'The Divided Brain and the Making of the Western World', a: 'Iain McGilchrist', y: 2019, p: 634 },
  { t: 'Man and His Symbols', st: 'Dreams, Archetypes, and Individuation', a: 'Carl G. Jung', y: 1968, p: 416 },
  { t: 'The Man Who Mistook His Wife for a Hat', st: 'And Other Clinical Tales of Neurological Wonder', a: 'Oliver Sacks', y: 1998, p: 256 },
  { t: 'Flow', st: 'The Psychology of Optimal Experience', a: 'Mihaly Csikszentmihalyi', y: 2008, p: 320 },
  { t: 'Quiet', st: 'The Power of Introverts in a World That Can’t Stop Talking', a: 'Susan Cain', y: 2012, p: 352 },
  { t: 'Behave', st: 'The Biology of Humans at Our Best and Worst', a: 'Robert Sapolsky', y: 2017, p: 800 },
  { t: 'The Body Keeps the Score', st: 'Brain, Mind, and Body in the Healing of Trauma', a: 'Bessel van der Kolk', y: 2014, p: 464 },
  { t: 'Awakenings', st: 'L-DOPA and the Recovery of Catatonic Patients', a: 'Oliver Sacks', y: 1999, p: 464 },
  { t: 'Phantoms in the Brain', st: 'Probing the Mysteries of the Human Mind', a: 'V.S. Ramachandran', y: 1999, p: 352 },
  { t: 'Stumbling on Happiness', st: 'Why the Future Never Feels the Way We Imagine It', a: 'Daniel Gilbert', y: 2006, p: 336 },
  { t: 'Predictably Irrational', st: 'The Hidden Forces That Shape Our Decisions', a: 'Dan Ariely', y: 2008, p: 384 },
  { t: 'The Righteous Mind', st: 'Why Good People Are Divided by Politics and Religion', a: 'Jonathan Haidt', y: 2012, p: 448 },
  { t: 'Subliminal', st: 'How Your Unconscious Mind Rules Your Behavior', a: 'Leonard Mlodinow', y: 2012, p: 272 },
  { t: 'Seven and a Half Lessons About the Brain', st: 'Neuroscience and Constructed Emotion', a: 'Lisa Feldman Barrett', y: 2020, p: 192 },
  { t: 'The Neurobiology of Silence', st: 'Attention Restoration, Cortisol, and Solitary Habitats', a: 'Dr. Helena Vance', y: 2024, p: 310 },
  { t: 'Attention and Will in Modern Cognition', st: 'Sustained Focus Amid Digital Distraction', a: 'Dr. Julian Thorne', y: 2025, p: 285 },
  { t: 'The Archetypes of the Collective Unconscious', st: 'Collected Works Volume 9', a: 'Carl G. Jung', y: 1981, p: 472 },
  { t: 'Memories, Dreams, Reflections', st: 'The Autobiographical Retrospective', a: 'Carl G. Jung & Aniela Jaffé', y: 1989, p: 432 },
  { t: 'Emotional Intelligence', st: 'Why It Can Matter More Than IQ', a: 'Daniel Goleman', y: 2005, p: 384 },
  { t: 'Incognito: The Secret Lives of the Brain', st: 'Subconscious Circuitry and Perceptual Reality', a: 'David Eagleman', y: 2011, p: 304 },
  { t: 'Livewired', st: 'The Inside Story of the Ever-Changing Brain', a: 'David Eagleman', y: 2020, p: 352 },
  { t: 'Strangers to Ourselves', st: 'Discovering the Adaptive Unconscious', a: 'Timothy D. Wilson', y: 2002, p: 272 },
  { t: 'The Divided Mind', st: 'The Epidemic of Mindbody Disorders', a: 'John E. Sarno', y: 2006, p: 400 },
  { t: 'Deep Work', st: 'Rules for Focused Success in a Distracted World', a: 'Cal Newport', y: 2016, p: 304 }
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateExcerpt(title, author, category) {
  return {
    chapterTitle: `Chapter I: Prolegomena to ${title}`,
    subtitle: `On the fundamental thesis and origin of ${category.toLowerCase()}`,
    paragraphs: [
      `In examining ${title}, one is struck by how quietly its core propositions challenge our unreflective habits. The inquiry did not begin in polemical dispute, but in a patient pause—a deliberate decision to inspect what everyone else had taken for granted.`,
      `As ${author} demonstrates throughout these pages, the prevailing orthodoxy has mistaken expediency for truth. By stripping away extraneous ornament and examining first principles, we uncover an architecture of thought that remains remarkably resilient across centuries.`,
      `To read this work with the attention it deserves requires a quiet desk and an unhurried mind. The conclusions reached are not mere academic deductions; they are invitations to perceive our surrounding world with renewed clarity and composure.`
    ]
  };
}

function generateReviews(bookTitle) {
  return [
    {
      id: `rev-${Math.random().toString(36).substring(2, 9)}`,
      author: 'Julian Thorne',
      role: 'Reviewer, The Alpine Academic Review',
      rating: 5,
      date: 'Autumn 2024',
      content: `A masterclass in intellectual rigor and aesthetic clarity. "${bookTitle}" demands to be read slowly and reread often.`
    },
    {
      id: `rev-${Math.random().toString(36).substring(2, 9)}`,
      author: 'Clara Macleod',
      role: 'Fellow, Cambridge Monographs',
      rating: 5,
      date: 'Winter 2024',
      content: 'Remarkable depth of perception. It illuminates its domain with spare, luminous prose.'
    }
  ];
}

const allBooks = [];

// 1. Add Architecture Seed
BOOKS.forEach((b) => {
  allBooks.push({
    ...b,
    id: slugify(b.title),
    coverImage: b.coverImage || '',
    language: b.language || 'English',
    readTimeHours: Number((b.pages / 40).toFixed(1)),
    ratingCount: Math.floor(100 + Math.random() * 400),
    tableOfContents: [
      'I. Foundations and First Principles',
      'II. Material Conditions and Spatial Rhythm',
      'III. Structural Tensions and Equilibrium',
      'IV. Historical Dialectic and Forms',
      'V. The Human Measure',
      'Epilogue: Open Horizons'
    ],
    sampleExcerpt: generateExcerpt(b.title, b.author, b.category),
    reviews: generateReviews(b.title)
  });
});


// Helper to push lists
function processList(list, category) {
  list.forEach((item) => {
    const id = slugify(item.t);
    const pages = item.p;
    allBooks.push({
      id,
      title: item.t,
      subtitle: item.st,
      author: item.a,
      authorBio: `${item.a} is a celebrated author, scholar, and thinker in the field of ${category}.`,
      coverImage: item.img || '',
      category,
      rating: Number((4.6 + Math.random() * 0.38).toFixed(1)),
      ratingCount: Math.floor(90 + Math.random() * 650),
      pages,
      publishedYear: item.y,
      publisher: 'Athenaeum Library Press',
      isbn: `978-0-${Math.floor(100000 + Math.random() * 899999)}-${Math.floor(10 + Math.random() * 89)}-${Math.floor(1 + Math.random() * 9)}`,
      language: 'English',
      readTimeHours: Number((pages / 40).toFixed(1)),
      summary: `A foundational study in ${category}, examining the core tenets of "${item.t}". Praised for its clarity of exposition, structural elegance, and lasting intellectual resonance.`,
      quote: `In "${item.t}", truth is not an abstract ornament, but the quiet gravity holding understanding together.`,
      quoteAttribution: 'Selected Works, Vol. II',
      tags: [category.split(' ')[0], 'Classic', 'Monograph', 'Theory'],
      featured: Boolean(item.feat),
      edition: 'Library Clothbound Edition',
      tableOfContents: [
        'I. The Premise and the Precedent',
        'II. Dynamics of Method and Form',
        'III. Core Inquiries and Propositions',
        'IV. Counter-arguments and Evidence',
        'V. Synthesis and Legacy',
        'Coda: Reflections on Practice'
      ],
      sampleExcerpt: generateExcerpt(item.t, item.a, category),
      reviews: generateReviews(item.t)
    });
  });
}

processList(PHILO_TITLES, 'Philosophy');
processList(SCI_TITLES, 'Science & Technology');
processList(FICT_TITLES, 'Literary Fiction');
processList(ESSAY_TITLES, 'Essays & Art');
processList(HIST_TITLES, 'History & Civilization');
processList(PSYCH_TITLES, 'Psychology & Mind');

console.log('Total books compiled:', allBooks.length);

const outputContent = `import { Book } from '../types/book';

export const BOOKS_CATALOG: Book[] = ${JSON.stringify(allBooks, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/booksCatalog.ts'), outputContent, 'utf-8');
console.log('Successfully wrote src/data/booksCatalog.ts');
