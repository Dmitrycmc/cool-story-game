let stateKey: string, eventKey: string, keys: Record<string, string> = {
  hidden: "visibilitychange",
  webkitHidden: "webkitvisibilitychange",
  mozHidden: "mozvisibilitychange",
  msHidden: "msvisibilitychange"
};
for (stateKey in keys) {
  if (stateKey in document) {
    eventKey = keys[stateKey];
    break;
  }
}

// @ts-ignore
export const isVisible = () => !document[stateKey];
export const addEventListenerOnce = (c: any) => document.addEventListener(eventKey, function f() {
  c();
  document.removeEventListener(eventKey, f);
});
export const addEventListener = (c: any) => document.addEventListener(eventKey, c);
export const removeEventListener = (c: any) => document.removeEventListener(eventKey, c);
