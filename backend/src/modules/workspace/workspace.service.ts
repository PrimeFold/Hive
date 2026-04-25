

import prisma from "../../lib/prisma"

export const createWorkspace = async(name: string, ownerId: string) => {
    try {
        const workspace = await prisma.workspace.create({
            data: {
                name,
                members: {
                    create: {
                        userId: ownerId,
                        role: "OWNER"
                    }
                }
            },
            include: {
                members: true
            }
        })

        return {
            success: true,
            message: "Workspace created successfully!",
            data: workspace,
            statusCode: 201
        }
    } catch (error) {
        return {
            success: false,
            message: "Error creating workspace",
            statusCode: 500
        }
    }
}

export const getWorkspaceById = async(workspaceId: string) => {
    try {
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                displayName: true
                            }
                        }
                    }
                },
                channels: true
            }
        })

        if (!workspace) {
            return {
                success: false,
                message: "Workspace not found",
                statusCode: 404
            }
        }

        return {
            success: true,
            message: "Workspace found",
            data: workspace,
            statusCode: 200
        }
    } catch (error) {
        return {
            success: false,
            message: "Error fetching workspace",
            statusCode: 500
        }
    }
}

export const getUserWorkspaces = async(userId: string) => {
    try {
        const workspaces = await prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                members: {
                    where: {
                        userId
                    },
                    select: {
                        role: true
                    }
                }
            }
        })

        return {
            success: true,
            message: "Workspaces fetched",
            data: workspaces,
            statusCode: 200
        }
    } catch (error) {
        return {
            success: false,
            message: "Error fetching workspaces",
            statusCode: 500
        }
    }
}

export const updateWorkspaceName = async(workspaceId: string, name: string) => {
    try {
        const workspace = await prisma.workspace.update({
            where: { id: workspaceId },
            data: { name }
        })

        return {
            success: true,
            message: "Workspace name updated",
            data: workspace,
            statusCode: 200
        }
    } catch (error) {
        return {
            success: false,
            message: "Error updating workspace name",
            statusCode: 500
        }
    }
}

export const deleteWorkspace = async(workspaceId: string) => {
    try {
        await prisma.workspace.delete({
            where: { id: workspaceId }
        })

        return {
            success: true,
            message: "Workspace deleted",
            statusCode: 200
        }
    } catch (error) {
        return {
            success: false,
            message: "Error deleting workspace",
            statusCode: 500
        }
    }
}

export const addMember = async(workspaceId: string, userId: string, role:"MEMBER") => {
    try {
        const member = await prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId,
                role
            }
        })

        return {
            success: true,
            message: "Member added",
            data: member,
            statusCode: 201
        }
    } catch (error) {
        return {
            success: false,
            message: "Error adding member",
            statusCode: 500
        }
    }
}

export const removeMember = async(workspaceId: string, userId: string) => {
    try {
        await prisma.workspaceMember.delete({
            where: {
                userId_workspaceId: {
                    userId,
                    workspaceId
                }
            }
        })

        return {
            success: true,
            message: "Member removed",
            statusCode: 200
        }
    } catch (error) {
        return {
            success: false,
            message: "Error removing member",
            statusCode: 500
        }
    }
}




