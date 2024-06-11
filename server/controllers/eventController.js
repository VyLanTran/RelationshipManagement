import Event from "../models/EventModel.js";

export const addEvent = async (req, res) => {
    try {
        const savedEvent = await Event.create(req.body);
        res.status(201).json({savedEvent});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const showAll = async (req, res) => {
    try {
        const { user: userId } = req.params;
        const events = await Event.find({ admin: userId });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const event = await Event.deleteOne({ _id: eventId });
        res.status(201).json(event);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

export const showEvent = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const event = await Event.findOne({ _id: eventId });
        res.status(201).json(event);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

export const editEvent = async (req, res) => {
    try {
        const { id: eventId } = req.params;

        const event = await Event.findOneAndUpdate(
            { _id: eventId },
            req.body,
            {
                new: true,
            }
        );
	res.status(201).json(event);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};
