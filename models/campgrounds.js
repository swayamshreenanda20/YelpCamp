const mongoose=require('mongoose');
const schema=mongoose.Schema;

const campgroundsschema=new schema({
    title:String,
    image: String,
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