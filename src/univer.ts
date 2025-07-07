import { LocaleType, merge, Univer, UniverInstanceType } from "@univerjs/core";
import { FUniver } from "@univerjs/core/lib/facade";
import { defaultTheme } from "@univerjs/design";
import DesignEnUS from "@univerjs/design/locale/en-US";
import "@univerjs/design/lib/index.css";

import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverUIPlugin } from "@univerjs/ui";
import UIEnUS from "@univerjs/ui/locale/en-US";
import "@univerjs/ui/lib/index.css";

import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import DocsUIEnUS from "@univerjs/docs-ui/locale/en-US";
import "@univerjs/docs-ui/lib/index.css";

import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import SheetsEnUS from "@univerjs/sheets/locale/en-US";
import SheetsUIEnUS from "@univerjs/sheets-ui/locale/en-US";
import "@univerjs/sheets-ui/lib/index.css";

import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsFormulaUIPlugin } from "@univerjs/sheets-formula-ui";
import SheetsFormulaUIEnUS from "@univerjs/sheets-formula-ui/locale/en-US";
import "@univerjs/sheets-formula-ui/lib/index.css";

import { UniverSheetsNumfmtPlugin } from "@univerjs/sheets-numfmt";
import { UniverSheetsNumfmtUIPlugin } from "@univerjs/sheets-numfmt-ui";
import SheetsNumfmtUIEnUS from "@univerjs/sheets-numfmt-ui/locale/en-US";
import "@univerjs/sheets-numfmt-ui/lib/index.css";

import { UniverDataValidationPlugin } from "@univerjs/data-validation";
import { UniverSheetsDataValidationPlugin } from "@univerjs/sheets-data-validation";
import { UniverSheetsDataValidationUIPlugin } from "@univerjs/sheets-data-validation-ui";
import SheetsDataValidationEnUS from "@univerjs/sheets-data-validation-ui/locale/en-US";
import "@univerjs/sheets-data-validation-ui/lib/index.css";

import { UniverSheetsTablePlugin } from "@univerjs/sheets-table";
import { UniverSheetsTableUIPlugin } from "@univerjs/sheets-table-ui";
import SheetsTableUIEnUS from "@univerjs/sheets-table-ui/locale/en-US";
import "@univerjs/sheets-table-ui/lib/index.css";

import { UniverSheetsSortPlugin } from "@univerjs/sheets-sort";
import { UniverSheetsSortUIPlugin } from "@univerjs/sheets-sort-ui";
import SheetsSortUIEnUS from "@univerjs/sheets-sort-ui/locale/en-US";
import "@univerjs/sheets-sort-ui/lib/index.css";

import { UniverSheetsHyperLinkUIPlugin } from "@univerjs/sheets-hyper-link-ui";
import SheetsHyperLinkUIEnUS from "@univerjs/sheets-hyper-link-ui/locale/en-US";
import "@univerjs/sheets-hyper-link-ui/lib/index.css";

import { UniverSheetsFindReplacePlugin } from "@univerjs/sheets-find-replace";
import { UniverFindReplacePlugin } from "@univerjs/find-replace";
import FindReplaceEnUS from "@univerjs/find-replace/locale/en-US";
import SheetsFindReplaceEnUS from "@univerjs/sheets-find-replace/locale/en-US";

import { UniverSheetsFilterPlugin } from "@univerjs/sheets-filter";
import { UniverSheetsFilterUIPlugin } from "@univerjs/sheets-filter-ui";
import SheetsFilterEnUS from "@univerjs/sheets-filter-ui/locale/en-US";
import "@univerjs/sheets-filter-ui/lib/index.css";

import { UniverSheetsConditionalFormattingPlugin } from "@univerjs/sheets-conditional-formatting";
import { UniverSheetsConditionalFormattingUIPlugin } from "@univerjs/sheets-conditional-formatting-ui";
import SheetsConditionalFormattingEnUS from "@univerjs/sheets-conditional-formatting-ui/locale/en-US";
import "@univerjs/sheets-conditional-formatting-ui/lib/index.css";

import { UniverSheetsCrosshairHighlightPlugin } from "@univerjs/sheets-crosshair-highlight";

import "@univerjs/sheets/facade";

import Logger, { TargetType } from "@joplin/utils/Logger";
import { WebviewApi, WebviewApiOnMessageHandler } from "./types";

const globalLogger = new Logger();
globalLogger.addTarget(TargetType.Console);
Logger.initializeGlobalLogger(globalLogger);

