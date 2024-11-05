import mongoose from 'mongoose';


const subscriberSchema = new mongoose.Schema({
subscribers:{
    type:[String],
    default:[]
}
})

const Subscribers = mongoose.model('Subscribers',subscriberSchema);
export default Subscribers;