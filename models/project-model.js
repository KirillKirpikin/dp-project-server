const {Schema, model} = require('mongoose');

const ProjectScheme = new Schema({
    title: {type: String, required: true},
    criticality:{type: String, required: true},
    projDate: { type: Date, default: Date.now },
    description:{type: String, required: true},
    imgs:[{type: String, required: true}],
    user:{type: Schema.Types.ObjectId, ref: 'User', required: true},
    tasks:[{type: Schema.Types.ObjectId, ref: 'Task'}]

},{
    collection: 'projects'
})

module.exports = model('Project', ProjectScheme);