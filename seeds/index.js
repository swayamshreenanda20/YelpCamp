const mongoose = require('mongoose');
const campground = require('../models/campgrounds');
const cities = require('./cities');
const { descriptors, places } = require('./seedhelpers')

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
    console.log('DATABASE CONNECTED!!')
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seeddb = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new campground({
            author:'6447eac3aedce63f6a6f8f26',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio, necessitatibus reiciendis. Sunt perspiciatis voluptate accusantium ullam placeat inventore nemo labore, a soluta beatae praesentium quia nam distinctio officia nihil eos',
            price: price,
            geometry:{
                type:"Point",
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]

            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dgstvkhzh/image/upload/v1697960562/YelpCamp/fyauk6ivauf1xiyxqbmo.jpg',
                  filename: 'YelpCamp/fyauk6ivauf1xiyxqbmo',
                 
                }
              ]
        })
        await camp.save();
    }
}

seeddb().then(() => {
    mongoose.connection.close();
});