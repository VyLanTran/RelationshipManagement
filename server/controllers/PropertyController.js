import Property from "../models/PropertyModel.js";
import GroupModel from "../models/GroupModel.js";

export const addProperty = async (req, res) => {
    try {
        const newProperty = await Property.create(req.body);
        res.status(201).json({ newProperty });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

export const deleteProperty = async (req, res) => {
    try {
        const { id: PropertyId } = req.params;
        const property = await Property.deleteOne({ _id: PropertyId });
        res.status(201).json({ property });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

export const getAllProperties = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await GroupModel.findById(groupId);
        const properties = await Promise.all(
            group.groupIds.map((groupId) =>
                Property.findById(groupId))
        );
        res.status(200).json({ properties });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

export const updateProperty = async (req, res) => {
	try {
		const { id: groupId } = req.params;
		const property = await property.findOneAndUpdate(
			{ _id: groupId },
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);
		if (!property) {
			res.status(404).json({ msg: `No connections with ID ${groupId}` });
		}
		res.status(200).json({ property });
	} catch (error) {
		res.status(500).json({ msg: error });
	}
};