import { readFile, writeFile } from "node:fs/promises";

const themeFiles = {
  sunburstDark: "themes/sunburst-dark-color-theme.json",
  sunburstLight: "themes/sunburst-light-color-theme.json",
  blueburstDark: "themes/blueburst-dark-color-theme.json",
};

const sunburstPalette = {
  accent: "#FF7802",
  accentHover: "#FF8A24",
  accentPressed: "#E56D00",
  gold: "#FFD700",
  amber: "#E5A24A",
  amberSoft: "#F4A460",
  cream: "#F8E4C9",
  warmWhite: "#FFF8F0",
  sand: "#D9AE7A",
  saddle: "#CD853F",
  cocoa: "#8B4513",
  cocoaDeep: "#6E2D0A",
  chestnut: "#5D3019",
  walnut: "#3F2011",
  espresso: "#2B1D0E",
  ink: "#1A0E05",
  smoke: "#A88E6A",
  stone: "#704214",
  paleText: "#D5D5D5",
  red: "#D94C3D",
};

const blueburstPalette = {
  accent: "#32C8FF",
  accentHover: "#5ED6FF",
  accentPressed: "#1EADD8",
  cyan: "#7CEBFF",
  aqua: "#22B5D8",
  aquaSoft: "#1B89A7",
  aquaDeep: "#14566B",
  cream: "#F2E7C3",
  warmWhite: "#F7FBFF",
  steel: "#86A9C1",
  mist: "#BCD7E8",
  paleText: "#D8ECF7",
  navy: "#0D1724",
  navySoft: "#102234",
  navyDeep: "#09131E",
  navyAlt: "#14344A",
  slate: "#234F67",
  border: "#34647F",
  amber: "#D39B33",
  amberSoft: "#F0BC58",
  red: "#D36A64",
  green: "#7AB8A8",
};

const sunburstSemanticTokenColors = {
  newOperator: "#d77d3d",
  stringLiteral: "#D2691E",
  customLiteral: "#d77d3d",
  numberLiteral: "#F4A460",
};

const blueburstSemanticTokenColors = {
  newOperator: "#59D8FF",
  stringLiteral: "#9BE9FF",
  customLiteral: "#59D8FF",
  numberLiteral: "#F0BC58",
};

function stripJsonComments(source) {
  let output = "";
  let inString = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const current = source[index];
    const next = source[index + 1];

    if (inLineComment) {
      if (current === "\n") {
        inLineComment = false;
        output += current;
      }
      continue;
    }

    if (inBlockComment) {
      if (current === "*" && next === "/") {
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (!inString && current === "/" && next === "/") {
      inLineComment = true;
      index += 1;
      continue;
    }

    if (!inString && current === "/" && next === "*") {
      inBlockComment = true;
      index += 1;
      continue;
    }

    output += current;

    if (current === "\"" && !escaped) {
      inString = !inString;
    }

    escaped = current === "\\" && !escaped;

    if (current !== "\\") {
      escaped = false;
    }
  }

  return output;
}

function stripTrailingCommas(source) {
  return source.replace(/,\s*([}\]])/g, "$1");
}

function parseTheme(source) {
  return JSON.parse(stripTrailingCommas(stripJsonComments(source)));
}

async function loadTheme(path) {
  return parseTheme(await readFile(path, "utf8"));
}

async function writeTheme(path, theme) {
  await writeFile(path, `${JSON.stringify(theme, null, 4)}\n`);
}

function cloneTheme(theme) {
  return JSON.parse(JSON.stringify(theme));
}

function normalizeScopes(scope) {
  return Array.isArray(scope) ? scope : [scope];
}

function patchTokenColors(theme, targets, patch) {
  for (const entry of theme.tokenColors) {
    const scopes = normalizeScopes(entry.scope ?? []);
    if (scopes.some((scope) => targets.includes(scope))) {
      entry.settings = {
        ...entry.settings,
        ...patch,
      };
    }
  }
}

