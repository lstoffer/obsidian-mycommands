import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("This is a notice!");
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-sample-modal-simple",
			name: "Open sample modal (simple)",
			callback: () => {
				new SampleModal(this.app).open();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "sample-editor-command",
			name: "Sample editor command",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Sample Editor Command");
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// Add a code block and start with entering the language
		this.addCommand({
			id: "add-code-block",
			name: "Add code block to file",
			editorCallback: (editor: Editor) => {
				editor.replaceRange("``` \n```", editor.getCursor());
				const position = editor.getCursor();
				const retract_length = 3;
				editor.setCursor({
					line: position.line,
					ch: position.ch + retract_length,
				});
			},
		});

		/* The follwing commands are used to set headings via commands */

		// Add a heading 1
		this.addCommand({
			id: "add-heading1",
			name: "Add H1",
			editorCallback: (editor: Editor) => {
				editor.replaceRange("# ", editor.getCursor());
				const position = editor.getCursor();
				editor.setCursor(position.line, position.ch + 2);
			},
		});

		// Add a heading 2
		this.addCommand({
			id: "add-heading2",
			name: "Add H2",
			editorCallback: (editor: Editor) => {
				editor.replaceRange("## ", editor.getCursor());
				const position = editor.getCursor();
				editor.setCursor(position.line, position.ch + 3);
			},
		});

		// Add a heading 3
		this.addCommand({
			id: "add-heading3",
			name: "Add H3",
			editorCallback: (editor: Editor) => {
				editor.replaceRange("### ", editor.getCursor());
				const position = editor.getCursor();
				editor.setCursor(position.line, position.ch + 4);
			},
		});

		// Add a heading 4
		this.addCommand({
			id: "add-heading4",
			name: "Add H4",
			editorCallback: (editor: Editor) => {
				editor.replaceRange("#### ", editor.getCursor());
				const position = editor.getCursor();
				editor.setCursor(position.line, position.ch + 5);
			},
		});

		// Add a heading 5
		this.addCommand({
			id: "add-heading5",
			name: "Add H5",
			editorCallback: (editor: Editor) => {
				editor.replaceRange("##### ", editor.getCursor());
				const position = editor.getCursor();
				editor.setCursor(position.line, position.ch + 6);
			},
		});

		// Add underline
		this.addCommand({
			id: "underline",
			name: "Underline",
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection();
				if (selection) {
					editor.replaceSelection("<u>" + selection + "</u>");
				} else {
					editor.replaceRange("<u></u>", editor.getCursor());
					const position = editor.getCursor();
					editor.setCursor(position.line, position.ch + 3);
				}
			},
		});

		// Add a line break
		this.addCommand({
			id: "linebreak",
			name: "add linebreak",
			editorCallback: (editor: Editor) => {
				editor.replaceRange("<br>", editor.getCursor());
				const position = editor.getCursor();
				editor.setCursor(position.line + 1);
			},
		});

		// Insert a backslash
		this.addCommand({
			id: "backslash",
			name: "add a backslash",
			editorCallback: (editor: Editor) => {
				editor.replaceRange("\\", editor.getCursor());
				const position = editor.getCursor();
				editor.setCursor(position.line, position.ch + 1);
			},
		});

		// Insert open curly bracket
		this.addCommand({
			id: "open curly",
			name: "add open curly bracket",
			editorCallback: (editor: Editor) => {
				editor.replaceRange("{", editor.getCursor());
				const position = editor.getCursor();
				editor.setCursor(position.line, position.ch + 1);
			},
		});

		// Insert close curly bracket
		this.addCommand({
			id: "close curly",
			name: "add close curly bracket",
			editorCallback: (editor: Editor) => {
				editor.replaceRange("}", editor.getCursor());
				const position = editor.getCursor();
				editor.setCursor(position.line, position.ch + 1);
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						console.log("Secret: " + value);
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
