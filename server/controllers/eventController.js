import Event from "../models/EventModel.js";
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.CLIENT_BASE_URL,
);

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

export const createEventWithGoogle = async (req, res) => {
    try {
        const event = req.body.event;
        const token = req.body.token;
        console.log("token:",token)
        oauth2Client.setCredentials({ refresh_token: token });
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const eventT = {
            summary: event.content,
            description: event.content,
            start: {
                dateTime: new Date(event.startDate).toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
                dateTime: new Date(event.endDate).toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
        };
        const response = await calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            resource: eventT,
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};
