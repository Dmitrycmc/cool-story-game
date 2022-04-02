export function setCaretPosition(ctrl: HTMLInputElement, pos: number) {
  if (ctrl.setSelectionRange) {
    // Modern browsers
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);

    // @ts-ignore
  } else if (ctrl.createTextRange) {
    // IE8 and below
    // @ts-ignore
    var range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}
