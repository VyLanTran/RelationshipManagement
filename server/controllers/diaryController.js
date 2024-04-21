import Diary from "../models/DiaryModel.js";

export const addDiary = async (req, res) => {
    try {
        const { user: userId } = req.params;
        const savedDiary = await Diary.create(req.body);
        const diaries = await Diary.find({ admin: userId });
        res.status(201).json(diaries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const showAll = async (req, res) => {
    try {
        const { user: userId } = req.params;
        const diaries = await Diary.find({ admin: userId });
        res.status(200).json(diaries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const showAllDiary = async (req, res) => {
    try {
        const diaries = await Diary.find({});
        res.status(200).json(diaries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteDiary = async (req, res) => {
    try {
        const { id: diaryId } = req.params;

        const diary = await Diary.deleteOne({ _id: diaryId });
        res.status(201).json(diary);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

export const showDiary = async (req, res) => {
    try {
        const { id: diaryId } = req.params;

        const diary = await Diary.findOne({ _id: diaryId });
        res.status(201).json(diary);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

export const editDiary = async (req, res) => {
    try {
        const { id: diaryId } = req.params;

        const diary = await Diary.findOneAndUpdate(
            { _id: diaryId },
            req.body,
            {
                new: true,
            }
        );
	res.status(201).json(diary);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};
