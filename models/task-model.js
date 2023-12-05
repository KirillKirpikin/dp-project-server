const {Schema, model} = require('mongoose');

const TaskSchema = new Schema({
    title:{type:String, required: true},
    description: {type: String, required: true},
    imgs:[{type: String, required: true}],
    project: {type: Schema.Types.ObjectId, ref: 'Project', required: true},
},{
    collection: 'tasks'
})

module.exports = model('Task', TaskSchema);