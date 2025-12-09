import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();


const guidesData = [
  {
    name: 'Rinzi Sherpa',
    location: 'Kathmandu',
    bio: 'Your friendly guide to the hidden temples and vibrant markets of the city.',
    imageUrl: '/images/guide1.jpg',
    specialty: 'City & History Tours',
    type: 'PROFESSIONAL'
  },
  {
    name: 'Sonam Tamang',
    location: 'Pokhara',
    bio: 'Let me show you the best views of the Annapurnas and the most peaceful spots by the lake.',
    imageUrl: '/images/guide2.jpg',
    specialty: 'Trekking & Nature',
    type: 'PROFESSIONAL'
  },
  {
    name: 'Anjali Gurung',
    location: 'Chitwan',
    bio: 'Passionate about wildlife and conservation. I’ll help you spot rhinos and tigers!',
    imageUrl: '/images/guide3.jpg',
    specialty: 'Wildlife Safari',
    type: 'PROFESSIONAL'
  },
];

  const lodgingsWithRoomsData = [
  { 
    name: 'Kathmandu Marriott Hotel', 
    description: 'A modern, 5-star hotel in the city center, near Thamel, offering luxurious stays with stunning city and mountain views.', 
    imageUrl: '/images/marriottHotel.avif', 
    area: 'Kathmandu',
    address: 'Manakamana Marg, Naxal, Kathmandu 44600',
    starRating: 5.0,
    reviewScore: 9.2,
    reviewCount: 345,
    amenities: [
      'Spa and wellness center', 'Outdoor swimming pool', 'Free WiFi everywhere', 'Restaurant & Bar', 'Fitness center', 'Room service', 'Airport shuttle (extra)'
    ],
    nearbyPlaces: [
      { name: "Narayanhiti Palace Museum", time: "10 min walk" },
      { name: "Thamel Tourist Hub", time: "15 min walk" },
      { name: "Garden of Dreams", time: "12 min walk" },
      { name: "Tribhuvan Intl. Airport (KTM)", time: "20 min drive" }
    ],
    rooms: {
      create: [
        { name: 'Deluxe Guest Room, 1 King', description: 'A comfortable room with one king bed and city views.', pricePerNight: 15000, maxGuests: 2, imageUrls: ['/images/rooms/marriott-king.jpg']},
        { name: 'Deluxe Guest Room, 2 Twin', description: 'A well-appointed room with two twin beds.', pricePerNight: 16000, maxGuests: 2, imageUrls: ['/images/rooms/marriott-twin.jpg']},
        { name: 'Executive Suite', description: 'Spacious suite with lounge access and premium amenities.', pricePerNight: 25000, maxGuests: 3, imageUrls: ['/images/rooms/marriott-suite.jpg']}
      ]
    }
  },
  { 
    name: 'Dwarika\'s Hotel', 
    description: 'A unique heritage hotel featuring extensive Nepali woodwork, capturing the beauty and spirit of ancient Kathmandu.', 
    imageUrl: '/images/dwarikasHotel.webp', 
    area: 'Kathmandu',
    address: 'Battisputali, Kathmandu 44600',
    starRating: 5.0,
    reviewScore: 9.6,
    reviewCount: 520,
    amenities: [
      'Heritage Architecture', 'Multiple award-winning restaurants', 'Outdoor pool', 'Ayurvedic Spa', 'Library', 'Yoga classes', 'Airport shuttle'
    ],
    nearbyPlaces: [
      { name: "Pashupatinath Temple", time: "10 min walk" },
      { name: "Boudhanath Stupa", time: "10 min drive" },
      { name: "Tribhuvan Intl. Airport", time: "5 min drive" },
      { name: "Royal Nepal Golf Course", time: "5 min walk" }
    ],
    rooms: {
      create: [
        { name: 'Heritage Deluxe Room', description: 'Individually designed room with traditional decor and modern comforts.', pricePerNight: 22000, maxGuests: 2, imageUrls: ['/images/rooms/dwarika-deluxe.jpg']},
        { name: 'Courtyard Suite', description: 'A spacious suite overlooking the tranquil courtyard.', pricePerNight: 30000, maxGuests: 2, imageUrls: ['/images/rooms/dwarika-suite.jpg']}
      ]
    }
  },
  { 
    name: 'Hotel Pokhara Grande', 
    description: 'Luxury hotel with a pool and stunning Annapurna mountain views, perfect for relaxation after a trek.', 
    imageUrl: '/images/pokharaGrande.jpg', 
    area: 'Pokhara',
    address: 'Pardi, Pokhara 33700',
    starRating: 5.0,
    reviewScore: 8.8,
    reviewCount: 210,
    amenities: [
      'Large outdoor pool', 'Spa & Wellness Centre', 'Fitness Centre', 'Multi-cuisine Restaurant', 'Bar/Lounge', 'Business Center', 'Free Airport Shuttle'
    ],
    nearbyPlaces: [
      { name: "Pokhara Airport", time: "5 min drive" },
      { name: "Davis Falls", time: "10 min drive" },
      { name: "Phewa Lake", time: "15 min drive" },
      { name: "International Mountain Museum", time: "8 min drive" }
    ],
    rooms: {
      create: [
        { name: 'Standard Room', description: 'A cozy room with views of the garden or city.', pricePerNight: 8000, maxGuests: 2, imageUrls: ['/images/rooms/grande-standard.jpg']},
        { name: 'Mountain View Deluxe', description: 'Spacious room with a private balcony facing the Himalayas.', pricePerNight: 12000, maxGuests: 2, imageUrls: ['/images/rooms/grande-deluxe.jpg']}
      ]
    }
  },
  { 
    name: 'Temple Tree Resort & Spa', 
    description: 'A beautiful boutique resort in the heart of Lakeside, blending western standards with distinctive Nepali architecture.', 
    imageUrl: '/images/templeTreeResort.jpeg', 
    area: 'Pokhara',
    address: 'Gaurighat, Lakeside 6, Pokhara',
    starRating: 4.5,
    reviewScore: 9.1,
    reviewCount: 405,
    amenities: [
      'Infinity Pool', 'Full-service Spa', 'Lakeside Location', 'Free Breakfast', 'Bar & Lounge', 'Garden', 'Concierge Service'
    ],
    nearbyPlaces: [
      { name: "Phewa Lake", time: "2 min walk" },
      { name: "Tal Barahi Temple", time: "5 min walk + boat" },
      { name: "Lakeside Market", time: "1 min walk" },
      { name: "World Peace Pagoda", time: "25 min drive" }
    ],
    rooms: {
      create: [
        { name: 'Deluxe Room', description: 'Elegant room blending modern design with natural elements and a private balcony.', pricePerNight: 11000, maxGuests: 2, imageUrls: ['/images/rooms/temple-tree.jpeg']}
      ]
    }
  },
  { 
    name: 'Bardia Tiger Resort', 
    description: 'A jungle lodge offering safaris and nature walks near the park, dedicated to sustainable eco-tourism.', 
    imageUrl: '/images/bardiaTigerResort.jpg', 
    area: 'Bardia National Park',
    address: 'Thakurdwara, Bardia National Park',
    starRating: 3.5,
    reviewScore: 8.5,
    reviewCount: 85,
    amenities: [
      'Jungle Safari Packages', 'River Rafting', 'Tharu Cultural Dance', 'Garden Restaurant', 'Free Parking', 'Pet Friendly', 'Nature Guides'
    ],
    nearbyPlaces: [
      { name: "Bardia National Park Entrance", time: "5 min walk" },
      { name: "Karnali River", time: "10 min drive" },
      { name: "Tharu Village", time: "10 min walk" },
      { name: "Elephant Breeding Center", time: "15 min walk" }
    ],
    rooms: {
      create: [
        { name: 'Jungle Bungalow', description: 'A private bungalow with a veranda, immersed in nature.', pricePerNight: 7500, maxGuests: 2, imageUrls: ['/images/rooms/bardia-bungalow.avif']}
      ]
    }
  },
  { 
    name: 'Horizon Homestay', 
    description: 'A cozy homestay with a local Newari family in Tansen, offering authentic meals and a warm welcome.', 
    imageUrl: '/images/horizonHomestay.jpg', 
    area: 'Tansen',
    address: 'Bartung, Tansen, Palpa',
    starRating: 3.0,
    reviewScore: 9.4,
    reviewCount: 60,
    amenities: [
      'Home-cooked meals', 'Rooftop Terrace', 'Free WiFi', 'Cultural Exchange', 'Hot Shower', 'Local Tour Advice'
    ],
    nearbyPlaces: [
      { name: "Tansen Durbar", time: "10 min walk" },
      { name: "Srinagar Hill", time: "30 min hike" },
      { name: "Rani Mahal", time: "3 hr hike / 1 hr drive" },
      { name: "Amar Narayan Temple", time: "15 min walk" }
    ],
    rooms: {
      create: [
        { name: 'Guest Room', description: 'A simple and clean room with a shared bathroom and hill views.', pricePerNight: 2000, maxGuests: 2, imageUrls: ['/images/rooms/tansen-room.jpg']}
      ]
    }
  },
  { 
    name: 'Hotel Sita Sharan', 
    description: 'A comfortable hotel very close to the Janaki Mandir, providing modern amenities for pilgrims and tourists.', 
    imageUrl: '/images/hotelSitaSharan.jpg', 
    area: 'Janakpur',
    address: 'Ramanand Chowk, Janakpurdham',
    starRating: 4.0,
    reviewScore: 8.2,
    reviewCount: 110,
    amenities: [
      'Vegetarian Restaurant', 'Air Conditioning', 'Conference Hall', 'Free WiFi', 'Room Service', 'Laundry Service', 'Free Parking'
    ],
    nearbyPlaces: [
      { name: "Janaki Mandir", time: "10 min walk" },
      { name: "Janakpur Railway Station", time: "5 min drive" },
      { name: "Ram Mandir", time: "12 min walk" },
      { name: "Ganga Sagar", time: "15 min walk" }
    ],
    rooms: {
      create: [
        { name: 'Standard AC Room', description: 'A clean, air-conditioned room for a comfortable pilgrimage.', pricePerNight: 4000, maxGuests: 2, imageUrls: ['/images/rooms/janakpur-room.jpg']}
      ]
    }
  },
  { 
    name: 'Green View Tea Resort', 
    description: 'Stay amidst the beautiful tea gardens of Kanyam, waking up to the scent of fresh tea leaves.', 
    imageUrl: '/images/hotelGreenView.jpg', 
    area: 'Ilam',
    address: 'Kanyam, Ilam',
    starRating: 3.5,
    reviewScore: 8.7,
    reviewCount: 95,
    amenities: [
      'Tea Garden Views', 'Horse Riding', 'Local Cuisine Restaurant', 'Bonfire Area', 'Free Parking', 'Balcony Rooms'
    ],
    nearbyPlaces: [
      { name: "Kanyam Tea Garden", time: "0 min (On-site)" },
      { name: "Shree Antu", time: "45 min drive" },
      { name: "Pathibhara Temple", time: "1 hr drive" },
      { name: "Fikkal Bazaar", time: "20 min drive" }
    ],
    rooms: {
      create: [
        { name: 'Tea Garden View Room', description: 'Wake up to the stunning view of the tea fields from your window.', pricePerNight: 5000, maxGuests: 2, imageUrls: ['/images/rooms/ilam-room.jpg']}
      ]
    }
  },
  { 
    name: 'Gorkha Gaun Resort', 
    description: 'Hilltop resort with stunning views of Manaslu and Gorkha Durbar, built with local stone and eco-friendly practices.', 
    imageUrl: '/images/gorkhaGaunResort.jpg', 
    area: 'Gorkha',
    address: 'Laxmi Bazar, Gorkha',
    starRating: 4.0,
    reviewScore: 9.0,
    reviewCount: 75,
    amenities: [
      'Mountain Views', 'Organic Garden', 'Hiking Trails', 'Restaurant', 'Bar', 'Eco-friendly', 'Meeting Facilities'
    ],
    nearbyPlaces: [
      { name: "Gorkha Durbar", time: "45 min hike" },
      { name: "Gorkha Museum", time: "20 min walk" },
      { name: "Manakamana Cable Car", time: "40 min drive" },
      { name: "Gorakhnath Temple", time: "50 min hike" }
    ],
    rooms: {
      create: [
        { name: 'Deluxe Cottage', description: 'A traditional stone cottage with modern amenities and panoramic mountain views.', pricePerNight: 9000, maxGuests: 2, imageUrls: ['/images/rooms/gorkha-room.jpg']}
      ]
    }
  },
  { 
    name: 'The Old Inn', 
    description: 'A restored Newari mansion on the main street of Bandipur, offering a unique heritage experience.', 
    imageUrl: '/images/theOldInn.jpg', 
    area: 'Bandipur',
    address: 'Main Bazaar, Bandipur',
    starRating: 3.5,
    reviewScore: 9.3,
    reviewCount: 150,
    amenities: [
      'Heritage Building', 'Rooftop Terrace', 'Free Breakfast', 'Restaurant', 'Cultural Decor', 'Walking Tours', 'Free WiFi'
    ],
    nearbyPlaces: [
      { name: "Bandipur Main Bazaar", time: "0 min (On-site)" },
      { name: "Thani Mai Temple", time: "20 min hike" },
      { name: "Tundikhel", time: "5 min walk" },
      { name: "Siddha Gufa", time: "1.5 hr hike" }
    ],
    rooms: {
      create: [
        { name: 'Heritage Room', description: 'A room with classic Newari windows, exposed brick, and authentic decor.', pricePerNight: 6500, maxGuests: 2, imageUrls: ['/images/rooms/bandipur-room.avif']}
      ]
    }
  },
  { 
    name: 'Royal Mustang Resort', 
    description: 'A quality guesthouse in the ancient walled city of Lo Manthang, providing comfort in a remote region.', 
    imageUrl: '/images/royalMustangResort.jpg', 
    area: 'Upper Mustang',
    address: 'Lo Manthang, Mustang',
    starRating: 3.5,
    reviewScore: 8.9,
    reviewCount: 40,
    amenities: [
      'Heating', 'Restaurant (Tibetan/Nepali)', 'Hot Water', 'Cultural Shows (Request)', 'Jeep Hire', 'Guide Services'
    ],
    nearbyPlaces: [
      { name: "Lo Manthang Palace", time: "5 min walk" },
      { name: "Chhoser Caves", time: "1 hr jeep/horse" },
      { name: "Namgyal Gompa", time: "45 min hike" },
      { name: "Jomsom Airport", time: "4-5 hr drive" }
    ],
    rooms: {
      create: [
        { name: 'Standard Room', description: 'A warm, insulated room in a traditional Tibetan-style building.', pricePerNight: 4500, maxGuests: 2, imageUrls: ['/images/rooms/mustang-room.jpg']}
      ]
    }
  },
  { 
    name: 'Danphe Lodge', 
    description: 'A simple, rustic lodge on the pristine shores of Rara Lake. The best place to disconnect and enjoy nature.', 
    imageUrl: '/images/dapheLodge.jpg', 
    area: 'Rara Lake',
    address: 'Rara National Park, Mugu',
    starRating: 2.5,
    reviewScore: 8.0,
    reviewCount: 30,
    amenities: [
      'Lake View', 'Campfire', 'Basic Meals', 'Tent Camping Options', 'Boating', 'Nature Walks'
    ],
    nearbyPlaces: [
      { name: "Rara Lake", time: "1 min walk" },
      { name: "Murma Top", time: "3 hr hike" },
      { name: "Talcha Airport", time: "2 hr walk" },
      { name: "Park Headquarters", time: "10 min walk" }
    ],
    rooms: {
      create: [
        { name: 'Basic Room', description: 'A simple, clean room with essential amenities. The view is the luxury.', pricePerNight: 3000, maxGuests: 2, imageUrls: ['/images/rooms/rara-room.jpg']}
      ]
    }
  }
];

