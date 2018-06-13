export const pad = (num) => {
  let s = String(num);
  while (s.length < 2) { s = `0${s}`; }
  return s;
};