function buildSunburstPolish(mode) {
  const isDark = mode === "dark";

  return isDark
    ? {
        "activityBarBadge.foreground": sunburstPalette.ink,
        "badge.background": sunburstPalette.amberSoft,
        "badge.foreground": sunburstPalette.ink,
        "breadcrumb.foreground": sunburstPalette.smoke,
        "breadcrumb.focusForeground": sunburstPalette.cream,
        "button.background": sunburstPalette.accent,
        "button.foreground": sunburstPalette.ink,
        "button.hoverBackground": sunburstPalette.accentHover,
        "button.secondaryBackground": sunburstPalette.chestnut,
        "button.secondaryForeground": sunburstPalette.cream,
        "button.secondaryHoverBackground": "#764023",
        "diffEditor.insertedTextBackground": "#6B8E2326",
        "diffEditor.removedTextBackground": "#D94C3D26",
        "dropdown.background": sunburstPalette.walnut,
        "dropdown.foreground": sunburstPalette.cream,
        "dropdown.border": sunburstPalette.saddle,
        "editor.findMatchBackground": "#FFD70033",
        "editor.findMatchHighlightBackground": "#FFD7001A",
        "editor.findMatchBorder": "#FFD70066",
        "editor.selectionForeground": sunburstPalette.cream,
        "editor.selectionHighlightBorder": "#F8E4C978",
        "editor.wordHighlightStrongBackground": "#FF78024D",
        "editorActionList.background": sunburstPalette.chestnut,
        "editorActionList.focusBackground": sunburstPalette.cocoa,
        "editorActionList.foreground": "#FFCC66",
        "editorActionList.focusForeground": sunburstPalette.cream,
        "editorGroup.border": sunburstPalette.stone,
        "editorLineNumber.dimmedForeground": "#7D674D",
        "editorRuler.foreground": "#70421480",
        "editorSuggestWidget.background": sunburstPalette.chestnut,
        "editorSuggestWidget.foreground": "#FFCC66",
        "editorSuggestWidget.selectedBackground": sunburstPalette.cocoa,
        "editorSuggestWidget.highlightForeground": sunburstPalette.accent,
        "editorSuggestWidget.border": sunburstPalette.saddle,
        "editorWidget.background": sunburstPalette.ink,
        "editorWhitespace.foreground": "#70421466",
        "minimap.findMatchHighlight": "#FFD70080",
        "minimap.selectionHighlight": "#F8E4C955",
        "panel.background": sunburstPalette.walnut,
        "panel.border": sunburstPalette.stone,
        "panelTitle.activeBorder": sunburstPalette.accent,
        "panelTitle.activeForeground": sunburstPalette.cream,
        "panelTitle.inactiveForeground": "#FFCC66",
        "scrollbarSlider.background": "#F8E4C933",
        "scrollbarSlider.hoverBackground": "#F8E4C955",
        "scrollbarSlider.activeBackground": "#F8E4C977",
        "sideBarSectionHeader.background": sunburstPalette.espresso,
        "sideBarSectionHeader.foreground": sunburstPalette.cream,
        "sideBarSectionHeader.border": sunburstPalette.stone,
        "statusBar.debuggingForeground": sunburstPalette.cream,
        "tab.activeForeground": sunburstPalette.cream,
        "tab.activeBorderTop": sunburstPalette.accent,
        "terminal.selectionBackground": "#FFD70033",
        "terminal.selectionForeground": sunburstPalette.cream,
      }
    : {
        "activityBarBadge.foreground": sunburstPalette.cocoaDeep,
        "badge.background": sunburstPalette.amberSoft,
        "badge.foreground": sunburstPalette.cocoaDeep,
        "breadcrumb.foreground": "#A06734",
        "breadcrumb.focusForeground": sunburstPalette.cocoaDeep,
        "button.background": sunburstPalette.accent,
        "button.foreground": sunburstPalette.warmWhite,
        "button.hoverBackground": sunburstPalette.accentPressed,
        "button.secondaryBackground": sunburstPalette.amber,
        "button.secondaryForeground": sunburstPalette.cocoaDeep,
        "button.secondaryHoverBackground": "#D9932A",
        "diffEditor.insertedTextBackground": "#6B8E231F",
        "diffEditor.removedTextBackground": "#D94C3D1F",
        "dropdown.background": sunburstPalette.cream,
        "dropdown.foreground": sunburstPalette.cocoa,
        "dropdown.border": sunburstPalette.saddle,
        "editor.findMatchBackground": "#DAA52059",
        "editor.findMatchHighlightBackground": "#E5A24A33",
        "editor.findMatchBorder": "#C85C3180",
        "editor.selectionForeground": "#5A2408",
        "editor.selectionHighlightBorder": "#CD853F80",
        "editor.wordHighlightStrongBackground": "#E5A24A66",
        "editorActionList.background": sunburstPalette.cream,
        "editorActionList.focusBackground": sunburstPalette.amber,
        "editorActionList.foreground": sunburstPalette.cocoa,
        "editorActionList.focusForeground": sunburstPalette.cocoaDeep,
        "editorGroup.border": "#CD853F55",
        "editorLineNumber.dimmedForeground": sunburstPalette.sand,
        "editorRuler.foreground": "#CD853F66",
        "editorSuggestWidget.background": sunburstPalette.cream,
        "editorSuggestWidget.foreground": sunburstPalette.cocoa,
        "editorSuggestWidget.selectedBackground": "#DAA520",
        "editorSuggestWidget.highlightForeground": sunburstPalette.accent,
        "editorSuggestWidget.border": sunburstPalette.saddle,
        "editorWidget.background": sunburstPalette.cream,
        "editorWhitespace.foreground": "#CD853F40",
        "minimap.findMatchHighlight": "#DAA52066",
        "minimap.selectionHighlight": "#8B451344",
        "panel.background": sunburstPalette.cream,
        "panel.border": sunburstPalette.saddle,
        "panelTitle.activeBorder": sunburstPalette.accent,
        "panelTitle.activeForeground": sunburstPalette.cocoaDeep,
        "panelTitle.inactiveForeground": sunburstPalette.cocoa,
        "scrollbarSlider.background": "#8B451322",
        "scrollbarSlider.hoverBackground": "#8B451344",
        "scrollbarSlider.activeBackground": "#8B451355",
        "sideBarSectionHeader.background": "#F4DEC1",
        "sideBarSectionHeader.foreground": sunburstPalette.cocoaDeep,
        "sideBarSectionHeader.border": "#D9B48A",
        "statusBar.debuggingForeground": sunburstPalette.cocoaDeep,
        "tab.activeForeground": sunburstPalette.cocoaDeep,
        "tab.activeBorderTop": sunburstPalette.accent,
        "terminal.selectionBackground": "#E5A24A4D",
        "terminal.selectionForeground": "#5A2408",
      };
}

