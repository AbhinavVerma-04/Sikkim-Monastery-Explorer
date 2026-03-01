// Comprehensive list of monasteries in Sikkim with detailed authentic data
// Data cleaned and structured for easy frontend consumption

const cleanCitations = (text) => {
  if (!text) return text;
  return text.replace(/\[oai_citation:\d+‡[^\]]+\]/g, '')
            .replace(/\(\[turn\d+view\d+\]\([^)]+\)\)/g, '')
            .replace(/\(\[turn\d+search\d+\]\([^)]+\)\)/g, '')
            .trim();
};

const monasteries = [
  {
    name: "Enchey Monastery",
    link: "https://en.wikipedia.org/wiki/Enchey_Monastery",
    dataAvailable: true,
    location: {
      district: "East Sikkim",
      state: "Sikkim",
      country: "India"
    },
    coordinates: {
      latitude: 27.33583,
      longitude: 88.61917
    },
    established: 1840,
    foundedBy: "Lama Druptab Karpo",
    sect: "Nyingma (Vajrayana Buddhism)",
    architectureStyle: "Tibetan, Chinese pagoda influence",
    description: "Enchey Monastery is a Tibetan Buddhist monastery of the Nyingma order above Gangtok. It was originally a hermitage established by the tantric master Lama Drupthob Karpo and later developed into a full monastery. Its literal name means 'Solitary Monastery' and it is believed to be sacred because deities like Khangchendzonga, Yabdean and Mahākāla are connected with the site. The monastery became a religious centre around the then small hamlet of Gangtok.",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
    history: {
      early: "Originally established as a small gompa by Lama Drupthob Karpo, known for his tantric flying powers, after he flew from Maenam Hill to this site. The monastery was first built in the 1840s by the eighth Chogyal.",
      rebuild1909: "The monastery as seen today was aesthetically rebuilt in 1909 in a Chinese-pagoda style under the rule of Sikyong Tulku.",
      rebuild1948: "It was gutted in 1947 and subsequently rebuilt in 1948 with support from devotees."
    },
    architecture: {
      roof: "Shining golden cupola on top.",
      muralsAndPaintings: "Walls of the large prayer hall fully covered with paintings and murals of deities and religious figures.",
      pillars: "Four elaborately carved roof pillars.",
      sculptures: "Houses images of gods, goddesses, and religious objects.",
      scriptures: "Manuscripts of scriptures kept in an almirah."
    },
    monks: 90,
    festivals: [
      {
        name: "Detor Cham",
        description: "Colourful Cham dance festival held on the 18th and 19th day of the 12th lunar month (January/February)."
      },
      {
        name: "Singhe Chaam",
        description: "Masked dance festival performed once every three years."
      },
      {
        name: "Pang Lhabsol",
        description: "Commemorates the swearing of blood-brotherhood between the Bhutias and Lepchas in the presence of Khangchendzonga."
      }
    ],
    deitiesWorshipped: ["Buddha", "Loki Sharia", "Guru Padmasambhava"],
    culturalSignificance: "Considered sacred in Gangtok; it is believed that Khangchendzonga, Yabdean and Mahākāla reside in or near the monastery site and fulfil devotees' wishes.",
    earthquakeDamage: {
      "2006": "Enchey Monastery suffered severe structural damage during the Sikkim earthquake of 14 February 2006, with cracks in masonry walls and plaster loss.",
      previousEvents: "Earlier earthquakes in 1980 and 1988 had also damaged the structure."
    },
    features: ['Chaam Dance Festival', 'Traditional Murals', 'City Location', 'Tantric Buddhism', 'Annual Festivals'],
    rating: 4.6,
    visitors: 42000,
    openingHours: '6:00 AM - 7:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'Year Round',
    nearbyAttractions: ['Gangtok City', 'Hanuman Tok', 'Tashi View Point'],
    altitude: 1840,
    region: "East Sikkim"
  },
  
  {
    name: "Sang Monastery",
    link: "https://en.wikipedia.org/wiki/Sang_Monastery",
    dataAvailable: true,
    location: {
      village: "Sang",
      district: "East Sikkim",
      state: "Sikkim",
      country: "India"
    },
    coordinates: null,
    established: 1912,
    foundedBy: null,
    sect: "Kagyupa (Vajrayana Buddhism)",
    description: "Sang Monastery, also known as Karma Dubgyu Chokhorling Monastery, is a Buddhist monastery in Sang, East Sikkim, India. It was built in 1912 AD and belongs to the Kagyupa sect of Vajrayana Buddhism. The monastery houses two flat stone prints bearing the footprint and handprint of Phaya Lama, a prominent lama from Tibet who stayed and meditated in a nearby cave.",
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
    features: ["Kagyupa sect monastery", "Stone footprints and handprints of Phaya Lama", "Meditation cave nearby"],
    culturalSignificance: "The site is spiritually important because of the imprint relics of Phaya Lama, a revered lama who meditated in a nearby ravine cave.",
    restoration: {
      info: "The monastery was severely damaged by the earthquake of September 18, 2011 and later restored to its original state with support from the Chief Minister's Relief Fund and Ecclesiastical Affairs Department."
    },
    rating: 4.4,
    visitors: 15000,
    openingHours: '6:00 AM - 6:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'October to May',
    nearbyAttractions: ['Gangtok', 'Rumtek Monastery'],
    region: "East Sikkim"
  },
  
  {
    name: "Karthok Monastery",
    link: "https://en.wikipedia.org/wiki/Karthok_Monastery",
    dataAvailable: true,
    location: {
      town: "Pakyong",
      district: "Pakyong district",
      state: "Sikkim",
      country: "India"
    },
    coordinates: {
      latitude: 27.2408,
      longitude: 88.5880
    },
    established: null,
    foundedBy: "Chogyal Thutob Namgyal",
    sect: "Nyingma (Tibetan Buddhism)",
    description: "Karthok Monastery is a Buddhist monastery in Pakyong, a town in the foothills of the Himalayas in the East Sikkim district of the Indian state of Sikkim. It is considered the sixth oldest monastery of Sikkim and follows the Nyingma order of Tibetan Buddhism.",
    imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800",
    features: ["Nyingma order monastery", "Historic monastery in Pakyong", "One of the oldest monasteries in Sikkim"],
    rating: 4.3,
    visitors: 12000,
    openingHours: '7:00 AM - 5:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'March to June, September to December',
    nearbyAttractions: ['Pakyong Airport', 'Temi Tea Garden'],
    region: "East Sikkim"
  },
  
  {
    name: "Rhenock Monastery",
    link: "https://en.wikipedia.org/wiki/Rhenock_Monastery",
    dataAvailable: true,
    location: {
      region: "Sikkim",
      state: "Sikkim",
      country: "India"
    },
    coordinates: {
      latitude: 27.1844032,
      longitude: 88.6771017
    },
    established: null,
    foundedBy: null,
    sect: "Tibetan Buddhism",
    description: "Rhenock Monastery is a Buddhist monastery in Sikkim, northeastern India. It is one of the listed Buddhist monasteries in the state.",
    imageUrl: "https://images.unsplash.com/photo-1591825378301-2e65e50d6837?w=800",
    features: ["Buddhist monastery", "Tibetan Buddhist affiliation"],
    rating: 4.2,
    visitors: 10000,
    openingHours: '6:00 AM - 6:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'Year Round',
    nearbyAttractions: ['Gangtok'],
    region: "East Sikkim"
  },
  
  {
    name: "Simik Monastery",
    link: "https://en.wikipedia.org/wiki/Simik_Monastery",
    dataAvailable: true,
    location: {
      region: "Sikkim",
      state: "Sikkim",
      country: "India"
    },
    coordinates: {
      latitude: 27.287143,
      longitude: 88.470808
    },
    established: null,
    foundedBy: null,
    sect: "Tibetan Buddhism",
    description: "Simik Monastery is a Buddhist monastery in Sikkim, northeastern India. It follows Tibetan Buddhist tradition.",
    imageUrl: "https://images.unsplash.com/photo-1580407196238-dac33f57c410?w=800",
    features: ["Buddhist monastery", "Tibetan Buddhist affiliation"],
    rating: 4.1,
    visitors: 8000,
    openingHours: '6:00 AM - 6:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'October to May',
    nearbyAttractions: ['Gangtok', 'Rumtek'],
    region: "East Sikkim"
  },
  
  {
    name: "Hee Gyathang Monastery",
    link: "https://en.wikipedia.org/wiki/Hee_Gyathang_Monastery",
    dataAvailable: true,
    location: {
      area: "Upper Dzongu",
      district: "North Sikkim",
      state: "Sikkim",
      country: "India"
    },
    coordinates: null,
    established: 1914,
    foundedBy: "Abi Putso Rangdrol",
    sect: "Buddhist",
    description: "Hee Gyathang Monastery is a Buddhist monastery situated in Upper Dzongu in the North Sikkim district of India. It was built by the hermit Abi Putso Rangdrol in 1914.",
    imageUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800",
    features: ["Buddhist monastery", "Situated in Upper Dzongu, North Sikkim", "Founded by hermit Abi Putso Rangdrol"],
    rating: 4.3,
    visitors: 6000,
    openingHours: '7:00 AM - 5:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'March to June, September to November',
    nearbyAttractions: ['Dzongu region', 'Mangan'],
    region: "North Sikkim"
  },
  
  {
    name: "Labrang Monastery",
    link: "https://en.wikipedia.org/wiki/Labrang_Monastery_%28Sikkim%29",
    dataAvailable: true,
    location: {
      district: "North Sikkim",
      state: "Sikkim",
      country: "India"
    },
    coordinates: null,
    established: 1844,
    foundedBy: "Gyalshe Rigzing Chempa",
    sect: "Nyingmapa (Tibetan Buddhism)",
    description: "Labrang Monastery is a Buddhist monastery located in Phodong, North Sikkim, India. It is one of the important monasteries of the Nyingma tradition in Sikkim and lies about 2 km from Phodong Monastery. The monastery was completed around 1844 and was constructed in memory of Latsun Chembo of Kongpu, Tibet. It is situated on relatively flat ground amidst jungle hills.",
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
    architecture: {
      structure: "Retains original wooden pillars and roofing reinforced with steel; the building has unique architecture compared to other Sikkim monasteries which often burned down."
    },
    features: ["Monastery of the Nyingma tradition", "Located near Phodong Monastery", "Houses bronze statue of Karma Guru", "Museum with Buddha statues, sutras and murals"],
    culturalSignificance: "An important monastery of the Nyingmapa lineage in Northern Sikkim and a peaceful place for meditation.",
    nearbyAttractions: ["Phodong Monastery"],
    rating: 4.5,
    visitors: 14000,
    openingHours: '7:00 AM - 5:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'March to June, October to December',
    region: "North Sikkim"
  },
  
  {
    name: "Lachen Monastery",
    link: "https://en.wikipedia.org/wiki/Lachen_Monastery",
    dataAvailable: true,
    location: {
      region: "North Sikkim",
      state: "Sikkim",
      country: "India"
    },
    coordinates: {
      latitude: 27.7162407,
      longitude: 88.5566106
    },
    established: 1858,
    foundedBy: null,
    sect: "Nyingma (Tibetan Buddhism)",
    description: "Lachen Monastery (also called Ngodrub Choling Gonpa, \"Launching Gompa\") is a Nyingma Buddhist monastery near Lachen, North Sikkim, India. It was built in 1858 and is home to the Lachen Monastic School.",
    imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800",
    features: ["Nyingma Buddhist monastery", "Also called Ngodrub Choling Gonpa", "Home to Lachen Monastic School"],
    rating: 4.4,
    visitors: 18000,
    openingHours: '6:00 AM - 6:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'April to June, September to November',
    nearbyAttractions: ['Lachen Valley', 'Gurudongmar Lake'],
    altitude: 2750,
    region: "North Sikkim"
  },
  
  {
    name: "Lachung Monastery",
    link: "https://en.wikipedia.org/wiki/Lachung_Monastery",
    dataAvailable: true,
    location: {
      village: "Lachung",
      district: "Mangan district, North Sikkim",
      state: "Sikkim",
      country: "India"
    },
    coordinates: null,
    established: 1880,
    foundedBy: null,
    sect: "Nyingma (Tibetan Buddhism)",
    description: "Lachung Monastery is a Nyingma Buddhist gompa in the Lachung Valley in Mangan district in the northeastern Indian state of Sikkim. It was established in 1880. The monastery is an important religious centre of the region and is connected with local cultural and spiritual traditions.",
    imageUrl: "https://images.unsplash.com/photo-1591825378301-2e65e50d6837?w=800",
    features: ["Nyingma Buddhist monastery", "Located in Lachung Valley", "Annual mask dance ceremonies"],
    festivals: [
      {
        name: "Mask Dance (Cham)",
        description: "Annual masked dance held during winter months as a religious ritual."
      }
    ],
    culturalSignificance: "The monastery serves as a prominent centre for religious and cultural activity in Lachung village and hosts traditional ceremonies that are central to the spiritual life of the community.",
    nearbyAttractions: ["Lachung town", "Yumthang Valley"],
    rating: 4.5,
    visitors: 22000,
    openingHours: '6:00 AM - 6:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'April to June, September to November',
    altitude: 2750,
    region: "North Sikkim"
  },
  
  {
    name: "Phensang Monastery",
    link: "https://en.wikipedia.org/wiki/Phensang_Monastery",
    dataAvailable: true,
    location: {
      village: "Phensang",
      district: "North District",
      state: "Sikkim",
      country: "India"
    },
    coordinates: {
      latitude: 27.42028,
      longitude: 88.61028
    },
    established: 1721,
    foundedBy: "Jigme Pawo",
    sect: "Nyingmapa (Tibetan Buddhism)",
    description: "Phensang Monastery is a Buddhist monastery of the Nyingmapa Order in Phensang, Sikkim, India, located about 9 km north of Gangtok. It was established in 1721 during the time of Jigme Pawo. The monastery belongs to the Nyingmapa sect of Tibetan Buddhism.",
    imageUrl: "https://images.unsplash.com/photo-1580407196238-dac33f57c410?w=800",
    features: ["Nyingmapa Order monastery", "One of the historic monasteries in North Sikkim"],
    festivals: [
      {
        name: "Annual Festival",
        description: "Held on the 28th and 29th days of the 10th Tibetan month according to the traditional calendar."
      }
    ],
    rating: 4.3,
    visitors: 16000,
    openingHours: '6:00 AM - 6:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'Year Round',
    nearbyAttractions: ['Gangtok', 'Enchey Monastery'],
    region: "North Sikkim"
  },
  
  {
    name: "Phodong Monastery",
    link: "https://en.wikipedia.org/wiki/Phodong_Monastery",
    dataAvailable: true,
    location: {
      district: "North Sikkim",
      state: "Sikkim",
      country: "India"
    },
    coordinates: {
      latitude: 27.41278,
      longitude: 88.58389
    },
    established: 1740,
    foundedBy: "Chogyal Gyurmed Namgyal",
    sect: "Kagyupa (Karma Kagyu, Tibetan Buddhism)",
    architectureStyle: "Early 18th century Tibetan Buddhist monastic architecture",
    description: "Phodong Monastery (also spelled Phodang or Podong) is a Buddhist monastery in Sikkim, India located 28 kilometres from Gangtok. It was built in the early 18th century, with an older monastery existing earlier. The 9th Karmapa Wangchuk Dorje was invited by the King of Sikkim to establish this and other monasteries. It was reconstructed later under Sidkeong Tulku Namgyal. The monastery serves as one of the important seats of the Karma Kagyu tradition.",
    imageUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800",
    architecture: {
      style: "Early 18th century Tibetan Buddhist monastic architecture"
    },
    features: ["Buddhist monastery of the Karma Kagyu (Kagyupa) sect", "Reconstructed historic building from early 18th century", "Residence of approximately 260 monks", "Collection of ancient murals"],
    monks: 260,
    festivals: [
      {
        name: "Chaam Dance",
        description: "Held on the 28th and 29th day of the 10th Tibetan month."
      }
    ],
    culturalSignificance: "One of the six important monasteries in Sikkim and a principal seat of the Karma Kagyu lineage, linked with the 9th Karmapa.",
    rating: 4.6,
    visitors: 28000,
    openingHours: '7:00 AM - 6:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'March to June, October to December',
    nearbyAttractions: ['Labrang Monastery', 'Gangtok'],
    region: "North Sikkim"
  },
  
  {
    name: "Tholung Monastery",
    link: "https://en.wikipedia.org/wiki/Tholung_Monastery",
    dataAvailable: true,
    location: {
      area: "Upper Dzongu",
      district: "North Sikkim",
      state: "Sikkim",
      country: "India",
      altitudeFeet: 8000
    },
    coordinates: {
      latitude: 27.637,
      longitude: 88.461
    },
    established: 1789,
    foundedBy: "Chogyal Phuntsog Namgyal II",
    sect: "Nyingmapa (Tibetan Buddhism)",
    description: "Tholung Monastery is a gompa located in remote upper Dzongu within the buffer zone of Khangchendzonga National Park and is considered one of the most sacred monasteries in Sikkim. It was originally constructed in the early 18th century by Chogyal Phuntsog Namgyal II and houses precious manuscripts and relics from other Sikkimese monasteries that were brought here for protection during the Nepalese invasion. The monastery follows the Nyingmapa school of Tibetan Buddhism and is listed as a World Heritage property.",
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
    history: {
      sacredDiscovery: "Tholung was revealed as a sacred place by the 4th Lhatsun, Kunzang Jigmed Gyatso, in 1760, and in 1789 Pema Dechhen Gyatso constructed a monastery at the site.",
      relicProtection: "During the Gorkha invasion, the monastery became a refuge for ancient manuscripts, Sikkimese art, relics and sacred objects from other gompas.",
      caretakers: "After the Nepalese invasion, two monks were appointed to watch over the relics, and their descendants were curators until the 1940s, after which the Ecclesiastical Department of the Government of Sikkim took over."
    },
    features: ["Repository of ancient Sikkimese Buddhist manuscripts and relics", "Metal chorten enclosing ashes of an incarnate of Lama Latsun Chembo", "Located deep within the Dzongu region's sacred landscape"],
    festivals: [
      {
        name: "Kamsil Ceremony",
        description: "Held every three years during April when relics and sacred objects are removed from their protective boxes, ventilated and displayed to the public, and worshipers receive them."
      }
    ],
    culturalSignificance: "Tholung Monastery is one of the most sacred Buddhist sites in Sikkim, preserving priceless artefacts, ancient texts and relics of immeasurable spiritual importance. It occupies a central place in the religious history and traditions of the region.",
    architecture: {
      originalConstruction: "18th century gompa construction by royal authority",
      reconstruction: "The current monastery was reconstructed in 1980 because the old structure had deteriorated."
    },
    rating: 4.8,
    visitors: 8000,
    openingHours: '7:00 AM - 5:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'April to June, September to November',
    nearbyAttractions: ['Khangchendzonga National Park', 'Dzongu region'],
    altitude: 2438,
    region: "North Sikkim"
  },
  
  {
    name: "Chawayng Ani Monastery",
    link: "https://en.wikipedia.org/wiki/Chawayng_Ani_Monastery",
    dataAvailable: true,
    location: {
      state: "Sikkim",
      country: "India"
    },
    coordinates: null,
    established: null,
    foundedBy: "Chogyal Tsugphud Namgyal",
    sect: "Tibetan Buddhism",
    description: "Chawayng Ani Monastery is a Buddhist monastery in Sikkim, northeastern India. It is one of the Buddhist monasteries located in the state of Sikkim.",
    imageUrl: "https://images.unsplash.com/photo-1591825378301-2e65e50d6837?w=800",
    features: ["Buddhist monastery", "Affiliated with Tibetan Buddhism"],
    rating: 4.2,
    visitors: 7000,
    openingHours: '6:00 AM - 6:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'Year Round',
    nearbyAttractions: ['Gangtok'],
    region: "North Sikkim"
  },
  
  {
    name: "Namchi Monastery",
    link: "https://en.wikipedia.org/wiki/Namchi_Monastery",
    dataAvailable: true,
    location: {
      region: "Sikkim",
      country: "India"
    },
    coordinates: {
      latitude: 27.165,
      longitude: 88.366
    },
    established: null,
    foundedBy: null,
    sect: "Tibetan Buddhism",
    description: "Namchi Monastery is a Buddhist monastery in Sikkim, northeastern India. It is listed among the Buddhist monasteries in the state.",
    imageUrl: "https://images.unsplash.com/photo-1580407196238-dac33f57c410?w=800",
    features: ["Buddhist monastery", "Affiliated with Tibetan Buddhism"],
    rating: 4.3,
    visitors: 20000,
    openingHours: '6:00 AM - 6:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'Year Round',
    nearbyAttractions: ['Namchi Char Dham', 'Samdruptse Hill'],
    region: "South Sikkim"
  },
  
  {
    name: "Tendong Gumpa",
    link: "https://en.wikipedia.org/wiki/Tendong_Gumpa",
    dataAvailable: true,
    location: {
      peak: "Tendong Peak",
      district: "South Sikkim",
      state: "Sikkim",
      country: "India",
      altitudeFeet: 8530
    },
    coordinates: {
      latitude: 27.20611,
      longitude: 88.40806
    },
    established: 1955,
    foundedBy: "Gomchen Pema Chewang Tamang",
    sect: "Nyingma (Tibetan Buddhism)",
    architectureStyle: "Tibetan architecture",
    description: "Tendong Gumpa, also known as Tendong Dichhen Salhun Gumpa, is a Buddhist monastery situated atop Tendong Peak in South Sikkim, India. It lies at an altitude of 8,530 ft above mean sea level, surrounded by lush virgin reserve forest. The monastery was built in 1955 with the support of the then King and Queen of Sikkim and is affiliated with the Nyingma order of Tibetan Buddhism.",
    imageUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800",
    architecture: {
      style: "Tibetan architecture",
      details: "Two-story Gurulakhang (main monastery) and separate Manilakhang for worshipping Cherenzig, prayer wheels, meditation hut, and 50 ft tower offering scenic views."
    },
    features: ["Buddhist monastery of the Nyingma sect", "Located atop Tendong Peak with panoramic views", "Tibetan architectural style", "Two shrines including Gurulakhang and Manilakhang", "Library with expanding collection"],
    festivals: [
      {
        name: "Tshechu",
        description: "Observed during March–April on the tenth day of the Tibetan lunar calendar, when local people come to offer prayers for health and prosperity. This coincides with Rama Navami in Sikkim."
      },
      {
        name: "Buddha Poornima",
        description: "Celebrated as one of the festivals at the monastery."
      }
    ],
    culturalSignificance: "Due to its seclusion and spiritual setting, Tendong Gumpa has traditionally been a site for meditation by Buddhist lamas seeking solitude atop Tendong Peak.",
    earthquakeDamage: {
      "2011": "The monastery was partially damaged in the 2011 Sikkim earthquake and was renovated with government aid."
    },
    infrastructure: {
      shrines: ["Gurulakhang (main monastery)", "Manilakhang (dedicated to Cherenzig)"],
      library: "Library established to impart Buddhist knowledge",
      observationTower: "Approximately 50 ft tall tower with views of the Kanchenjunga range."
    },
    nearbyAttractions: ["Damthang (6 km by foot)", "Namchi", "Gangtok", "Ravangla via Damthang"],
    rating: 4.6,
    visitors: 16000,
    openingHours: '7:00 AM - 5:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'March to June, October to December',
    altitude: 2600,
    region: "South Sikkim"
  },
  
  {
    name: "Pemayangtse Monastery",
    link: "https://en.wikipedia.org/wiki/Pemayangtse_Monastery",
    dataAvailable: true,
    location: {
      village: "Pemayangtse",
      district: "Gyalshing district",
      state: "Sikkim",
      country: "India"
    },
    coordinates: {
      latitude: 27.30444,
      longitude: 88.25278
    },
    established: 1705,
    foundedBy: "Lama Lhatsun Chempo",
    sect: "Nyingma (Tibetan Buddhism)",
    description: "Pemayangtse Monastery is a Buddhist monastery in Pemayangtse, near Gyalshing city in the Gyalshing district of Sikkim, India. Planned, designed and founded by Lama Lhatsun Chempo, it is one of the oldest and premier monasteries in Sikkim and follows the Nyingma order of Tibetan Buddhism. Originally started as a small Lhakhang, it was enlarged and consecrated in the early 18th century. It controls other Nyingma monasteries in the state and is noted for traditions involving monks chosen from the Bhutia community.",
    imageUrl: "https://images.unsplash.com/photo-1591825378301-2e65e50d6837?w=800",
    features: ["Historic Nyingma order monastery", "Located on a scenic hilltop near Pelling", "One of the oldest monasteries in Sikkim", "Monks of pure lineage (ta-tshang)"],
    architecture: {
      style: "Three-storied Tibetan Buddhist monastery",
      details: "Built with colourful painted doors, windows and traditional Tibetan designs. The main prayer hall contains statues of Padmasambhava (in wrathful form) and his consorts, as well as walls with murals. The structure overlooks the Rabdentse ruins."
    },
    festivals: [
      {
        name: "Chaam Dance Festival",
        description: "Held annually on the 28th and 29th day of the 12th Tibetan lunar month (around February), when lamas perform masked dances symbolizing deities. Pilgrims from across Sikkim visit to witness the celebrations."
      }
    ],
    monks: 108,
    culturalSignificance: "Pemayangtse Monastery is one of the most revered Buddhist monasteries in Sikkim. The head lama traditionally had the privilege of anointing Sikkim's Chogyals (kings) with holy water. The monastery serves as an important religious seat and heritage site for the Nyingma tradition in the region.",
    nearbyAttractions: ["Rabdentse Ruins", "Sanga Choeling Monastery", "Khecheopalri Lake", "Dubdi Monastery", "Tashiding Monastery"],
    rating: 4.9,
    visitors: 35000,
    openingHours: '7:00 AM - 5:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'March to June, September to December',
    altitude: 2085,
    region: "West Sikkim"
  },
  
  {
    name: "Sanga Choeling Monastery",
    link: "https://en.wikipedia.org/wiki/Sanga_Choeling_Monastery",
    dataAvailable: true,
    location: {
      village: "Sanga Choeling",
      nearTown: "Pelling",
      district: "Gyalshing district",
      state: "Sikkim",
      country: "India"
    },
    coordinates: {
      latitude: 27.26389,
      longitude: 88.22139
    },
    established: 1701,
    foundedBy: "Lhatsün Namkha Jikmé",
    sect: "Nyingma (Tibetan Buddhism)",
    description: "Sanga Choeling Monastery, also spelled Sange Choeling Monastery, is one of the oldest Buddhist monasteries in Sikkim, located on a ridge above Pelling. Established in 1701 by Lama Lhatsün Namkha Jikmé, its literal meaning is 'Island of the Guhyamantra teachings', referring to Vajrayana Buddhism. It sits about 10 km from Gyalshing city and is part of a traditional pilgrimage circuit in the region.",
    imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800",
    features: ["One of the oldest monasteries in Sikkim", "Located on a scenic ridge above Pelling", "Historic Nyingma sect monastery", "Clay statues dating back to the 17th century"],
    architecture: {
      style: "Tibetan",
      details: "The monastery has Tibetan architectural style and houses ancient clay statues and religious paintings. It has been rebuilt multiple times after fire damage."
    },
    festivals: [
      {
        name: "Monthly Lamas Prayers",
        description: "On the tenth day of every Tibetan calendar month, lamas recite hymns and special prayers are held morning and evening. The monastery is traditionally reserved for men."
      }
    ],
    culturalSignificance: "Sanga Choeling Monastery is an important religious and heritage site for Buddhism in Sikkim. Pilgrims visit it as part of a circuit that includes Pemayangtse Monastery, Rabdentse ruins, Khecheopalri Lake, Norbugang Chorten, Dubdi Monastery, Yuksom and Tashiding Monastery.",
    nearbyAttractions: ["Pemayangtse Monastery", "Rabdentse Ruins", "Khecheopalri Lake", "Norbugang Chorten", "Dubdi Monastery", "Yuksom", "Tashiding Monastery"],
    rating: 4.7,
    visitors: 26000,
    openingHours: '7:00 AM - 5:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'March to June, September to December',
    altitude: 2150,
    region: "West Sikkim"
  },
  
  {
    name: "Tashiding Monastery",
    link: "https://en.wikipedia.org/wiki/Tashiding_Monastery",
    dataAvailable: true,
    location: {
      village: "Tashiding",
      district: "Gyalshing district",
      state: "Sikkim",
      country: "India"
    },
    coordinates: {
      latitude: 27.30833,
      longitude: 88.29806
    },
    established: 1717,
    foundedBy: "Ngadak Sempa Chenpo",
    sect: "Nyingma (Tibetan Buddhism)",
    architectureStyle: "Traditional Tibetan Buddhist monastery complex",
    description: "Tashiding Monastery is a Buddhist monastery of the Nyingma sect of Tibetan Buddhism located in Tashiding, about 27 km from Gyalshing in the Gyalshing district of Sikkim, India. It is considered one of the most sacred and holiest monasteries in Sikkim and is often described as the 'Heart of Sikkim/Denzong' due to its religious significance. The monastery is situated atop a hill rising between the Rathong Chu and Rangeet Rivers with views of Mt. Kanchenjunga in the backdrop. It is part of the traditional Buddhist pilgrimage circuit of Sikkim. The site was originally marked by a small Lhakhang built in the 17th century and was extended and renovated into the present monastery in 1717 during the reign of the third Chogyal Chakdor Namgyal.",
    imageUrl: "https://images.unsplash.com/photo-1580407196238-dac33f57c410?w=800",
    architecture: {
      style: "Traditional Tibetan Buddhist monastery complex",
      details: "The monastery complex features multiple buildings including the main Gompa (Chogyal Lhakhang), chortens, butter lamp houses, prayer wheels, and mani stone slabs inscribed with Buddhist mantras such as 'Om Mani Padme Hum'. Some parts have been renovated over time while older structures and chortens still exist on site."
    },
    features: ["Perched on a heart-shaped hill above the Rathong Chu and Rangeet rivers", "Considered the spiritual centre of Sikkim", "Part of the traditional Buddhist pilgrimage circuit", "Houses sacred chortens and mani stones with Buddhist inscriptions", "Revered as 'Devoted Central Glory' (Tashiding)"],
    festivals: [
      {
        name: "Bhumchu Festival",
        description: "The Bhumchu (holy water) festival is held annually on the 14th and 15th day of the first month of the Tibetan lunar calendar. A sacred vase filled with holy water stored at the monastery is opened for public display and worship. The level and purity of the water are interpreted as a prediction of prosperity or adversity for the coming year. Pilgrims from across Sikkim and beyond attend this major religious event."
      }
    ],
    culturalSignificance: "Tashiding Monastery is revered as one of the holiest sacred places in Sikkim. It is associated with local legends involving Guru Padmasambhava and the consecration of the first Chogyal of Sikkim. The monastery also holds great significance within the region's Buddhist pilgrimage circuit alongside other historic sites such as Dubdi Monastery and Pemayangtse Monastery.",
    nearbyAttractions: ["Dubdi Monastery", "Norbugang Chorten", "Pemayangtse Monastery", "Rabdentse Ruins", "Sanga Choeling Monastery", "Khecheopalri Lake"],
    rating: 4.9,
    visitors: 28000,
    openingHours: '6:00 AM - 5:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'October to May',
    altitude: 1465,
    region: "West Sikkim"
  },
  
  {
    name: "Bermiok Monastery",
    link: "https://en.wikipedia.org/wiki/Bermiok_Monastery",
    dataAvailable: true,
    location: {
      region: "South Sikkim",
      state: "Sikkim",
      country: "India"
    },
    coordinates: {
      latitude: 27.2262832,
      longitude: 88.4574415
    },
    established: 1873,
    foundedBy: null,
    sect: "Karma Kagyu (Tibetan Buddhism)",
    description: "Bermiok Monastery, also known as Bermiok Wosel Choling Monastery, is a Buddhist monastery in South Sikkim above Singtam. The monastery belongs to the Karma Kagyu lineage of Tibetan Buddhism and was founded in 1873. Due to earthquake damage, it was renovated and reconstructed in 1954. The premises feature a manilhakang built in 1954 and rebuilt in 1987, which houses statues of Amitābha and the chagtong chentong form of Avalokiteśvara.",
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
    architecture: {
      details: "The monastery features a manilhakang (prayer wheel house) constructed in 1954 and rebuilt in 1987, containing statues of Amitābha and the chagtong chentong form of Avalokiteśvara. The manilhakang has mani wheels around its structure."
    },
    features: ["Monastery of the Karma Kagyu lineage", "Manilhakang housing Buddha Amitābha and Avalokiteśvara statues", "Rebuilt structure after earthquakes"],
    rating: 4.4,
    visitors: 13000,
    openingHours: '7:00 AM - 5:00 PM',
    entryFee: 'Free',
    bestTimeToVisit: 'March to June, October to December',
    nearbyAttractions: ['Singtam', 'Gangtok'],
    region: "South Sikkim"
  }
];

module.exports = monasteries;
