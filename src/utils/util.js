export const setNumberColor = (item = 0) => {
  let num = /%/.test(item) ? (num = item.replace(/%/, '') / 100) : 0;
  if (num > 1) {
    return `<span style="color: red;">${item}</span>`;
  } else {
    return `<span style="color: green;">${item}</span>`;
  }
};
