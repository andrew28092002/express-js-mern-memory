import mongoose from 'mongoose'

const tokenSchema = mongoose.Schema({
    isActivated: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    token: {type: String, required: true}
})

export default mongoose.model('Token', tokenSchema)