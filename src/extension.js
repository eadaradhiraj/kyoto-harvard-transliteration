const vscode = require('vscode'); // eslint-disable-line
const InputAutoCompletionProvider = require('./InputAutoCompletionProvider');

let disposableProvider;
let disposableStatus;
let isProviderEnabled = false;

function activate(context) {
  const disposable = vscode.commands.registerCommand(
    'extension.kyotoHarvardTransliteration',
    () => {
      if (isProviderEnabled) {
        isProviderEnabled = false;
        vscode.Disposable.from(disposableProvider).dispose();
        vscode.Disposable.from(disposableStatus).dispose();
      } else {
        isProviderEnabled = true;
        disposableStatus = vscode.window.setStatusBarMessage(
          'Kyoto Harvard Transliteration Active'
        );
        const provider = new InputAutoCompletionProvider();
        disposableProvider = vscode.languages.registerCompletionItemProvider(
          '*',
          provider,
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
          'q',
          'r',
          's',
          't',
          'v',
          'w',
          'x',
          'y',
          'z',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '0'
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
