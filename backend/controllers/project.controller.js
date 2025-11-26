import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js';
import { validationResult } from 'express-validator';
import User from '../models/user.model.js';


export const createProject = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).send("Unauthorized User");
        }
        const { name } = req.body;
        if (!name) {
            return res.status(400).send("Project name is required");
        }
        const newProject = await projectService.createProject({ name, userId: req.user?._id });

        res.status(201).json(newProject);

    } catch (err) {
        res.status(400).send(err.message);
    }
}

export const getAllProject = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).send("Unauthorized User");
        }

        const allUserProjects = await projectService.getAllProjectByUserId({
            userId: req.user?._id
        })

        return res.status(200).json({
            projects: allUserProjects
        })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export const addUserToProject = async (req, res) => {

    try {

        const { projectId, users } = req.body

        if(!projectId || !users){
            return res.status(400).send("Project ID and Users are required");
        }

        if (!req.user) {
            return res.status(401).send("Unauthorized User");
        }

        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId: req.user?._id
        })

        if (!project) {
            return res.status(404).send("Project not found");
        }

        return res.status(200).json({
            project,
        })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }


}

export const getProjectById = async (req, res) => {

    const { projectId } = req.params;

    try {

        const project = await projectService.getProjectById({ projectId });

        return res.status(200).json({
            project
        })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }

}

export const updateFileTree = async (req, res) => {
    
    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }

}