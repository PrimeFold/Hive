import express from 'express'
import * as WorkspaceController from '../../modules/workspace/workspace.controller'
import { router } from '../../utils/router';
import { AuthMiddleware } from '../../middlewares/auth/auth.middleware';
import { Limiter } from '../../lib/rateLimiter';

const workspaceLimiter = Limiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many workspace requests from this IP. Please wait a bit.",
});

// Routes for workspaces
router.post('/workspace', AuthMiddleware, workspaceLimiter, WorkspaceController.createWorkspace);
router.get('/workspace/:id', AuthMiddleware, WorkspaceController.getWorkspaceById);
router.get('/workspaces', AuthMiddleware, WorkspaceController.getUserWorkspaces);
router.put('/workspace/:id', AuthMiddleware, workspaceLimiter, WorkspaceController.updateWorkspaceName);
router.delete('/workspace/:id', AuthMiddleware, workspaceLimiter, WorkspaceController.deleteWorkspace);
router.post('/workspace/:id/member', AuthMiddleware, workspaceLimiter, WorkspaceController.addMember);
router.delete('/workspace/:id/member', AuthMiddleware, workspaceLimiter, WorkspaceController.removeMember);