const noteService = require("../../../src/services/note.service");
const Note = require("../../../src/models/note.model");

jest.mock("../../../src/models/note.model");

describe("Note Service", () => {
  beforeEach(() => jest.clearAllMocks());

  // Test: Update Success
  it("update note - success", async () => {
    const mockNote = { 
        user: "u1", 
        toString: () => "u1", 
        save: jest.fn().mockResolvedValue(true) 
    };
    Note.findById.mockResolvedValue(mockNote);

    await noteService.updateNote({ noteId: "n1", userId: "u1", title: "Updated" });
    expect(mockNote.save).toHaveBeenCalled();
  });

  // Test: Update Fail (Not Owner)
  it("update note - not owner", async () => {
    const mockNote = { user: "u1", toString: () => "u1" };
    Note.findById.mockResolvedValue(mockNote);

    await expect(noteService.updateNote({ noteId: "n1", userId: "attacker" }))
      .rejects.toThrow("Not authorized");
  });

  // Test: Get one fail
  it("get note - not found", async () => {
    Note.findById.mockResolvedValue(null);
    await expect(noteService.getNoteById({ noteId: "99" }))
      .rejects.toThrow("Note not found");
  });


  it("create note - success", async () => {
    Note.create.mockResolvedValue({ title: "T1" });
    const res = await noteService.createNote({ title: "T1", userId: "u1" });
    expect(res.title).toBe("T1");
  });

  it("get all notes - success", async () => {
    Note.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([{ title: "N1" }]) });
    const res = await noteService.getUserNotes({ userId: "u1" });
    expect(res.length).toBe(1);
  });

  it("delete note - success", async () => {
    const mockNote = { user: "u1", toString: () => "u1", deleteOne: jest.fn() };
    Note.findById.mockResolvedValue(mockNote);
    await noteService.deleteNote({ noteId: "n1", userId: "u1" });
    expect(mockNote.deleteOne).toHaveBeenCalled();
  });

  it("delete note - not owner", async () => {
    const mockNote = { user: "u1", toString: () => "u1" };
    Note.findById.mockResolvedValue(mockNote);
    await expect(noteService.deleteNote({ noteId: "n1", userId: "u2" }))
      .rejects.toThrow("Not authorized");
  });

});