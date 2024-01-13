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
