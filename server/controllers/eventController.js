import Event from "../models/EventModel.js";

import fs from 'fs/promises'
import path from 'path'
import process from 'process'
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.readonly'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

//Reads previously authorized credentials from the save file.

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

//Serializes credentials to a file compatible with GoogleAuth.fromJSON.
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

//Load or request or authorization to call APIs.
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function newEvent(auth) {
    const calendar = google.calendar({version: 'v3', auth});
    const event = {
        'summary': 'Google I/O 2015',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
          'dateTime': '2024-05-28T09:00:00-07:00',
          'timeZone': 'America/Los_Angeles',
        },
        'end': {
          'dateTime': '2024-05-30T17:00:00-07:00',
          'timeZone': 'America/Los_Angeles',
        },
        'recurrence': [],
        'attendees': [],
        'reminders': {'useDefault': true,},
      };
      calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        requestBody: event,
    }, function(err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        console.log('Event created: %s', event.htmlLink);
    });
}

export const addEvent = async (req, res) => {
    try {
        const savedEvent = await Event.create(req.body);
        authorize().then(newEvent).catch(console.error);
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
