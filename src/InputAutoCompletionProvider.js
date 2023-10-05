const vscode = require('vscode'); // eslint-disable-line

function replaceAll(retStr, charObj) {
  let changedStr = retStr;
  Object.keys(charObj).forEach((key) => {
    changedStr = changedStr.replace(new RegExp(charObj[key], 'g'), charObj[key]);
  });
  return changedStr;
}

const consonantsDictDev = {
  k: 'क',
  K: 'ख',
  g: 'ग',
  Q: 'घ',
  G: 'ङ',
  c: 'च',
  C: 'छ',
  j: 'ज',
  Z: 'झ',
  J: 'ञ',
  T: 'ट',
  V: 'ठ',
  D: 'ड',
  X: 'ढ',
  N: 'ण',
  t: 'त',
  Y: 'थ',
  d: 'द',
  F: 'ध',
  n: 'न',
  p: 'प',
  P: 'फ',
  b: 'ब',
  B: 'भ',
  m: 'म',
  y: 'य',
  r: 'र',
  l: 'ल',
  v: 'व',
  z: 'श',
  S: 'ष',
  s: 'स',
  h: 'ह'
};

const mahapranasDictDev = {
  ai: 'E',
  au: 'O',
  RR: 'L',
  kh: 'K',
  gh: 'Q',
  ch: 'C',
  jh: 'Z',
  Th: 'V',
  Dh: 'X',
  th: 'Y',
  dh: 'F',
  pha: 'P',
  bh: 'B'
};

const vowelsMarkersDictDev = {
  a: '',
  A: 'ा',
  i: 'ि',
  I: 'ी',
  u: 'ु',
  U: 'ू',
  R: 'ृ',
  L: 'ॄ',
  e: 'े',
  E: 'ै',
  o: 'ो',
  O: 'ौ'
};

const actualVowelsDictDev = {
  a: 'अ',
  A: 'आ',
  i: 'इ',
  I: 'ई',
  u: 'उ',
  U: 'ऊ',
  R: 'ऋ',
  L: 'ॠ',
  e: 'ए',
  E: 'ऐ',
  o: 'ओ',
  O: 'औ'
};

const specialVowelsDictDev = {
  M: 'ं',
  H: 'ः'
};
const spacePeriodDev = [' ', '.'];

const consonantDevArr = Object.keys(consonantsDictDev);
const vowelsMarkersDevArr = Object.keys(vowelsMarkersDictDev);
const specialVowelsDevArr = Object.keys(specialVowelsDictDev);
const actualVowelsDevArr = Object.keys(actualVowelsDictDev);

function kh2dev(orig) {
  let transstr = '';
  const st = replaceAll(orig, mahapranasDictDev);
  const fch = st.charAt('0');
  let stringIndex = 0;
  if (actualVowelsDevArr.includes(fch)) {
    // if starting character is a vowel
    transstr = actualVowelsDictDev[fch];
    stringIndex = 1;
  }
  for (let i = stringIndex; i < st.length; i += 1) {
    const ch = st.charAt(i);
    const nch = st.charAt(i + 1);
    const pch = st.charAt(i - 1);
    if (actualVowelsDevArr.includes(ch) && (
      // if current letter is a vowel but previous is also a vowel or a psace
      actualVowelsDevArr.includes(pch)
      || specialVowelsDevArr.includes(pch)
      || spacePeriodDev.includes(pch)
    )) {
      transstr += actualVowelsDictDev[ch];
    } else if (specialVowelsDevArr.includes(ch)) {
      // if current letter is a visarga or anunAsika
      transstr += specialVowelsDictDev[ch];
      if (actualVowelsDevArr.includes(nch)) {
        transstr += actualVowelsDictDev[nch];
        i += 1;
      }
    } else if
    // if consonant is followed by a consonant or end of string
    (consonantDevArr.includes(ch)
      && (consonantDevArr.includes(nch)
      || i === st.length - 1
      || spacePeriodDev.includes(nch)
      )) {
      transstr += `${consonantsDictDev[ch]}्`;
    } else if (consonantDevArr.includes(ch)
      && vowelsMarkersDevArr.includes(nch)) {
      // if consonant followed by a vowel
      transstr += consonantsDictDev[ch] + vowelsMarkersDictDev[nch];
      i += 1;
    } else if (ch === '\'') {
      transstr += 'ऽ';
    } else if (ch === '.') {
      transstr += '।';
    } else {
      transstr += ch;
    }
  }
  return transstr;
}

const getSearchText = (lineText, position) => {
  const matches = lineText.substr(0, position.character).trim().match(/\w*$/);
  if (matches) {
    return matches[0];
  }
  return '';
};

/**
 *  Input auto-completion provider
 */
class InputAutoCompletionProvider {
  // eslint-disable-next-line class-methods-use-this
  provideCompletionItems(document, position) {
    const lineAt = document.lineAt(position);
    const lineText = document.getText(lineAt.range);

    const searchText = getSearchText(lineText, position);

    const items = [];
    // console.log('lineAt', lineAt);
    // console.log('lineText', lineText);
    // Add the actual typed text to suggestions list
    const item = new vscode.CompletionItem(kh2dev(searchText));
    item.sortText = String(0);
    console.log(item);
    items.push(item);

    return items;
  }
}

module.exports = InputAutoCompletionProvider;
