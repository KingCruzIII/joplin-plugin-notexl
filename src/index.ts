import joplin from "api";

import { loadNoteXL, saveNoteXL, isNoteXL, noteInitString } from "./noteClient";
import { Note, PluginMessage } from "./types";
import { ViewHandle } from "api/types";
import Logger, { TargetType } from "@joplin/utils/Logger";

const globalLogger = new Logger();
globalLogger.addTarget(TargetType.Console);
Logger.initializeGlobalLogger(globalLogger);

const logger = Logger.create("NoteXL");

const escapeTitleText = (text: string) => {
  return text.replace(/(\[|\])/g, "\\$1");
};

const notifySave = async (view: string) => {
  joplin.views.editors.postMessage(view, { type: "univer_save" });
};

const startSaveLoop = async (view: ViewHandle) => {
  logger.info("@startSaveLoop");
  const intervalId = setInterval(() => notifySave(view), 5000);
  return () => clearInterval(intervalId);
};

joplin.plugins.register({
  onStart: async () => {
    logger.info("Plugin Starting");

    // Create the NoteXL editor
    const view = await joplin.views.editors.create("notexl-editor");

    startSaveLoop(view);

    const handleOnActivationCheck = async () => {
      logger.info("@handleOnActivationCheck");
      const note: Note = await joplin.workspace.selectedNote();
      if (!note) return false;

      logger.info("onActivationCheck: Handling note: " + note.id);
      const isNXL = isNoteXL(note ? note.body : "");
      logger.info("onActivationCheck: Note is NoteXL:", isNXL);
      return isNXL;
    };
    await joplin.views.editors.onActivationCheck(view, handleOnActivationCheck);

    const updateFromNote = async () => {
      logger.info("@handleOnUpdate");
      const note: Note = await joplin.workspace.selectedNote();
      logger.info("@handleOnUpdate: " + note.body);

      if (!note) return;
      const themeValue = await joplin.settings.globalValue("theme");
      joplin.views.editors.postMessage(view, { type: "univer_update", data: await loadNoteXL(), themeValue });
    };
    await joplin.views.editors.onUpdate(view, updateFromNote);

    const handleMessage = async (message: PluginMessage) => {
      const { type, data } = message;
      logger.info("@handleMessage: " + type);

      switch (type) {
        case "webview_ready":
          await updateFromNote();
          break;
        case "note_save":
          await saveNoteXL(data);
          break;
        default:
          break;
      }
    };
    await joplin.views.editors.onMessage(view, handleMessage);

    await joplin.views.editors.setHtml(view, '<div id="univer-app"></div>');
    await joplin.views.editors.addScript(view, "./webview.css");
    await joplin.views.editors.addScript(view, "./univer.js");

    // Create Notexl menu and dialog
    await joplin.views.menus.create("notexl-menu", "NoteXL", [
      {
        commandName: "noteXLCreateNew",
      },
    ]);
    const noteXLTitleDialog = await joplin.views.dialogs.create("jpNoteXLDialog");

    await joplin.views.dialogs.setButtons(noteXLTitleDialog, [
      {
        id: "ok",
      },
      {
        id: "cancel",
      },
    ]);

    await joplin.views.dialogs.setHtml(
      noteXLTitleDialog,
      `
    <div style="font-family: sans-serif; padding: 1em; max-width: 300px;">
      <form name="titleForm" onsubmit="return false;">
        <label for="createNewTitle" style="display: block; margin-bottom: 0.5em; font-weight: bold;">
          Provide Note Title
        </label>
        <input
          id="createNewTitle"
          type="text"
          name="title"
          placeholder="Enter title..."
          style="padding: 0.5em; border: 1px solid #ccc; border-radius: 4px;"
        >
      </form>
    </div>
    <script>
      document.getElementById('createNewTitle')?.focus();
    </script>
		`
    );

    const handleCreateNewNoteXL = async () => {
      logger.info("@handleCreateNewNoteXL");
      const note: Note = await joplin.workspace.selectedNote();
      let result = await joplin.views.dialogs.open(noteXLTitleDialog);
      const title = result.formData.titleForm.title;

      const folder = await joplin.data.get(["folders", note.parent_id]);
      let noteParentId = folder.id;

      await joplin.data.post(["notes"], null, { body: noteInitString, title: escapeTitleText(title), parent_id: noteParentId });
    };
    await joplin.commands.register({
      name: "noteXLCreateNew",
      label: "Create New NoteXL",
      execute: handleCreateNewNoteXL,
    });

    logger.info("NoteXL!");
  },
});
