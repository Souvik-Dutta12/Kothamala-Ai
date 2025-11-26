import Project from '../models/project.model.js';
import mongoose from 'mongoose';


export const createProject = async ({name, userId}) => {
    
    try {
        const project = await Project.create({
            name,
            users: [ userId ]
        });
        return project;

    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project name already exists');
        }
        throw error;
    }
}

export const getAllProjectByUserId = async ({ userId }) => {
    const allUserProjects = await Project.find({
        users: userId
    })

    return allUserProjects
}

export const addUsersToProject = async ({ projectId, users, userId }) => {

    const project = await Project.findOne({
        _id: projectId,
        users: userId
    })

    if (!project) {
        throw new Error("User not belong to this project")
    }

    const updatedProject = await Project.findOneAndUpdate({
        _id: projectId
    }, {
        $addToSet: {
            users: {
                $each: users
            }
        }
    }, {
        new: true
    })

    return updatedProject



}


export const getProjectById = async ({ projectId }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    const project = await Project.findOne({
        _id: projectId
    }).populate('users')

    return project;
}


export const updateFileTree = async ({ projectId, fileTree }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!fileTree) {
        throw new Error("fileTree is required")
    }

    const project = await Project.findOneAndUpdate({
        _id: projectId
    }, {
        fileTree
    }, {
        new: true
    })

    return project;
}