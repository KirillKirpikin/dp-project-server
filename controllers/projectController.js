const ProjectModel = require('../models/project-model');
const path = require('path');
const querystring = require('qs');
const { saveImg, deleteStaticPhoto, checkAndUpdateImg } = require("../utils/handleImg");
const ApiError = require('../error/ApiError');

class ProjectController {
    async create(req, res, next){
        try {
            let {title, criticality, description, user} = req.body;
            let {img} = req.files;            
            let arrImg = saveImg(img);

            const newProject = new ProjectModel({
                title,
                criticality,
                description,
                user,
                imgs: arrImg
            })

            const saveProject = await newProject.save();
            return res.json({message: `${saveProject.title}, успешно добавлен`});    
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async updateOne(req,res,next){
        try {            
            const {id} = req.params;
            let{title, criticality, description, oldImgs} = req.body;
            let fil = req.files;
            const project = await ProjectModel.findById(id);
            if(!project){
                return res.status(404).json({ message: 'Запись не найдена'});
            }
            let arrImg = checkAndUpdateImg(oldImgs, project, fil);
    
            const updateData = {
                title,
                criticality,
                description, 
                imgs: arrImg
            }
            const updateProject = await ProjectModel.findByIdAndUpdate(id, { $set: updateData })
            if(!updateProject){
                return res.status(404).json({ message: 'Запись не найдена'});
            }
            return res.json({message: `${updateData.title}, Успншно обновлено`})
        } catch (e) {            
            next(ApiError.badRequest(e.message));
        }
    }
    async getAll(req, res, next){
        try {
            let {searchQuery, sort } = req.query;
            let project;
            switch (sort) {
                case 'Від А до Я':
                    project = await ProjectModel.find({ title: { $regex: searchQuery, $options: 'i' } }).sort({ title: 1 });
                    break;
                case 'Від Я до А':
                    project = await ProjectModel.find({ title: { $regex: searchQuery, $options: 'i' } }).sort({ title: -1 });
                    break;
                case 'Більш раніші':
                    project = await ProjectModel.find({ title: { $regex: searchQuery, $options: 'i' } }).sort({ projDate: -1 });
                    break;
                case 'Більш пізні':
                    project = await ProjectModel.find({ title: { $regex: searchQuery, $options: 'i' } }).sort({ projDate: 1 });
                    break;
                default:
                    project = await ProjectModel.find({ title: { $regex: searchQuery, $options: 'i' } });
                    break;
            }

            return res.json(project)
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getOne(req, res, next){
        try {
            const {id} = req.params;
            const project = await ProjectModel.findById(id).populate('tasks');            
            if(!project){
                return res.status(404).json({ message: 'Проект не найден' });
            }
            return res.json(project);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getProjectUsers(req, res, next) {
        try {
            const userId = req.params.id;
            const projects = await ProjectModel.find({ user: userId });
            if (!projects) {
                return res.status(404).json({ message: 'Проекты пользователя не найдены' });
            }
            return res.json(projects);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async deleteOne(req, res, next){
        try {
            const {id} = req.params;
            const project = await ProjectModel.findById(id).populate('tasks');
            if (!project) {
                return res.status(404).json({ message: 'Проект не найден' });
            }
            project.imgs.forEach(item=>{
                deleteStaticPhoto(path.join(__dirname, '..', 'static', item));
            })
            for (const task of project.tasks) {
                await TaskModel.findByIdAndRemove(task._id);
                task.imgs.forEach(item=>{
                    deleteStaticPhoto(path.join(__dirname, '..', 'static', item));
                })
            }
            const deletedProject = await ProjectModel.findByIdAndDelete(id);
            if (!deletedProject) {
                return res.status(404).json({ message: 'Проект не найден' });
            }
            return res.json({ message: `${deletedProject.title} успешно удален вместе со связанными задачами и фотографиями` });

        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new ProjectController;