# [kyoto Harvard Transliteration](https://github.com/eadaradhiraj/kyoto-harvard-transliteration)


An extension which adds support for Kyoto Harvard Transliteration in VS Code.

## Usage

Kyoto Harvard Transliteration can be activated through the command 'Toggle Kyoto Harvard Transliteration' or using the keybinding (defaults to shift+cmd+i). Once you activate and type any word, it will be transliterated to Sanskrit as per the Kyoto Harvard Rules. Status bar will indicate if Kyoto Harvard Transliteration is active or not.

## Requirements

No external dependency


## Keybindings

You can also set custom shortcut in `keybindings.json` via `Code => Preferences => Keyboard Shortcuts`
For example:

```
[
    { "key": "shift+cmd+i", // set to your favorite shortcut
      "command": "extension.kyotoHarvardTransliteration",
      "when": "editorTextFocus" }
]
```

## Known Issues

The suggestions don't appear. So the app is practically useless as it stands now