async function main() {

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const adminHash = await bcrypt.hash('admin123', salt);
  await prisma.user.upsert({
    where: { email: 'admin@sajiloyatra.me' },
    update: {},
    create: {
      email: 'admin@sajiloyatra.me',
      name: 'Super Admin',
      passwordHash: adminHash,
      role: 'ADMIN', 
    },
  });
  console.log("Admin user created: admin@sajiloyatra.me / admin123");

  for (const story of storiesData) {
    await prisma.story.create({
      data: {
        title: story.title,
        author: story.author,
        imageUrl: story.imageUrl,
      }
    });
  }


  console.log(`Seeding guides with unique users...`);
  
  let userCounter = 1;

  for (const guide of guidesData) {
    
   
    const dummyUser = await prisma.user.create({
      data: {
        email: `guide${userCounter}@example.com`,
        name: guide.name,
        passwordHash: passwordHash,
      },
    });

    await prisma.localGuide.create({
      data: {
        ...guide,
        userId: dummyUser.id, 
      },
    });
    
    userCounter++;
  }

  console.log(`Seeding lodgings and rooms...`);
  
  for (const lodgingData of lodgingsWithRoomsData) {
    const lodging = await prisma.lodging.create({
      data: lodgingData,
    });
    console.log(`Created lodging: ${lodging.name}`);
  }
  
  console.log(`Seeding finished.`);
}



main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });