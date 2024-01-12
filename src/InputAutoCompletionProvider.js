const vscode = require('vscode'); // eslint-disable-line

class HkAndSkt {
  static HK_CONSONANTS_DICT = {
      "k": "क",
      "g": "ग",
      "G": "ङ",
      "c": "च",
      "ch": "छ",
      "j": "ज",
      "jh": "झ",
      "J": "ञ",
      "th": "थ",
      "dh": "ध",
      "T": "ट",
      "Th": "ठ",
      "D": "ड",
      "Dh": 'ढ',
      "N": "ण",
      "t": "त",
      "d": "द",
      "n": "न",
      "p": "प",
      "b": "ब",
      "bh": "भ",
      "ph": "फ",
      "m": "म",
      "y": "य",
      "r": "र",
      "l": "ल",
      "v": "व",
      "z": "श",
      "S": "ष",
      "s": "स",
      "h": "ह",
  };

  static HK_VOWEL_MARKER_DICT = {
      'a': '',
      'A': 'ा',
      'i': 'ि',
      'I': 'ी',
      'u': 'ु',
      'U': 'ू',
      'R': 'ृ',
      'e': 'े',
      'o': 'ो',
      'au': 'ौ',
      "RR": "ॄ",
  };

  static HK_NASAL_DICT = {
      "H": "ः",
      "M": "ं"
  };

  static HK_VOWELS_DICT = {
      "a": "अ",
      "A": "आ",
      "i": "इ",
      "I": "ई",
      "u": "उ",
      "U": "ऊ",
      "R": "ऋ",
      "RR": "ॠ",
      "e": "ए",
      "ai": "ऐ",
      "o": "ओ",
      "au": "औ"
  };

  static REM_CHAR_DICT = {
      ...HkAndSkt.HK_NASAL_DICT,
      ...{"|": "।", "\'": "ऽ"}
  };

  static hk_to_skt(text) {
      const textLen = text.length;
      let res = [];
      let idx = 0;

      while (idx < textLen) {
          const ch = text[idx];
          let prevCh = null;
          let nxtCh = null;

          if (idx + 1 < textLen) {
              nxtCh = text[idx + 1];
          }

          if (idx > 0) {
              prevCh = text[idx - 1];
          }

          if (["k", "g", "c", "j", "t", "d", "T", "D", "p", "b"].includes(ch)) {
              if (HkAndSkt.HK_CONSONANTS_DICT.hasOwnProperty(prevCh)) {
                  res.push('्');
              }

              if (nxtCh === "h") {
                  res.push(HkAndSkt.HK_CONSONANTS_DICT[ch + nxtCh]);
                  idx += 1;
              } else {
                  res.push(HkAndSkt.HK_CONSONANTS_DICT[ch]);
              }
          } else if (HkAndSkt.HK_CONSONANTS_DICT.hasOwnProperty(ch)) {
              if (prevCh && HkAndSkt.HK_CONSONANTS_DICT.hasOwnProperty(prevCh)) {
                  res.push('्');
              }

              res.push(HkAndSkt.HK_CONSONANTS_DICT[ch]);
          } else if (HkAndSkt.HK_VOWELS_DICT.hasOwnProperty(ch)) {
              if (HkAndSkt.HK_CONSONANTS_DICT.hasOwnProperty(prevCh)) {
                  if ((ch === "a" && ["i", "u"].includes(nxtCh)) || (ch === "R" && nxtCh === "R")) {
                      res.push(HkAndSkt.HK_VOWEL_MARKER_DICT[ch + nxtCh]);
                      idx += 1;
                  } else {
                      res.push(HkAndSkt.HK_VOWEL_MARKER_DICT[ch]);
                  }
              } else if (!HkAndSkt.HK_CONSONANTS_DICT.hasOwnProperty(prevCh)) {
                  if ((ch === "a" && ["i", "u"].includes(nxtCh)) || (ch === "R" && nxtCh === "R")) {
                      res.push(HkAndSkt.HK_VOWELS_DICT[ch + nxtCh]);
                      idx += 1;
                  } else {
                      res.push(HkAndSkt.HK_VOWELS_DICT[ch]);
                  }
              }
          } else if (HkAndSkt.REM_CHAR_DICT.hasOwnProperty(ch)) {
              if (prevCh && HkAndSkt.HK_CONSONANTS_DICT.hasOwnProperty(prevCh)) {
                  res.push('्');
              }

              res.push(HkAndSkt.REM_CHAR_DICT[ch]);
          } else {
              if (prevCh && HkAndSkt.HK_CONSONANTS_DICT.hasOwnProperty(prevCh)) {
                  res.push('्');
              }

              res.push(ch);
          }

          idx += 1;
      }

      if (HkAndSkt.HK_CONSONANTS_DICT.hasOwnProperty(text[textLen - 1])) {
          res.push('्');
      }

      return res.join('');
  }
}

const getSearchText = (lineText, position) => {
  const matches = lineText.substr(0, position.character).trim().match(/[^0-9\s]*$/);
  return matches ?? '';
};

/**
 *  Input auto-completion provider
 */
class InputAutoCompletionProvider {
  // eslint-disable-next-line class-methods-use-this
  provideCompletionItems(document, position) {
    const lineAt = document.lineAt(position);
    const lineText = document.getText(lineAt.range);
    const match = getSearchText(lineText, position);
    // Add the actual typed text to suggestions list
    const item = new vscode.CompletionItem(
      HkAndSkt.hk_to_skt(match[0])
    );
    item.filterText = match[0];
    // need range from beginning of match (match.index) to cursorPosition
    item.range = new vscode.Range(position.line, match.index, position.line, position.character);
    item.preselect = true;
    item.sortText = String(0);
    // return [item];
    return  new vscode.CompletionList([item], true);
  }
}

module.exports = InputAutoCompletionProvider;
