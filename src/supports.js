let tagSoup = false;
let selfClose = false;

let work = window.document.createElement('div');

try {
  const html = '<P><I></P></I>';
  work.innerHTML = html;
  tagSoup = work.innerHTML !== html;
} catch (e) {
  tagSoup = false;
}

try {
  work.innerHTML = '<P><i><P></P></i></P>';
  selfClose = work.childNodes.length === 2;
} catch (e) {
  selfClose = false;
}

work = null;

export {
  tagSoup,
  selfClose
};
