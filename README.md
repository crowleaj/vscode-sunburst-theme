# VS Code Sunburst Theme

Inspired by the colors you might find on a sunburst guitar, enjoy!

**Enjoy!**

The extension now ships with three themes:
- `Sunburst Dark`
- `Sunburst Light`
- `Blueburst Dark`

## Use The Theme

1. Open the Command Palette in VS Code.
2. Run `Preferences: Color Theme`.
3. Select `Sunburst Dark`, `Sunburst Light`, or `Blueburst Dark`.

## Local Development

1. Open this folder in VS Code.
2. Press `F5` to launch the included extension development host.
3. In the new window, run `Preferences: Color Theme` and choose one of the bundled themes.

The repo already includes [.vscode/launch.json](/Users/alexcrowley/projects/vscode-sunburst-theme/.vscode/launch.json:1), so there is no build step for local testing.

For theme maintenance, update the shared palette and polish rules in `scripts/generate-themes.mjs`, then run `npm run generate:themes`.

## Packaging

If you want a `.vsix` for manual installation, package the extension with `vsce package`, then use `Extensions: Install from VSIX...` in VS Code.

## Screenshots

### Sunburst Dark
!["Sunburst Dark"](https://github.com/crowleaj/vscode-sunburst-theme/raw/main/screenshots/sunburst-dark.png)

### Sunburst Light
!["Sunburst Light"](https://github.com/crowleaj/vscode-sunburst-theme/raw/main/screenshots/sunburst-light.png)

## License

MIT
