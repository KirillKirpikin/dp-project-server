const ApiError = require('../error/ApiError');
const ProjectModel = require('../models/project-model');
const TaskModel = require('../models/task-model');

const checkProjectOwnership = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const userId = req.body.user;

        const project = await ProjectModel.findById(projectId);

        if (!project) {
            return next(ApiError.notFound('Проект не найден'));
        }
        console.log(project.user);

        if (project.user.toString() !== userId) {
            return next(ApiError.forbidden('У вас нет прав на изменение этого проекта'));
        }

        req.project = project; // Передаем объект проекта в запрос для использования в следующих обработчиках
        next();
    } catch (error) {
        next(ApiError.internal(error.message));
    }
};

// Middleware для проверки, имеет ли пользователь права на изменение задачи
const checkTaskOwnership = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const userId = req.body.user; // Предполагается, что в объекте req.user есть информация о текущем пользователе

        const task = await TaskModel.findById(taskId);

        if (!task) {
            return next(ApiError.notFound('Задача не найдена'));
        }

        if (task.user.toString() !== userId) {
            return next(ApiError.forbidden('У вас нет прав на изменение этой задачи'));
        }

        req.task = task; // Передаем объект задачи в запрос для использования в следующих обработчиках
        next();
    } catch (error) {
        next(ApiError.internal(error.message));
    }
};

module.exports = { checkProjectOwnership, checkTaskOwnership };