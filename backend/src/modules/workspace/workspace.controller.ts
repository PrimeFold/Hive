import { Handler } from "../../types/handler";
import { workspaceSchema } from "../../validation/zod";
import * as WorkspaceService from './workspace.service'

export const createWorkspace: Handler = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    const result = workspaceSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: "Invalid workspace name" });
    }

    const { name } = result.data;

    const response = await WorkspaceService.createWorkspace(name, userId);

    const statusCode = response.statusCode || 500;
    if (!response.success) {
        return res.status(statusCode).json({ message: response.message });
    }

    return res.status(statusCode).json({ message: response.message, data: response.data });
}

export const getWorkspaceById: Handler = async (req, res) => {
    const workspaceId = req.params.id;

    const response = await WorkspaceService.getWorkspaceById(workspaceId);

    const statusCode = response.statusCode || 500;
    if (!response.success) {
        return res.status(statusCode).json({ message: response.message });
    }

    return res.status(statusCode).json({ message: response.message, data: response.data });
}

export const getUserWorkspaces: Handler = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    const response = await WorkspaceService.getUserWorkspaces(userId);

    const statusCode = response.statusCode || 500;
    if (!response.success) {
        return res.status(statusCode).json({ message: response.message });
    }

    return res.status(statusCode).json({ message: response.message, data: response.data });
}

export const updateWorkspaceName: Handler = async (req, res) => {
    const workspaceId = req.params.id;

    const result = workspaceSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: "Invalid workspace name" });
    }

    const { name } = result.data;

    const response = await WorkspaceService.updateWorkspaceName(workspaceId, name);

    const statusCode = response.statusCode || 500;
    if (!response.success) {
        return res.status(statusCode).json({ message: response.message });
    }

    return res.status(statusCode).json({ message: response.message, data: response.data });
}

export const deleteWorkspace: Handler = async (req, res) => {
    const workspaceId = req.params.id;

    const response = await WorkspaceService.deleteWorkspace(workspaceId);

    const statusCode = response.statusCode || 500;
    if (!response.success) {
        return res.status(statusCode).json({ message: response.message });
    }

    return res.status(statusCode).json({ message: response.message });
}

export const addMember: Handler = async (req, res) => {
    const workspaceId = req.params.id;
    const { userId, role } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID required" });
    }

    const response = await WorkspaceService.addMember(workspaceId, userId, role);

    const statusCode = response.statusCode || 500;
    if (!response.success) {
        return res.status(statusCode).json({ message: response.message });
    }

    return res.status(statusCode).json({ message: response.message, data: response.data });
}

export const removeMember: Handler = async (req, res) => {
    const workspaceId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID required" });
    }

    const response = await WorkspaceService.removeMember(workspaceId, userId);

    const statusCode = response.statusCode || 500;
    if (!response.success) {
        return res.status(statusCode).json({ message: response.message });
    }

    return res.status(statusCode).json({ message: response.message });
}