function buildBlueburstColors() {
  return {
    "list.activeSelectionIconForeground": blueburstPalette.cream,
    "terminal.inactiveSelectionBackground": "#1B89A74D",
    "widget.border": blueburstPalette.border,
    "actionBar.toggledBackground": "#1A5066",
    "checkbox.border": blueburstPalette.steel,
    "editor.selectionHighlightBackground": "#32C8FF24",
    "editor.wordHighlightBackground": "#32C8FF22",
    "editor.wordHighlightStrongBackground": "#32C8FF40",
    "editor.findMatchBackground": "#F0BC5850",
    "editor.findMatchHighlightBackground": "#32C8FF24",
    "editor.findMatchBorder": "#F0BC5890",
    "editor.selectionBackground": "#1BB5D85A",
    "editor.selectionForeground": blueburstPalette.warmWhite,
    "editor.selectionHighlightBorder": "#7CEBFF66",
    "editor.inactiveSelectionBackground": "#1B89A744",
    "editor.lineHighlightBackground": "#14344A55",
    "editor.background": blueburstPalette.navy,
    "editor.foreground": blueburstPalette.paleText,
    "editorLink.activeForeground": blueburstPalette.accent,
    "list.dropBackground": "#1EADD855",
    "activityBarBadge.background": blueburstPalette.amber,
    "activityBarBadge.foreground": blueburstPalette.navyDeep,
    "sideBarTitle.foreground": blueburstPalette.cream,
    "input.placeholderForeground": blueburstPalette.steel,
    "menu.background": blueburstPalette.navySoft,
    "menu.foreground": blueburstPalette.paleText,
    "menu.separatorBackground": blueburstPalette.border,
    "menu.border": blueburstPalette.border,
    "menu.selectionBackground": "#14344A",
    "statusBarItem.remoteForeground": blueburstPalette.cream,
    "statusBarItem.remoteBackground": "#15394C",
    "ports.iconRunningProcessForeground": blueburstPalette.amberSoft,
    "list.highlightForeground": blueburstPalette.accent,
    "list.hoverBackground": "#14344A80",
    "list.activeSelectionForeground": blueburstPalette.warmWhite,
    "list.activeSelectionBackground": "#1A5066CC",
    "list.inactiveSelectionForeground": blueburstPalette.paleText,
    "list.inactiveSelectionBackground": "#14344A73",
    "pickerGroup.border": blueburstPalette.accent,
    "pickerGroup.foreground": blueburstPalette.cyan,
    "quickInput.background": blueburstPalette.navySoft,
    "quickInput.foreground": blueburstPalette.paleText,
    "quickInputTitle.background": blueburstPalette.navySoft,
    "quickInputList.focusBackground": "#1A5066",
    "quickInputList.focusForeground": blueburstPalette.warmWhite,
    "input.background": blueburstPalette.navySoft,
    "input.foreground": blueburstPalette.paleText,
    "input.border": blueburstPalette.border,
    "inputOption.activeBorder": blueburstPalette.accent,
    "focusBorder": blueburstPalette.accent,
    "inputValidation.infoBorder": blueburstPalette.accent,
    "inputValidation.warningBorder": blueburstPalette.amberSoft,
    "inputValidation.errorBorder": blueburstPalette.red,
    "notifications.background": blueburstPalette.navySoft,
    "notifications.foreground": blueburstPalette.paleText,
    "notifications.border": blueburstPalette.border,
    "editorHoverWidget.background": blueburstPalette.navySoft,
    "editorHoverWidget.foreground": blueburstPalette.paleText,
    "editorHoverWidget.border": blueburstPalette.border,
    "editorSuggestWidget.background": blueburstPalette.navyAlt,
    "editorSuggestWidget.foreground": blueburstPalette.paleText,
    "editorSuggestWidget.selectedBackground": "#1A5066",
    "editorSuggestWidget.highlightForeground": blueburstPalette.accent,
    "editorSuggestWidget.border": blueburstPalette.border,
    "editorActionList.background": blueburstPalette.navyAlt,
    "editorActionList.focusBackground": "#1A5066",
    "editorActionList.foreground": blueburstPalette.paleText,
    "editorActionList.focusForeground": blueburstPalette.warmWhite,
    "editorWidget.background": blueburstPalette.navyDeep,
    "editorCursor.foreground": blueburstPalette.accent,
    "editorLineNumber.foreground": "#5E7E96",
    "editorLineNumber.activeForeground": blueburstPalette.cyan,
    "editorLineNumber.dimmedForeground": "#4D6678",
    "editorIndentGuide.background1": "#31556B66",
    "editorIndentGuide.activeBackground1": "#7CEBFF88",
    "editorBracketMatch.border": blueburstPalette.amberSoft,
    "editorBracketHighlight.foreground1": blueburstPalette.cyan,
    "editorBracketHighlight.foreground2": blueburstPalette.accent,
    "editorBracketHighlight.foreground3": blueburstPalette.amberSoft,
    "editorBracketHighlight.foreground4": blueburstPalette.cream,
    "editorBracketHighlight.foreground5": "#6CB4FF",
    "editorBracketHighlight.foreground6": "#4E89B8",
    "activityBar.background": blueburstPalette.navySoft,
    "activityBar.foreground": blueburstPalette.paleText,
    "sideBar.background": blueburstPalette.navyDeep,
    "sideBar.foreground": blueburstPalette.paleText,
    "sideBarSectionHeader.background": blueburstPalette.navy,
    "sideBarSectionHeader.foreground": blueburstPalette.cream,
    "sideBarSectionHeader.border": blueburstPalette.border,
    "statusBar.background": blueburstPalette.navySoft,
    "statusBar.foreground": blueburstPalette.paleText,
    "statusBar.debuggingForeground": blueburstPalette.cream,
    "titleBar.activeBackground": blueburstPalette.navy,
    "titleBar.activeForeground": blueburstPalette.paleText,
    "tab.activeBackground": blueburstPalette.navyAlt,
    "tab.activeForeground": blueburstPalette.warmWhite,
    "tab.activeBorderTop": blueburstPalette.accent,
    "tab.inactiveBackground": blueburstPalette.navySoft,
    "editorGroupHeader.tabsBackground": blueburstPalette.navySoft,
    "editorGroupHeader.noTabsBackground": blueburstPalette.navySoft,
    "tab.border": blueburstPalette.border,
    "tab.inactiveForeground": blueburstPalette.steel,
    "terminal.foreground": blueburstPalette.paleText,
    "terminalCursor.foreground": blueburstPalette.accent,
    "terminal.selectionBackground": "#32C8FF30",
    "terminal.selectionForeground": blueburstPalette.warmWhite,
    "terminal.ansiBlack": blueburstPalette.navyDeep,
    "terminal.ansiRed": "#D36A64",
    "terminal.ansiGreen": "#7AB8A8",
    "terminal.ansiYellow": "#F0BC58",
    "terminal.ansiBlue": "#4AAEE8",
    "terminal.ansiMagenta": "#6388C2",
    "terminal.ansiCyan": "#7CEBFF",
    "terminal.ansiWhite": "#FFFFFF",
    "badge.background": blueburstPalette.amber,
    "badge.foreground": blueburstPalette.navyDeep,
    "breadcrumb.foreground": blueburstPalette.steel,
    "breadcrumb.focusForeground": blueburstPalette.cream,
    "button.background": blueburstPalette.accent,
    "button.foreground": blueburstPalette.navyDeep,
    "button.hoverBackground": blueburstPalette.accentHover,
    "button.secondaryBackground": "#1A5066",
    "button.secondaryForeground": blueburstPalette.cream,
    "button.secondaryHoverBackground": "#20637E",
    "diffEditor.insertedTextBackground": "#7AB8A826",
    "diffEditor.removedTextBackground": "#D36A6426",
    "dropdown.background": blueburstPalette.navySoft,
    "dropdown.foreground": blueburstPalette.paleText,
    "dropdown.border": blueburstPalette.border,
    "editorGroup.border": blueburstPalette.border,
    "editorRuler.foreground": "#31556B88",
    "editorWhitespace.foreground": "#31556B70",
    "minimap.findMatchHighlight": "#F0BC5880",
    "minimap.selectionHighlight": "#7CEBFF44",
    "panel.background": blueburstPalette.navySoft,
    "panel.border": blueburstPalette.border,
    "panelTitle.activeBorder": blueburstPalette.accent,
    "panelTitle.activeForeground": blueburstPalette.cream,
    "panelTitle.inactiveForeground": blueburstPalette.steel,
    "scrollbarSlider.background": "#BCD7E833",
    "scrollbarSlider.hoverBackground": "#BCD7E855",
    "scrollbarSlider.activeBackground": "#BCD7E877",
  };
}

