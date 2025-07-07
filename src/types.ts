export type PluginMessageType = "webview_ready" | "note_save" | "start_save_loop";

export type PluginMessage = { type: PluginMessageType; data: string };

export type WebviewMessageType = "univer_init" | "univer_save" | "univer_update" | "univer_close";

export type WebviewMessage = { type: WebviewMessageType; data: any; themeValue?: number };

export type WebviewApiOnMessageHandler = (message: { message: WebviewMessage }) => void;

export type WebviewApi = {
  postMessage<T>(message: any): Promise<T>;
  onMessage(handler: WebviewApiOnMessageHandler): void;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  todo_due: number;
  todo_completed: number;
  is_todo: number;
  deleted_time: number;
  parent_id: string;
};
