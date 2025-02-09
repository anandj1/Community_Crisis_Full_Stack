import Crisis from '../models/Crisis.js';

// Get all crises
const getAllCrises = async (req, res) => {
  try {
    console.log('Fetching all crises');
    const crises = await Crisis.find()
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(crises);
  } catch (error) {
    console.error('Error in getAllCrises:', error);
    res.status(500).json({ message: 'Error fetching crises' });
  }
};

// Get crises reported by the logged-in user
const getMyCrises = async (req, res) => {
  try {
    console.log('Fetching user crises for:', req.user.userId);
    const crises = await Crisis.find({ reportedBy: req.user.userId })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${crises.length} crises for user`);
    res.json(crises);
  } catch (error) {
    console.error('Error in getMyCrises:', error);
    res.status(500).json({ message: 'Error fetching user crises' });
  }
};

// Create a new crisis report
const createCrisis = async (req, res) => {
  try {
    console.log('Creating new crisis:', req.body);
    
    const crisis = new Crisis({
      title: req.body.title,
      description: req.body.description,
      location: JSON.parse(req.body.location),
      severity: req.body.severity,
      reportedBy: req.user.userId, // Use authenticated user's ID
      media: req.files?.map(file => ({
        url: file.path,
        type: file.mimetype.startsWith('image/') ? 'image' : 'video'
      })) || []
    });

    const savedCrisis = await crisis.save();
    console.log('Crisis created:', savedCrisis);
    
    res.status(201).json(savedCrisis);
  } catch (error) {
    console.error('Error in createCrisis:', error);
    res.status(500).json({ message: 'Error creating crisis' });
  }
};

// Update crisis status
const updateStatus = async (req, res) => {
  try {
    console.log('Updating crisis status:', { id: req.params.id, status: req.body.status });
    
    const crisis = await Crisis.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('reportedBy', 'name email');

    if (!crisis) {
      return res.status(404).json({ message: 'Crisis not found' });
    }

    console.log('Crisis updated:', crisis);
    res.json(crisis);
  } catch (error) {
    console.error('Error in updateStatus:', error);
    res.status(500).json({ message: 'Error updating crisis status' });
  }
};

export { createCrisis, getAllCrises, getMyCrises, updateStatus };