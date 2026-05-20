-- Migration to seed the 9 scraped collections


INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, metadata)
VALUES (
    'Foundation',
    'foundation',
    'Every lasting success begins with a solid base. Breaking Ground – Foundation is a refined design rooted in our commitment to sustainability, and the environment and crafted to elevate your space. Support your business from the ground up.',
    'Whether you’re shaping a brand or building an environment, Foundation adds character, cohesion, and confidence.',
    '80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,

Pathumthani 12000
Tel +66(0)2976-0123

India: amar@carpetsinter.com',
    'https://carpetsinter.com/wp-content/uploads/2025/09/FD01-Root-1-768x600.jpg',
    'published',
    '{"title":"Foundation","tagline":"Every lasting success begins with a solid base. Breaking Ground – Foundation is a refined design rooted in our commitment to sustainability, and the environment and crafted to elevate your space. Support your business from the ground up.","summary":"Whether you’re shaping a brand or building an environment, Foundation adds character, cohesion, and confidence.","detail":"80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,\n\nPathumthani 12000\nTel +66(0)2976-0123\n\nIndia: amar@carpetsinter.com","headings":["Every lasting success begins with a solid base. Breaking Ground – Foundation is a refined design rooted in our commitment to sustainability, and the environment and crafted to elevate your space. Support your business from the ground up.","BREAKING GROUND : FOUNDATION","DOWNLOAD OUR BROCHURE","RECOMMENDED INSTALLATION METHODS","Please direct your inquiries to our","A member of TCM Corporation Plc."],"paragraphs":["Whether you’re shaping a brand or building an environment, Foundation adds character, cohesion, and confidence.","80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,","Pathumthani 12000\nTel +66(0)2976-0123","India: amar@carpetsinter.com","Middle East: twee@carpetsinter.com","1/19 Moo 1, Mahidol, Pahdad,\nMuang, Chiangmai 50000 Thailand\nTel +66 (053) 274-584-5","31/19 Rajyindee Road,\nHadyai , Songkla 90110 Thailand\nTel 074-209790-1"],"heroImage":"https://carpetsinter.com/wp-content/uploads/2025/09/FD01-Root-1-768x600.jpg","url":"https://carpetsinter.com/foundation"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    summary = EXCLUDED.summary,
    detail = EXCLUDED.detail,
    hero_image = EXCLUDED.hero_image,
    metadata = EXCLUDED.metadata,
    status = 'published',
    updated_at = NOW();

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, metadata)
VALUES (
    'Groundwork',
    'groundwork',
    'Building on Groundwork means adding the strength of character, effortless design quality, and sustainable materials to support your business. It’s about carving out a future that is not only successful but sustainable.',
    'Introduces a timeless, elegant organic structural base on which to build and carve out a successful future. When you invest in Groundwork, you’re investing in the bedrock of the future. Ready to break new ground?',
    '80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,

Pathumthani 12000
Tel +66(0)2976-0123

India: amar@carpetsinter.com',
    'https://carpetsinter.com/wp-content/uploads/2026/01/GW08-768x600.jpg',
    'published',
    '{"title":"Groundwork","tagline":"Building on Groundwork means adding the strength of character, effortless design quality, and sustainable materials to support your business. It’s about carving out a future that is not only successful but sustainable.","summary":"Introduces a timeless, elegant organic structural base on which to build and carve out a successful future. When you invest in Groundwork, you’re investing in the bedrock of the future. Ready to break new ground?","detail":"80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,\n\nPathumthani 12000\nTel +66(0)2976-0123\n\nIndia: amar@carpetsinter.com","headings":["Building on Groundwork means adding the strength of character, effortless design quality, and sustainable materials to support your business. It’s about carving out a future that is not only successful but sustainable.","TILE SIZE : 50X50 CM.","Specification","Installation Methods","DOWNLOAD OUR BROCHURE","Please direct your inquiries to our","A member of TCM Corporation Plc."],"paragraphs":["Introduces a timeless, elegant organic structural base on which to build and carve out a successful future. When you invest in Groundwork, you’re investing in the bedrock of the future. Ready to break new ground?","80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,","Pathumthani 12000\nTel +66(0)2976-0123","India: amar@carpetsinter.com","Middle East: twee@carpetsinter.com","1/19 Moo 1, Mahidol, Pahdad,\nMuang, Chiangmai 50000 Thailand\nTel +66 (053) 274-584-5","31/19 Rajyindee Road,\nHadyai , Songkla 90110 Thailand\nTel 074-209790-1"],"heroImage":"https://carpetsinter.com/wp-content/uploads/2026/01/GW08-768x600.jpg","url":"https://carpetsinter.com/groundwork/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    summary = EXCLUDED.summary,
    detail = EXCLUDED.detail,
    hero_image = EXCLUDED.hero_image,
    metadata = EXCLUDED.metadata,
    status = 'published',
    updated_at = NOW();

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, metadata)
VALUES (
    'Aspekt: Insight',
    'aspekt-insight',
    'Aspekt : Insight',
    'With clarity, confidence, and a commitment to innovative design, we proudly introduce the Aspekt Collection—a showcase of imaginative perspectives and forward-thinking creativity. Central to this collection are two distinct designs: Insight and Vue.',
    '“Insight” delves deep, offering a contemplative view that encourages introspection and thoughtful design choices.

“Vue”, on the other hand, provides a fresh outlook, capturing the essence of modernity.

The Aspekt-Insight collection is designed to deliver more than just aesthetic appeal, it’s an experience of luxury, comfort, and purpose. Crafted from premium, sustainable materials, Aspekt-Insight not only enhances well-being but also reflects a leader’s commitment to carbon reduction and environmental responsibility.',
    'https://carpetsinter.com/wp-content/uploads/2024/10/Aspekt-1.png',
    'published',
    '{"title":"Aspekt : Insight","tagline":"Aspekt : Insight","summary":"With clarity, confidence, and a commitment to innovative design, we proudly introduce the Aspekt Collection—a showcase of imaginative perspectives and forward-thinking creativity. Central to this collection are two distinct designs: Insight and Vue.","detail":"“Insight” delves deep, offering a contemplative view that encourages introspection and thoughtful design choices.\n\n“Vue”, on the other hand, provides a fresh outlook, capturing the essence of modernity.\n\nThe Aspekt-Insight collection is designed to deliver more than just aesthetic appeal, it’s an experience of luxury, comfort, and purpose. Crafted from premium, sustainable materials, Aspekt-Insight not only enhances well-being but also reflects a leader’s commitment to carbon reduction and environmental responsibility.","headings":["Aspekt : Insight","Introducing Aspekt : Insight","Walking on Aspekt tiles is a statement of confidence and sophistication, where comfort meets innovation. Every step is a reflection of vision, legacy, and excellence, creating spaces that inspire success while supporting a greener future.","ASPEKT : INSIGHT","DOWNLOAD OUR BROCHURE","RECOMMENDED INSTALLATION METHODS","Please direct your inquiries to our","A member of TCM Corporation Plc."],"paragraphs":["With clarity, confidence, and a commitment to innovative design, we proudly introduce the Aspekt Collection—a showcase of imaginative perspectives and forward-thinking creativity. Central to this collection are two distinct designs: Insight and Vue.","“Insight” delves deep, offering a contemplative view that encourages introspection and thoughtful design choices.","“Vue”, on the other hand, provides a fresh outlook, capturing the essence of modernity.","The Aspekt-Insight collection is designed to deliver more than just aesthetic appeal, it’s an experience of luxury, comfort, and purpose. Crafted from premium, sustainable materials, Aspekt-Insight not only enhances well-being but also reflects a leader’s commitment to carbon reduction and environmental responsibility.","80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,","Pathumthani 12000\nTel +66(0)2976-0123","India: amar@carpetsinter.com","Middle East: twee@carpetsinter.com","1/19 Moo 1, Mahidol, Pahdad,\nMuang, Chiangmai 50000 Thailand\nTel +66 (053) 274-584-5","31/19 Rajyindee Road,\nHadyai , Songkla 90110 Thailand\nTel 074-209790-1"],"heroImage":"https://carpetsinter.com/wp-content/uploads/2024/10/Aspekt-1.png","url":"https://carpetsinter.com/aspekt-insight/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    summary = EXCLUDED.summary,
    detail = EXCLUDED.detail,
    hero_image = EXCLUDED.hero_image,
    metadata = EXCLUDED.metadata,
    status = 'published',
    updated_at = NOW();

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, metadata)
VALUES (
    'Waterloo',
    'waterloo',
    'Subtle geometric patterns and a modern, minimalist color palette reflect the station’s ability to connect worlds while maintaining the sleek essence of metropolitan life.',
    'Inspired by this hub of movement, the carpet tiles reflect a structured yet fluid design, evoking the constant rhythm of arrivals and departures.',
    'The Waterloo Collection doesn’t just offer beautiful design inspired by seamless flow; it delivers top-tier performance where it counts. Built for high-traffic environments, these carpet tiles provide the ultimate in durability and flexibility for today’s dynamic spaces.

80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,

Pathumthani 12000
Tel +66(0)2976-0123',
    'https://carpetsinter.com/wp-content/uploads/2025/10/WL204-768x600.jpg',
    'published',
    '{"title":"Waterloo","tagline":"Subtle geometric patterns and a modern, minimalist color palette reflect the station’s ability to connect worlds while maintaining the sleek essence of metropolitan life.","summary":"Inspired by this hub of movement, the carpet tiles reflect a structured yet fluid design, evoking the constant rhythm of arrivals and departures.","detail":"The Waterloo Collection doesn’t just offer beautiful design inspired by seamless flow; it delivers top-tier performance where it counts. Built for high-traffic environments, these carpet tiles provide the ultimate in durability and flexibility for today’s dynamic spaces.\n\n80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,\n\nPathumthani 12000\nTel +66(0)2976-0123","headings":["Subtle geometric patterns and a modern, minimalist color palette reflect the station’s ability to connect worlds while maintaining the sleek essence of metropolitan life.","BRIGHT LIGHT BIG CITY : WATERLOO","DOWNLOAD OUR BROCHURE","RECOMMENDED INSTALLATION METHODS","Please direct your inquiries to our","A member of TCM Corporation Plc."],"paragraphs":["Inspired by this hub of movement, the carpet tiles reflect a structured yet fluid design, evoking the constant rhythm of arrivals and departures.","The Waterloo Collection doesn’t just offer beautiful design inspired by seamless flow; it delivers top-tier performance where it counts. Built for high-traffic environments, these carpet tiles provide the ultimate in durability and flexibility for today’s dynamic spaces.","80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,","Pathumthani 12000\nTel +66(0)2976-0123","India: amar@carpetsinter.com","Middle East: twee@carpetsinter.com","1/19 Moo 1, Mahidol, Pahdad,\nMuang, Chiangmai 50000 Thailand\nTel +66 (053) 274-584-5","31/19 Rajyindee Road,\nHadyai , Songkla 90110 Thailand\nTel 074-209790-1"],"heroImage":"https://carpetsinter.com/wp-content/uploads/2025/10/WL204-768x600.jpg","url":"https://carpetsinter.com/waterloo/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    summary = EXCLUDED.summary,
    detail = EXCLUDED.detail,
    hero_image = EXCLUDED.hero_image,
    metadata = EXCLUDED.metadata,
    status = 'published',
    updated_at = NOW();

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, metadata)
VALUES (
    'Architexture Connect',
    'architexture-connect',
    'Architexture Connect',
    'Architecture serves as a storyteller of our collective journey. It transcends its functional purpose through history and becomes a bridge connecting civilizations as we humans transport not only goods but also cultural influences throughout time.',
    'From towering skyscrapers that mirror aspirations to ancient monuments that whisper tales of our history, Architecture connects us to the past with a vision of the future.

Architexture Connect is an evolution of a timeless classic carpet, designed to compliment the ever changing needs of our interior spaces as we continue on our collective journey. The spaces we work, rest, play, learn and heal are all evolving and connecting in ways we never imagined before.

80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,',
    'https://carpetsinter.com/wp-content/uploads/2024/04/AC05-Bangkok-AC51-Silom-2-scaled-e1713320553884.jpg',
    'published',
    '{"title":"Architexture Connect","tagline":"Architexture Connect","summary":"Architecture serves as a storyteller of our collective journey. It transcends its functional purpose through history and becomes a bridge connecting civilizations as we humans transport not only goods but also cultural influences throughout time.","detail":"From towering skyscrapers that mirror aspirations to ancient monuments that whisper tales of our history, Architecture connects us to the past with a vision of the future.\n\nArchitexture Connect is an evolution of a timeless classic carpet, designed to compliment the ever changing needs of our interior spaces as we continue on our collective journey. The spaces we work, rest, play, learn and heal are all evolving and connecting in ways we never imagined before.\n\n80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,","headings":["Architexture Connect","Introducing Architexture Connect","Designed to bring together these spaces effortlessly, Carpets Inter brings you Architexture Connect to help you bridge together the spaces that will define our future.\nCarpets Inter, making connections.","Architexture Connect","ARCHITEXTURE: CONNECT","DOWNLOAD OUR BROCHURE","RECOMMENDED INSTALLATION METHODS","Please direct your inquiries to our","A member of TCM Corporation Plc."],"paragraphs":["Architecture serves as a storyteller of our collective journey. It transcends its functional purpose through history and becomes a bridge connecting civilizations as we humans transport not only goods but also cultural influences throughout time.","From towering skyscrapers that mirror aspirations to ancient monuments that whisper tales of our history, Architecture connects us to the past with a vision of the future.","Architexture Connect is an evolution of a timeless classic carpet, designed to compliment the ever changing needs of our interior spaces as we continue on our collective journey. The spaces we work, rest, play, learn and heal are all evolving and connecting in ways we never imagined before.","80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,","Pathumthani 12000\nTel +66(0)2976-0123","India: amar@carpetsinter.com","Middle East: twee@carpetsinter.com","1/19 Moo 1, Mahidol, Pahdad,\nMuang, Chiangmai 50000 Thailand\nTel +66 (053) 274-584-5","31/19 Rajyindee Road,\nHadyai , Songkla 90110 Thailand\nTel 074-209790-1"],"heroImage":"https://carpetsinter.com/wp-content/uploads/2024/04/AC05-Bangkok-AC51-Silom-2-scaled-e1713320553884.jpg","url":"https://carpetsinter.com/architexture-connect/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    summary = EXCLUDED.summary,
    detail = EXCLUDED.detail,
    hero_image = EXCLUDED.hero_image,
    metadata = EXCLUDED.metadata,
    status = 'published',
    updated_at = NOW();

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, metadata)
VALUES (
    'EBB Retreat',
    'ebb-retreat',
    'EBB and Flow',
    '1 Billion Down, Many More to Go!  We’ve successfully collected and recycled 1 billion plastic water bottles, preventing them from ending up in landfills and polluting our oceans.',
    'The Ebb and Flow of the Sea is a continual motion as water flows from the smallest springs and creeks to the flowing rivers and oceans around the planet. Upstream has been designed to highlight how Carpets Inter, for more than ten years has already helped divert the ongoing problem of plastic waste in our oceans from becoming part of this essential movement of water around our planet.

The ripple effect of long term sustainable design thinking can have the greatest impact on our environment and the wellbeing of our planet. “

Your message (optional)',
    'https://carpetsinter.com/wp-content/uploads/2022/08/20160901_141152-e1669097741564-768x493.jpg',
    'published',
    '{"title":"EBB and Flow","tagline":"EBB and Flow","summary":"1 Billion Down, Many More to Go!  We’ve successfully collected and recycled 1 billion plastic water bottles, preventing them from ending up in landfills and polluting our oceans.","detail":"The Ebb and Flow of the Sea is a continual motion as water flows from the smallest springs and creeks to the flowing rivers and oceans around the planet. Upstream has been designed to highlight how Carpets Inter, for more than ten years has already helped divert the ongoing problem of plastic waste in our oceans from becoming part of this essential movement of water around our planet.\n\nThe ripple effect of long term sustainable design thinking can have the greatest impact on our environment and the wellbeing of our planet. “\n\nYour message (optional)","headings":["EBB and Flow","EBB and FLOW","UPSTREAM EBB RETREAT","DOWNLOAD OUR BROCHURE","RECOMMENDED INSTALLATION METHODS","Please direct your inquiries to our","A member of TCM Corporation Plc."],"paragraphs":["1 Billion Down, Many More to Go!  We’ve successfully collected and recycled 1 billion plastic water bottles, preventing them from ending up in landfills and polluting our oceans.","The Ebb and Flow of the Sea is a continual motion as water flows from the smallest springs and creeks to the flowing rivers and oceans around the planet. Upstream has been designed to highlight how Carpets Inter, for more than ten years has already helped divert the ongoing problem of plastic waste in our oceans from becoming part of this essential movement of water around our planet.","The ripple effect of long term sustainable design thinking can have the greatest impact on our environment and the wellbeing of our planet. “","Your message (optional)","80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,","Pathumthani 12000\nTel +66(0)2976-0123","India: amar@carpetsinter.com","Middle East: twee@carpetsinter.com","1/19 Moo 1, Mahidol, Pahdad,\nMuang, Chiangmai 50000 Thailand\nTel +66 (053) 274-584-5","31/19 Rajyindee Road,\nHadyai , Songkla 90110 Thailand\nTel 074-209790-1"],"heroImage":"https://carpetsinter.com/wp-content/uploads/2022/08/20160901_141152-e1669097741564-768x493.jpg","url":"https://carpetsinter.com/upstream/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    summary = EXCLUDED.summary,
    detail = EXCLUDED.detail,
    hero_image = EXCLUDED.hero_image,
    metadata = EXCLUDED.metadata,
    status = 'published',
    updated_at = NOW();

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, metadata)
VALUES (
    'Discover',
    'discover',
    'Take a Journey of Discovery and Write your own Story',
    'Throughout time, explorers have unearthed history, uncovered ancient civilisations and discovered beauty from our past. In every corner of the Earth lies a story to be found. Weathered structures from the past create timeless beauty and intrigue in every Landmark. Local Artisans weave a rich tapestry for us to Discover though every unique Craft.',
    'Discover is a modular carpet tile collection inspired by the history and stories unravelled through the differences in culture and traditions around the world. The landmarks and crafts that define our past and help us determine our future.

Your message (optional)

80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,',
    'https://carpetsinter.com/wp-content/uploads/2022/08/MOUNTAIN-DV200-and-MOSAIC-DV202-768x479.jpg',
    'published',
    '{"title":"Take a Journey of Discovery and Write your own Story","tagline":"Take a Journey of Discovery and Write your own Story","summary":"Throughout time, explorers have unearthed history, uncovered ancient civilisations and discovered beauty from our past. In every corner of the Earth lies a story to be found. Weathered structures from the past create timeless beauty and intrigue in every Landmark. Local Artisans weave a rich tapestry for us to Discover though every unique Craft.","detail":"Discover is a modular carpet tile collection inspired by the history and stories unravelled through the differences in culture and traditions around the world. The landmarks and crafts that define our past and help us determine our future.\n\nYour message (optional)\n\n80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,","headings":["Take a Journey of Discovery and Write your own Story","Specification","Performance Test and Treatment","Specification","Performance Test and Treatment","Calligraphy DV102","Tattoo DV103","Henna DV104","Mountain DV200","Batik DV201","Mosaic DV202","Engrave DV204","DOWNLOAD OUR BROCHURE","RECOMMENDED INSTALLATION METHODS","Please direct your inquiries to our","A member of TCM Corporation Plc."],"paragraphs":["Throughout time, explorers have unearthed history, uncovered ancient civilisations and discovered beauty from our past. In every corner of the Earth lies a story to be found. Weathered structures from the past create timeless beauty and intrigue in every Landmark. Local Artisans weave a rich tapestry for us to Discover though every unique Craft.","Discover is a modular carpet tile collection inspired by the history and stories unravelled through the differences in culture and traditions around the world. The landmarks and crafts that define our past and help us determine our future.","Your message (optional)","80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,","Pathumthani 12000\nTel +66(0)2976-0123","India: amar@carpetsinter.com","Middle East: twee@carpetsinter.com","1/19 Moo 1, Mahidol, Pahdad,\nMuang, Chiangmai 50000 Thailand\nTel +66 (053) 274-584-5","31/19 Rajyindee Road,\nHadyai , Songkla 90110 Thailand\nTel 074-209790-1"],"heroImage":"https://carpetsinter.com/wp-content/uploads/2022/08/MOUNTAIN-DV200-and-MOSAIC-DV202-768x479.jpg","url":"https://carpetsinter.com/discover/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    summary = EXCLUDED.summary,
    detail = EXCLUDED.detail,
    hero_image = EXCLUDED.hero_image,
    metadata = EXCLUDED.metadata,
    status = 'published',
    updated_at = NOW();

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, metadata)
VALUES (
    'Flatlands',
    'flatlands',
    'Introducing FLATLANDS',
    'Named after the vast plains that cover much of the Earth, Flatlands monotone texture is ideal for creating an overall appearance on the floor. Flatlands provides a high performing ‘fit for purpose’ backdrop to functional spaces and can be used independently or as a matching coordinate together with the patterns of Mesa, Over the Ocean and Across the Sea.',
    'Due diligence of Flooring Contractor
The information shared are “recommendations” only and the installation flooring contractor must always dry-lay an area of approximately 4 cartons (20m2) and obtain the approval and sign-off by the Interior designer and project manager, before proceeding with a permanent application. Irrespective, during installation the carpet installer must be responsible to observe any ‘bold’ patterning lines occurring where the same color (dark or light) of edge yarn creates a noticeable wider line at the butt-join and relocate the adjacent module into another position.
For specific instructions or advice, please consult your local Carpets Inter representative Office.

Your message (optional)

80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,',
    'https://carpetsinter.com/wp-content/uploads/2022/08/FL02-FL11-and-FL15-e1668747237702-768x555.jpg',
    'published',
    '{"title":"Introducing FLATLANDS","tagline":"Introducing FLATLANDS","summary":"Named after the vast plains that cover much of the Earth, Flatlands monotone texture is ideal for creating an overall appearance on the floor. Flatlands provides a high performing ‘fit for purpose’ backdrop to functional spaces and can be used independently or as a matching coordinate together with the patterns of Mesa, Over the Ocean and Across the Sea.","detail":"Due diligence of Flooring Contractor\nThe information shared are “recommendations” only and the installation flooring contractor must always dry-lay an area of approximately 4 cartons (20m2) and obtain the approval and sign-off by the Interior designer and project manager, before proceeding with a permanent application. Irrespective, during installation the carpet installer must be responsible to observe any ‘bold’ patterning lines occurring where the same color (dark or light) of edge yarn creates a noticeable wider line at the butt-join and relocate the adjacent module into another position.\nFor specific instructions or advice, please consult your local Carpets Inter representative Office.\n\nYour message (optional)\n\n80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,","headings":["Introducing FLATLANDS","LIMITED STOCK/MADE TO ORDER COLORS","DOWNLOAD OUR BROCHURE","RECOMMENDED INSTALLATION METHODS","Please direct your inquiries to our","A member of TCM Corporation Plc."],"paragraphs":["Named after the vast plains that cover much of the Earth, Flatlands monotone texture is ideal for creating an overall appearance on the floor. Flatlands provides a high performing ‘fit for purpose’ backdrop to functional spaces and can be used independently or as a matching coordinate together with the patterns of Mesa, Over the Ocean and Across the Sea.","Due diligence of Flooring Contractor\nThe information shared are “recommendations” only and the installation flooring contractor must always dry-lay an area of approximately 4 cartons (20m2) and obtain the approval and sign-off by the Interior designer and project manager, before proceeding with a permanent application. Irrespective, during installation the carpet installer must be responsible to observe any ‘bold’ patterning lines occurring where the same color (dark or light) of edge yarn creates a noticeable wider line at the butt-join and relocate the adjacent module into another position.\nFor specific instructions or advice, please consult your local Carpets Inter representative Office.","Your message (optional)","80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,","Pathumthani 12000\nTel +66(0)2976-0123","India: amar@carpetsinter.com","Middle East: twee@carpetsinter.com","1/19 Moo 1, Mahidol, Pahdad,\nMuang, Chiangmai 50000 Thailand\nTel +66 (053) 274-584-5","31/19 Rajyindee Road,\nHadyai , Songkla 90110 Thailand\nTel 074-209790-1"],"heroImage":"https://carpetsinter.com/wp-content/uploads/2022/08/FL02-FL11-and-FL15-e1668747237702-768x555.jpg","url":"https://carpetsinter.com/flatlands/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    summary = EXCLUDED.summary,
    detail = EXCLUDED.detail,
    hero_image = EXCLUDED.hero_image,
    metadata = EXCLUDED.metadata,
    status = 'published',
    updated_at = NOW();

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, metadata)
VALUES (
    'Aspekt: Vue',
    'aspekt-vue',
    'Aspekt : Vue',
    'With clarity, confidence, and a commitment to innovative design, we proudly introduce the Aspekt Collection—a showcase of imaginative perspectives and forward-thinking creativity.',
    'At the heart of the Aspekt Collection is the concept of revealing new dimensions in design where every tile represents a different angle, a fresh perspective, and an opportunity to lead with distinction. Central to this collection are two distinct moods: Insight and Vue.

This series of Vue provide a fresh outlook, capturing the essence of modernity with a bold and visionary approach.

The Aspekt-Vue collection represents the fusion of premium quality and forward-thinking design, crafted for leaders who seek to make a lasting impact. Each tile is designed to inspire, reflecting the bold vision and drive of a successor ready to lead. The collection not only enhances well-being through its comfort and acoustic properties but also supports sustainability with materials focused on carbon reduction. Walking on Aspekt-Vue is an experience of leadership, confidence, and purpose, creating spaces where innovation thrives and environmental responsibility meets excellence.',
    'https://carpetsinter.com/wp-content/uploads/2024/10/vue-1-e1730109126599.jpg',
    'published',
    '{"title":"Aspekt : Vue","tagline":"Aspekt : Vue","summary":"With clarity, confidence, and a commitment to innovative design, we proudly introduce the Aspekt Collection—a showcase of imaginative perspectives and forward-thinking creativity.","detail":"At the heart of the Aspekt Collection is the concept of revealing new dimensions in design where every tile represents a different angle, a fresh perspective, and an opportunity to lead with distinction. Central to this collection are two distinct moods: Insight and Vue.\n\nThis series of Vue provide a fresh outlook, capturing the essence of modernity with a bold and visionary approach.\n\nThe Aspekt-Vue collection represents the fusion of premium quality and forward-thinking design, crafted for leaders who seek to make a lasting impact. Each tile is designed to inspire, reflecting the bold vision and drive of a successor ready to lead. The collection not only enhances well-being through its comfort and acoustic properties but also supports sustainability with materials focused on carbon reduction. Walking on Aspekt-Vue is an experience of leadership, confidence, and purpose, creating spaces where innovation thrives and environmental responsibility meets excellence.","headings":["Aspekt : Vue","Introducing Aspekt : Vue","Walking on Aspekt tiles is a statement of confidence and sophistication, where comfort meets innovation. Every step is a reflection of vision, legacy, and excellence, creating spaces that inspire success while supporting a greener future.","ASPEKT : VUE","DOWNLOAD OUR BROCHURE","RECOMMENDED INSTALLATION METHODS","Please direct your inquiries to our","A member of TCM Corporation Plc."],"paragraphs":["With clarity, confidence, and a commitment to innovative design, we proudly introduce the Aspekt Collection—a showcase of imaginative perspectives and forward-thinking creativity.","At the heart of the Aspekt Collection is the concept of revealing new dimensions in design where every tile represents a different angle, a fresh perspective, and an opportunity to lead with distinction. Central to this collection are two distinct moods: Insight and Vue.","This series of Vue provide a fresh outlook, capturing the essence of modernity with a bold and visionary approach.","The Aspekt-Vue collection represents the fusion of premium quality and forward-thinking design, crafted for leaders who seek to make a lasting impact. Each tile is designed to inspire, reflecting the bold vision and drive of a successor ready to lead. The collection not only enhances well-being through its comfort and acoustic properties but also supports sustainability with materials focused on carbon reduction. Walking on Aspekt-Vue is an experience of leadership, confidence, and purpose, creating spaces where innovation thrives and environmental responsibility meets excellence.","Your message (optional)","80 Moo 1, Pathumthani – Bangbuathong Road Bangkuwad, Muang,","Pathumthani 12000\nTel +66(0)2976-0123","India: amar@carpetsinter.com","Middle East: twee@carpetsinter.com","1/19 Moo 1, Mahidol, Pahdad,\nMuang, Chiangmai 50000 Thailand\nTel +66 (053) 274-584-5","31/19 Rajyindee Road,\nHadyai , Songkla 90110 Thailand\nTel 074-209790-1"],"heroImage":"https://carpetsinter.com/wp-content/uploads/2024/10/vue-1-e1730109126599.jpg","url":"https://carpetsinter.com/aspekt-vue/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    summary = EXCLUDED.summary,
    detail = EXCLUDED.detail,
    hero_image = EXCLUDED.hero_image,
    metadata = EXCLUDED.metadata,
    status = 'published',
    updated_at = NOW();
