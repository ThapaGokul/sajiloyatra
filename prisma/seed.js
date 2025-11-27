// [NODE.JS BACKEND LOGIC] /prisma/seed.js
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

const storiesData = [
  { id: 1, title: 'A Trek Through the Khumbu Valley', author: 'Jane Doe', imageUrl: '/images/story1.jpg' },
  { id: 2, title: 'The Living Goddesses of Kathmandu', author: 'John Smith', imageUrl: '/images/story2.jpg' },
  { id: 3, title: 'Monsoon Adventures: A Different Kind of Beauty', author: 'Emily White', imageUrl: '/images/story3.jpg' },
];


  const lodgingsWithRoomsData = [
    { 
    name: 'Kathmandu Marriott Hotel', 
    description: 'A modern, 5-star hotel in the city center, near Thamel.', 
    imageUrl: '/images/marriottHotel.avif', 
    area: 'Kathmandu',
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
    description: 'A unique heritage hotel featuring extensive Nepali woodwork.', 
    imageUrl: '/images/dwarikasHotel.webp', 
    area: 'Kathmandu',
    rooms: {
      create: [
        { name: 'Heritage Deluxe Room', description: 'Individually designed room with traditional decor.', pricePerNight: 22000, maxGuests: 2, imageUrls: ['/images/rooms/dwarika-deluxe.jpg']},
        { name: 'Courtyard Suite', description: 'A spacious suite overlooking the tranquil courtyard.', pricePerNight: 30000, maxGuests: 2, imageUrls: ['/images/rooms/dwarika-suite.jpg']}
      ]
    }
  },
  { 
    name: 'Hotel Pokhara Grande', 
    description: 'Luxury hotel with a pool and stunning Annapurna mountain views.', 
    imageUrl: '/images/pokharaGrande.jpg', 
    area: 'Pokhara',
    rooms: {
      create: [
        { name: 'Standard Room', description: 'A cozy room with views of the garden or city.', pricePerNight: 8000, maxGuests: 2, imageUrls: ['/images/rooms/grande-standard.jpg']},
        { name: 'Mountain View Deluxe', description: 'Spacious room with a private balcony facing the Himalayas.', pricePerNight: 12000, maxGuests: 2, imageUrls: ['/images/rooms/grande-deluxe.jpg']}
      ]
    }
  },
  { 
    name: 'Temple Tree Resort & Spa', 
    description: 'A beautiful boutique resort in the heart of Lakeside.', 
    imageUrl: '/images/templeTreeResort.jpeg', 
    area: 'Pokhara',
    rooms: {
      create: [
        { name: 'Deluxe Room', description: 'Elegant room blending modern design with natural elements.', pricePerNight: 11000, maxGuests: 2, imageUrls: ['/images/rooms/temple-tree.jpeg']}
      ]
    }
  },
  { 
    name: 'Bardia Tiger Resort', 
    description: 'A jungle lodge offering safaris and nature walks near the park.', 
    imageUrl: '/images/bardiaTigerResort.jpg', 
    area: 'Bardia National Park',
    rooms: {
      create: [
        { name: 'Jungle Bungalow', description: 'A private bungalow with a veranda, immersed in nature.', pricePerNight: 7500, maxGuests: 2, imageUrls: ['/images/rooms/bardia-bungalow.avif']}
      ]
    }
  },
  { 
    name: 'Horizon Homestay', 
    description: 'A cozy homestay with a local Newari family in Tansen.', 
    imageUrl: '/images/horizonHomestay.jpg', 
    area: 'Tansen',
    rooms: {
      create: [
        { name: 'Guest Room', description: 'A simple and clean room with a shared bathroom.', pricePerNight: 2000, maxGuests: 2, imageUrls: ['/images/rooms/tansen-room.jpg']}
      ]
    }
  },
  { 
    name: 'Hotel Sita Sharan', 
    description: 'A comfortable hotel very close to the Janaki Mandir.', 
    imageUrl: '/images/hotelSitaSharan.jpg', 
    area: 'Janakpur',
    rooms: {
      create: [
        { name: 'Standard AC Room', description: 'A clean, air-conditioned room for a comfortable pilgrimage.', pricePerNight: 4000, maxGuests: 2, imageUrls: ['/images/rooms/janakpur-room.jpg']}
      ]
    }
  },
  { 
    name: 'Green View Tea Resort', 
    description: 'Stay amidst the beautiful tea gardens of Kanyam.', 
    imageUrl: '/images/hotelGreenView.jpg', 
    area: 'Ilam',
    rooms: {
      create: [
        { name: 'Tea Garden View Room', description: 'Wake up to the stunning view of the tea fields.', pricePerNight: 5000, maxGuests: 2, imageUrls: ['/images/rooms/ilam-room.jpg']}
      ]
    }
  },
  { 
    name: 'Gorkha Gaun Resort', 
    description: 'Hilltop resort with stunning views of Manaslu and Gorkha Durbar.', 
    imageUrl: '/images/gorkhaGaunResort.jpg', 
    area: 'Gorkha',
    rooms: {
      create: [
        { name: 'Deluxe Cottage', description: 'A traditional cottage with modern amenities and mountain views.', pricePerNight: 9000, maxGuests: 2, imageUrls: ['/images/rooms/gorkha-room.jpg']}
      ]
    }
  },
  { 
    name: 'The Old Inn', 
    description: 'A restored Newari mansion on the main street of Bandipur.', 
    imageUrl: '/images/theOldInn.jpg', 
    area: 'Bandipur',
    rooms: {
      create: [
        { name: 'Heritage Room', description: 'A room with classic Newari windows and decor.', pricePerNight: 6500, maxGuests: 2, imageUrls: ['/images/rooms/bandipur-room.avif']}
      ]
    }
  },
  { 
    name: 'Royal Mustang Resort', 
    description: 'A quality guesthouse in the ancient walled city of Lo Manthang.', 
    imageUrl: '/images/royalMustangResort.jpg', 
    area: 'Upper Mustang',
    rooms: {
      create: [
        { name: 'Standard Room', description: 'A warm room in a traditional Tibetan-style building.', pricePerNight: 4500, maxGuests: 2, imageUrls: ['/images/rooms/mustang-room.jpg']}
      ]
    }
  },
  { 
    name: 'Danphe Lodge', 
    description: 'A simple, rustic lodge on the pristine shores of Rara Lake.', 
    imageUrl: '/images/dapheLodge.jpg', 
    area: 'Rara Lake',
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
        userId: dummyUser.id, // This is now unique every time
      },
    });
    
    userCounter++;
  }
 // --- 3. SEED ALL LODGINGS AND THEIR ROOMS ---
  console.log(`Seeding lodgings and rooms...`);
  
  for (const lodgingData of lodgingsWithRoomsData) {
    const lodging = await prisma.lodging.create({
      data: lodgingData, // Prisma will create the lodging AND its rooms
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