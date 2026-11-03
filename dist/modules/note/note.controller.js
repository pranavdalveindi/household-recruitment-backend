"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteController = exports.NoteController = void 0;
const note_service_1 = require("./note.service");
const api_response_1 = require("../../utils/api-response");
class NoteController {
    async getByHouseholdId(req, res) {
        const notes = await note_service_1.noteService.getByHouseholdId(req.params.householdId);
        api_response_1.ApiResponder.success(res, notes);
    }
    async create(req, res) {
        const note = await note_service_1.noteService.create(req.body, req.user);
        api_response_1.ApiResponder.created(res, note, 'Note added successfully');
    }
}
exports.NoteController = NoteController;
exports.noteController = new NoteController();
