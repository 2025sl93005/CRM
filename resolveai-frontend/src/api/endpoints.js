import api from './axios'

export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)

// Issues
export const createIssue = (data) => api.post('/issues', data)
export const getMyIssues = () => api.get('/issues/my')
export const getAllIssues = () => api.get('/issues/all')
export const getQueueIssues = () => api.get('/issues/queue')
export const getAssignedIssues = () => api.get('/issues/assigned')
export const getEscalatedIssues = () => api.get('/issues/escalated')
export const assignIssue = (id, data) => api.put(`/issues/${id}/assign`, data)
export const sendToQueue = (id) => api.put(`/issues/${id}/queue`)
export const pullFromQueue = (id) => api.put(`/issues/${id}/pull`)
export const updateStatus = (id, data) => api.put(`/issues/${id}/status`, data)
export const escalateIssue = (id, data) => api.put(`/issues/${id}/escalate`, data)

// Feedback
export const submitFeedback = (data) => api.post('/feedback', data)
export const getAllFeedbacks = () => api.get('/feedback')

// Analytics
export const getCsrPerformance = () => api.get('/analytics/csr-performance')
export const getReport = () => api.get('/reports')

// Users
export const getAllCsrs = () => api.get('/users/csr')
