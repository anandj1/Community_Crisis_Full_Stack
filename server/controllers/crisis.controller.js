import Crisis from '../models/Crisis.js';
import { validateCrisisData } from '../utils/validators.js';
import { handleUploadedFiles } from '../utils/fileHandlers.js';

export const crisisController = {
  async createCrisis(req, res) {
    try {
      const crisisData = JSON.parse(req.body.crisisData || '{}');
      
      // Validate data
      const validationError = validateCrisisData(crisisData);
      if (validationError) {
        return res.status(400).json(validationError);
      }

      // Process uploaded files
      const mediaFiles = req.files ? handleUploadedFiles(req.files) : [];

      // Create crisis
      const crisis = new Crisis({
        title: crisisData.title,
        description: crisisData.description,
        location: crisisData.location,
        severity: crisisData.severity,
        reportedBy: req.user.userId,
        status: 'reported',
        media: mediaFiles
      });

      await crisis.save();
      
      res.status(201).json({
        message: 'Crisis reported successfully',
        crisis
      });
    } catch (error) {
      console.error('Crisis reporting error:', error);
      res.status(500).json({ 
        message: 'Failed to report crisis',
        error: error.message 
      });
    }
  },

  async getAllCrises(req, res) {
    try {
      const { severity, status } = req.query;
      const filter = {};

      if (severity) filter.severity = severity;
      if (status) filter.status = status;

      const crises = await Crisis.find(filter)
        .populate('reportedBy', 'name email')
        .sort({ createdAt: -1 });
      res.json(crises);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getMyCrises(req, res) {
    try {
      const crises = await Crisis.find({ reportedBy: req.user.userId })
        .sort({ createdAt: -1 });
      res.json(crises);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Debug logging
      console.log('Update Status Request:', {
        userId: req.user?.userId,
        userRole: req.user?.role
      });

      // Check if user exists and has required data
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Validate status
      const validStatuses = ['reported', 'inProgress', 'resolved'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      // Strict role checking
      if (!req.user.role || req.user.role !== 'admin') {
        console.log('Authorization failed:', {
          userRole: req.user.role,
          required: 'admin'
        });
        return res.status(403).json({ 
          message: 'Only admins can update status',
          details: 'User does not have admin role'
        });
      }

      const crisis = await Crisis.findByIdAndUpdate(
        id,
        { 
          status,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!crisis) {
        return res.status(404).json({ message: 'Crisis not found' });
      }

      res.json(crisis);
    } catch (error) {
      console.error('Status update error:', error);
      res.status(500).json({ 
        message: 'Failed to update status',
        error: error.message
      });
    }
  }
};