const logger = Logger.create("NoteXL.Univer");

let univer: Univer, univerAPI: FUniver;

declare var webviewApi: WebviewApi;

const createUniverInstance = () => {
  const univer = new Univer({
    theme: defaultTheme,
    locale: LocaleType.EN_US,
    locales: {
      [LocaleType.EN_US]: merge(
        {},
        DesignEnUS,
        UIEnUS,
        DocsUIEnUS,
        SheetsEnUS,
        SheetsUIEnUS,
        SheetsFormulaUIEnUS,
        SheetsNumfmtUIEnUS,
        SheetsDataValidationEnUS,
        SheetsTableUIEnUS,
        SheetsFindReplaceEnUS,
        SheetsFilterEnUS,
        SheetsConditionalFormattingEnUS,
        SheetsSortUIEnUS,
        SheetsHyperLinkUIEnUS,
        FindReplaceEnUS
      ),
    },
  });

  univer.registerPlugin(UniverRenderEnginePlugin);
  univer.registerPlugin(UniverFormulaEnginePlugin);

  univer.registerPlugin(UniverUIPlugin, {
    container: "univer-app",
  });

  univer.registerPlugin(UniverDocsPlugin);
  univer.registerPlugin(UniverDocsUIPlugin);

  univer.registerPlugin(UniverSheetsPlugin);
  univer.registerPlugin(UniverSheetsUIPlugin);
  univer.registerPlugin(UniverSheetsFormulaPlugin);
  univer.registerPlugin(UniverSheetsFormulaUIPlugin);
  univer.registerPlugin(UniverSheetsNumfmtPlugin);
  univer.registerPlugin(UniverSheetsNumfmtUIPlugin);

  univer.registerPlugin(UniverDataValidationPlugin);
  univer.registerPlugin(UniverSheetsDataValidationPlugin);
  univer.registerPlugin(UniverSheetsDataValidationUIPlugin, {
    showEditOnDropdown: true,
  });

  univer.registerPlugin(UniverSheetsTablePlugin);
  univer.registerPlugin(UniverSheetsTableUIPlugin);

  univer.registerPlugin(UniverSheetsSortPlugin);
  univer.registerPlugin(UniverSheetsSortUIPlugin);

  univer.registerPlugin(UniverSheetsHyperLinkUIPlugin);

  univer.registerPlugin(UniverFindReplacePlugin);
  univer.registerPlugin(UniverSheetsFindReplacePlugin);

  univer.registerPlugin(UniverSheetsFilterPlugin);
  univer.registerPlugin(UniverSheetsFilterUIPlugin);

  univer.registerPlugin(UniverSheetsConditionalFormattingUIPlugin);
  univer.registerPlugin(UniverSheetsConditionalFormattingPlugin);

  univer.registerPlugin(UniverSheetsCrosshairHighlightPlugin);

  univer.createUnit(UniverInstanceType.UNIVER_SHEET, {});
  return univer;
};

const createUniverAPIInstance = (univer: Univer) => {
  return FUniver.newAPI(univer);
};

const getData = () => {
  logger.info("univer.getData");
  return univerAPI.getActiveWorkbook().save();
};

const stop = () => {
  logger.info("univer.stop");
  univer.dispose();
};

const update = (data = {}, themeValue: number) => {
  logger.info("univer.update");
  logger.info("univer.update" + JSON.stringify(data));
  const darkThemes = [2, 4, 5, 6, 7, 8];
  const isDarkTheme = darkThemes.includes(themeValue);
  univerAPI?.dispose();

  univer = createUniverInstance();
  univerAPI = createUniverAPIInstance(univer);

  univerAPI.toggleDarkMode(isDarkTheme);
  univer.createUnit(UniverInstanceType.UNIVER_SHEET, data);
};

const save = async () => {
  logger.info("@univer.saveUniver");

  const data = getData();
  webviewApi.postMessage({
    type: "note_save",
    data,
  });
};

const handleWebviewMessage: WebviewApiOnMessageHandler = async ({ message }) => {
  logger.info("handleWebviewMessage.type: " + message.type);

  switch (message.type) {
    case "univer_save":
      await save();
      break;
    case "univer_update":
      update(message.data, message.themeValue);
      break;
    case "univer_close":
      stop();
      break;
    default:
      break;
  }
};

webviewApi.onMessage(handleWebviewMessage);

webviewApi.postMessage({
  type: "webview_ready",
});
