const Pet = require('../models/Pet');
const Adoption = require('../models/Adoption');
const User = require('../models/User'); // For shelter contact

// ------------------- PET ROUTES -------------------

// Get all pets by shelter
exports.getPetsByShelter = async (req, res) => {
  try {
    const { shelterId } = req.params;
    const pets = await Pet.find({ shelterId });
    res.json({ message: 'Pets fetched', pets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get pet detail with adoption status and shelter contact
exports.getPetDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id).lean();
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    // Include shelter info
    const shelter = await User.findById(pet.shelterId).select('name email phone');

    // Include adoption status for the logged-in user
    let adoptionStatus = null;
    if (req.user) {
      const adoption = await Adoption.findOne({ pet: id, user: req.user._id });
      if (adoption) adoptionStatus = adoption.status;
    }

    res.json({
      message: 'Pet fetched',
      pet: {
        ...pet,
        shelter,
        adoptionStatus
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a pet
exports.createPet = async (req, res) => {
  try {
    const petData = req.body;
    petData.shelterId = req.user._id; // Assign shelter/business
    if (req.files) {
      petData.photos = req.files.map(file => file.path);
      if (req.files.videos) petData.videos = req.files.videos.map(file => file.path);
    }

    const pet = await Pet.create(petData);
    res.status(201).json({ message: 'Pet created', pet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a pet
exports.updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (req.files) {
      updateData.photos = req.files.map(file => file.path);
      if (req.files.videos) updateData.videos = req.files.videos.map(file => file.path);
    }

    const pet = await Pet.findByIdAndUpdate(id, updateData, { new: true });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json({ message: 'Pet updated', pet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a pet
exports.deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findByIdAndDelete(id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json({ message: 'Pet deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ------------------- ADOPTION ROUTES -------------------

// Apply to adopt a pet
exports.applyAdoption = async (req, res) => {
  try {
    const { id } = req.params; // petId
    const adoptionData = {
      pet: id,
      user: req.user._id,
      status: 'Pending', // match enum in schema
      ...req.body
    };
    const adoption = await Adoption.create(adoptionData);
    res.status(201).json({ message: 'Adoption application submitted', adoption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get adoption status for a pet (user view)
exports.getAdoptionStatus = async (req, res) => {
  try {
    const { id } = req.params; // petId
    const adoption = await Adoption.findOne({ pet: id, user: req.user._id });
    if (!adoption) return res.status(404).json({ message: 'No adoption application found' });
    res.json({ message: 'Adoption status fetched', adoption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Business approves/rejects adoption
exports.updateAdoptionStatus = async (req, res) => {
  try {
    const { appId } = req.params; // adoption application id
    const { status } = req.body; // Pending / Approved / Rejected

    const adoption = await Adoption.findByIdAndUpdate(appId, { status }, { new: true });
    if (!adoption) return res.status(404).json({ message: 'Adoption application not found' });
    res.json({ message: 'Adoption status updated', adoption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Business fetches all adoption applications for a pet
exports.getPetAdoptions = async (req, res) => {
  try {
    const { id } = req.params; // petId
    const adoptions = await Adoption.find({ pet: id });
    res.json({ message: 'Adoption applications fetched', adoptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Contact shelter
exports.getShelterContact = async (req, res) => {
  try {
    const { id } = req.params; // petId
    const pet = await Pet.findById(id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    const shelter = await User.findById(pet.shelterId).select('name email phone');
    if (!shelter) return res.status(404).json({ message: 'Shelter not found' });

    res.json({ message: 'Shelter contact fetched', shelter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
