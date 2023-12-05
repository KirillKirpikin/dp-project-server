const TaskModel = require('../models/task-model');
const path = require('path');
const ProjectModel = require('../models/project-model');
const ApiError = require("../error/ApiError");
const { saveImg, deleteStaticPhoto, checkAndUpdateImg } = require('../utils/handleImg');

class TaskController {
    async create(req, res, next){
        try {
            let {title, description, project} = req.body;
            let {img} = req.files;            
            let arrImg = saveImg(img);

            const newTask = new TaskModel({
                title,
                description,
                project,
                imgs: arrImg
            })

            const saveTask = await newTask.save();
            const updatedProject = await ProjectModel.findByIdAndUpdate(
                project,
                { $push: { tasks: saveTask._id } },
                { new: true }
            );
            return res.json({message: `${saveTask.title}, успешно добавлен`});    
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }

    async getOne(req, res, next){
        try {
            const {id} = req.params;
            const task = await TaskModel.findById(id);
            if(!task){
                return res.status(404).json({ message: 'Задача не найдена' });
            }
            return res.json(task);            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async updateOne(req,res,next){
        try {
            const {id} = req.params;
            let {title, description, project, oldImgs} = req.body;
            let fil = req.files;
            const task = await TaskModel.findById(id);
            if (!task) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }
            let arrImg = checkAndUpdateImg(oldImgs, task, fil);

            const updateData = {
                title,
                description,
                project,
                imgs: arrImg
            }
            const updateTask = await TaskModel.findByIdAndUpdate(id, updateData, {new: true});
            if(!updateTask){
                return res.status(404).json({ message: 'Запись не найдена' });
            }

            const updateProject = await ProjectModel.findByIdAndUpdate(
                project,
                { $addToSet: { tasks: updateTask._id } }, 
                { new: true }
            );
            return res.json({message: `${updateData.title}, Успншно обновлено`});

        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async deleteOne(req, res, next){
        try {
            const {id} = req.params;
            const task = await TaskModel.findById(id);
            if(!task){
                return res.status(404).json({ message: 'Task не найден'});
            }
            task.imgs.forEach(item => {
                deleteStaticPhoto(path.join(__dirname, '..', 'static', item));
            });        
            let deleteTask = await TaskModel.findByIdAndDelete(id);
    
            await ProjectModel.findByIdAndUpdate(
                deleteTask.project,
                { $pull: { tasks: deleteTask._id } },
                { new: true }
            );
            return res.json({ message: `Запись ${deleteTask.title} успешно удалена` });
            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }        
    }
    
}

module.exports = new TaskController;
// async getAll(req, res, next){

// }
// async getOne(req, res, next){

// }