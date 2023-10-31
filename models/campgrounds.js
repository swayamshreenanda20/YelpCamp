const mongoose=require('mongoose');
const schema=mongoose.Schema;


const ImageSchema= new schema({
    url:String,
    filename:String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const opts ={toJSON: {virtuals: true}};

const campgroundsschema=new schema({
    title:String,
    images: [ImageSchema],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type:schema.Types.ObjectId,
        ref:'user'
    },
    reviews:[
        {
          type:schema.Types.ObjectId,
          ref:'review'  
        }
]
},opts);

campgroundsschema.virtual('properties,popUpMarkup').get(function(){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
});

campgroundsschema.post('findOneAndDelete',async function(doc){
    if(doc){
        await review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports=mongoose.model('campground',campgroundsschema);