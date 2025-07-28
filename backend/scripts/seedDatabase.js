const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Sacco = require('../models/Sacco');
const Terminus = require('../models/Terminus');
const Route = require('../models/Route');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Sacco.deleteMany({});
    await Terminus.deleteMany({});
    await Route.deleteMany({});
    await Vehicle.deleteMany({});
    await Driver.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@nrtms.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    console.log('Created admin user');

    // Create sample SACCOs
const saccos = await Sacco.create([
  {
    name: 'Dar es Salaam Bus Operators Association',
    registrationNumber: 'SACCO001',
    chairperson: 'John Mwalimu',
    phone: '+255123456789',
    email: 'info@dalatdala.com',
    address: 'Uhuru Street, Dar es Salaam'
  },
  {
    name: 'Mwanza Transport SACCO',
    registrationNumber: 'SACCO002',
    chairperson: 'James Maganga',
    phone: '+255123456792',
    email: 'info@mwanzatransport.com',
    address: 'Kenyatta Road, Mwanza'
  }
]);


    console.log('Created sample SACCOs');

    // Create sample terminuses
    const terminuses = await Terminus.create([
      {
        name: 'Kariakoo Bus Terminal',
        location: {
          address: 'Kariakoo Market Area',
          city: 'Dar es Salaam',
          region: 'Dar es Salaam',
          coordinates: {
            latitude: -6.8235,
            longitude: 39.2695
          }
        },
        capacity: 100,
        facilities: ['waiting_area', 'ticketing_office', 'restrooms', 'parking'],
        operatingHours: {
          open: '05:00',
          close: '22:00'
        },
        contactPerson: {
          name: 'Hassan Mwalimu',
          phone: '+255123456795',
          email: 'kariakoo@nrtms.com'
        }
      },
      {
        name: 'Mwenge Bus Terminal',
        location: {
          address: 'Mwenge Area',
          city: 'Dar es Salaam',
          region: 'Dar es Salaam',
          coordinates: {
            latitude: -6.7539,
            longitude: 39.2268
          }
        },
        capacity: 80,
        facilities: ['waiting_area', 'restrooms', 'parking', 'food_court'],
        operatingHours: {
          open: '05:00',
          close: '23:00'
        },
        contactPerson: {
          name: 'Fatuma Juma',
          phone: '+255123456796',
          email: 'mwenge@nrtms.com'
        }
      }
    ]);

    console.log('Created sample terminuses');

    // Create sample routes
    const routes = await Route.create([
      {
        name: 'Kariakoo - Mwenge Express',
        routeCode: 'KME001',
        startTerminus: terminuses[0]._id,
        endTerminus: terminuses[1]._id,
        distance: 15.5,
        estimatedDuration: 45,
        fareAmount: 800,
        intermediateStops: [
          {
            name: 'Mnazi Mmoja',
            coordinates: { latitude: -6.8162, longitude: 39.2756 }
          },
          {
            name: 'Uhuru',
            coordinates: { latitude: -6.8073, longitude: 39.2719 }
          },
          {
            name: 'Sinza',
            coordinates: { latitude: -6.7734, longitude: 39.2465 }
          }
        ],
        operatingHours: {
          start: '05:30',
          end: '21:30'
        }
      }
    ]);

    console.log('Created sample routes');

    // Create sample vehicles
    const vehicles = await Vehicle.create([
      {
        registrationNumber: 'T123ABC',
        make: 'Toyota',
        model: 'Hiace',
        year: 2020,
        capacity: 14,
        fuelType: 'petrol',
        sacco: saccos[0]._id,
        documents: {
          permitExpiry: new Date('2024-12-31'),
          insuranceExpiry: new Date('2024-10-15'),
          inspectionExpiry: new Date('2024-09-30')
        }
      },
      {
        registrationNumber: 'T456DEF',
        make: 'Nissan',
        model: 'Urvan',
        year: 2019,
        capacity: 12,
        fuelType: 'diesel',
        sacco: saccos[0]._id,
        documents: {
          permitExpiry: new Date('2024-11-30'),
          insuranceExpiry: new Date('2024-12-20'),
          inspectionExpiry: new Date('2024-08-31')
        }
      }
    ]);

    console.log('Created sample vehicles');

    // Create sample drivers
    const drivers = await Driver.create([
      {
        firstName: 'Mohamed',
        lastName: 'Ally',
        phone: '+255123456797',
        email: 'mohamed.ally@email.com',
        licenseNumber: 'DL001234',
        licenseExpiryDate: new Date('2025-06-30'),
        dateOfBirth: new Date('1985-03-15'),
        address: {
          street: 'Msimbazi Street',
          city: 'Dar es Salaam',
          region: 'Dar es Salaam'
        },
        sacco: saccos[0]._id,
        emergencyContact: {
          name: 'Amina Ally',
          phone: '+255123456798',
          relationship: 'spouse'
        },
        assignedVehicle: vehicles[0]._id
      },
      {
        firstName: 'Joseph',
        lastName: 'Mwangi',
        phone: '+255123456799',
        email: 'joseph.mwangi@email.com',
        licenseNumber: 'DL005678',
        licenseExpiryDate: new Date('2025-08-15'),
        dateOfBirth: new Date('1980-07-22'),
        address: {
          street: 'Kimara Road',
          city: 'Dar es Salaam',
          region: 'Dar es Salaam'
        },
        sacco: saccos[0]._id,
        emergencyContact: {
          name: 'Mary Mwangi',
          phone: '+255123456800',
          relationship: 'spouse'
        },
        assignedVehicle: vehicles[1]._id
      }
    ]);

    // Update vehicles with assigned drivers
    await Vehicle.findByIdAndUpdate(vehicles[0]._id, { assignedDriver: drivers[0]._id });
    await Vehicle.findByIdAndUpdate(vehicles[1]._id, { assignedDriver: drivers[1]._id });

    console.log('Created sample drivers and assigned to vehicles');

    console.log('Database seeded successfully!');
    console.log('Admin credentials: admin@nrtms.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();