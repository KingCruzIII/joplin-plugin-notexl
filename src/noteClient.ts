import joplin from "api";
import Logger, { TargetType } from "@joplin/utils/Logger";

const globalLogger = new Logger();
globalLogger.addTarget(TargetType.Console);
Logger.initializeGlobalLogger(globalLogger);

const logger = Logger.create("NoteXL.NoteClient");

export const noteXLInitTitle = "```NoteXLInit```";
const noteXLDataPre = "```NoteXL-data";
const noteXLDataPost = "```";
const noteXLRegexString = `${noteXLDataPre}\n(.*)${noteXLDataPost}`;

const isNoteXLInit = (input: string): boolean => input.includes(noteXLInitTitle);
export const isNoteXL = (input: string): boolean => input.includes(noteXLDataPre) || isNoteXLInit(input);

export const getDataFromNoteXL = (input: string) => {
  const reg = new RegExp(noteXLRegexString, "gm");
  const result = reg.exec(input);
  return result ? JSON.parse(result[1]) : {};
};

export const saveNoteXL = async (data: string) => {
  logger.debug("@saveNoteXL: " + data);

  const note = await joplin.workspace.selectedNote();
  note.body = `${noteXLDataPre}\n${JSON.stringify(data)}${noteXLDataPost}`;

  await joplin.commands.execute("editor.setText", note.body);
  await joplin.data.put(["notes", note.id], null, { body: note.body });
};

export const loadNoteXL = async () => {
  const note = await joplin.workspace.selectedNote();
  logger.debug("@loadNoteXL: " + note);

  if (isNoteXLInit(note?.body)) {
    logger.debug("NoteXL: Initializing");
    await saveNoteXL("{}");
  }

  const reg = new RegExp(noteXLRegexString, "gm");
  const result = reg.exec(note?.body);
  const data = JSON.parse(result[1]);
  return data;
};