function buildBlueburstTheme(baseTheme) {
  const theme = cloneTheme(baseTheme);

  theme.name = "Blueburst Dark";
  theme.type = "dark";
  theme.colors = buildBlueburstColors();
  theme.semanticHighlighting = true;
  theme.semanticTokenColors = blueburstSemanticTokenColors;

  patchTokenColors(theme, ["support.type.property-name.json"], {
    foreground: blueburstPalette.mist,
  });
  patchTokenColors(theme, ["string.quoted.double.json", "string.quoted.single.json"], {
    foreground: "#D9F7FF",
  });
  patchTokenColors(theme, ["punctuation.definition.array", "punctuation.definition.bracket"], {
    foreground: blueburstPalette.accent,
  });
  patchTokenColors(
    theme,
    ["meta.embedded", "source.groovy.embedded", "string meta.image.inline.markdown", "variable.legacy.builtin.python"],
    { foreground: "#79D7F0" },
  );
  patchTokenColors(theme, ["header", "constant.language", "entity.name.tag", "meta.diff.header", "storage", "storage.type", "variable.language"], {
    foreground: blueburstPalette.accent,
  });
  patchTokenColors(theme, ["comment"], {
    foreground: "#5F829B",
  });
  patchTokenColors(theme, ["constant.numeric", "variable.other.enummember", "keyword.operator.plus.exponent", "keyword.operator.minus.exponent", "keyword.other.unit"], {
    foreground: blueburstPalette.amberSoft,
  });
  patchTokenColors(theme, ["constant.regexp"], {
    foreground: "#7CEBFF",
  });
  patchTokenColors(theme, ["entity.name.type", "support.type"], {
    foreground: blueburstPalette.mist,
  });
  patchTokenColors(
    theme,
    [
      "entity.name.tag.css",
      "entity.name.tag.less",
      "entity.other.attribute-name",
      "entity.other.attribute-name.class.css",
      "source.css entity.other.attribute-name.class",
      "entity.other.attribute-name.id.css",
      "entity.other.attribute-name.parent-selector.css",
      "entity.other.attribute-name.parent.less",
      "source.css entity.other.attribute-name.pseudo-class",
      "entity.other.attribute-name.pseudo-element.css",
      "source.css.less entity.other.attribute-name.id",
      "entity.other.attribute-name.scss",
      "meta.structure.dictionary.key.python",
      "support.function.git-rebase",
    ],
    { foreground: "#7CEBFF" },
  );
  patchTokenColors(theme, ["markup.bold", "markup.heading", "markup.changed", "meta.preprocessor", "entity.name.function.preprocessor", "keyword", "keyword.control"], {
    foreground: blueburstPalette.accent,
  });
  patchTokenColors(theme, ["markup.inserted", "constant.sha.git-rebase"], {
    foreground: blueburstPalette.amberSoft,
  });
  patchTokenColors(theme, ["markup.deleted", "meta.preprocessor.string", "string.tag", "string.value"], {
    foreground: "#9BE9FF",
  });
  patchTokenColors(
    theme,
    [
      "entity.name.function",
      "support.function",
      "support.constant.handlebars",
      "source.powershell variable.other.member",
      "entity.name.operator.custom-literal",
      "entity.other.attribute-name.jsx",
      "entity.other.attribute-name.tsx",
      "entity.other.attribute-name.html",
    ],
    { foreground: blueburstPalette.cream },
  );
  patchTokenColors(theme, ["keyword.operator"], {
    foreground: "#6CB4FF",
  });

  return theme;
}

async function main() {
  const sunburstDark = await loadTheme(themeFiles.sunburstDark);
  const sunburstLight = await loadTheme(themeFiles.sunburstLight);

  const nextSunburstDark = {
    ...cloneTheme(sunburstDark),
    colors: {
      ...sunburstDark.colors,
      ...buildSunburstPolish("dark"),
    },
    semanticHighlighting: true,
    semanticTokenColors: sunburstSemanticTokenColors,
  };

  const nextSunburstLight = {
    ...cloneTheme(sunburstLight),
    colors: {
      ...sunburstLight.colors,
      ...buildSunburstPolish("light"),
    },
    semanticHighlighting: true,
    semanticTokenColors: sunburstSemanticTokenColors,
  };

  const blueburstDark = buildBlueburstTheme(nextSunburstDark);

  await writeTheme(themeFiles.sunburstDark, nextSunburstDark);
  await writeTheme(themeFiles.sunburstLight, nextSunburstLight);
  await writeTheme(themeFiles.blueburstDark, blueburstDark);
}

await main();
