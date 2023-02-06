import { App, Editor, MarkdownView, Modal, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface TextWrapSettings {
	quickTagOne: string;
	quickTagTwo: string;
	quickTagThree: string;
}

const DEFAULT_SETTINGS: TextWrapSettings = {
	quickTagOne: "",
	quickTagTwo: "",
	quickTagThree: ""
}

export default class TextWrap extends Plugin {
	settings: TextWrapSettings;

	async onload() {
		await this.loadSettings();

		// =============================
		// commands for command palette
		// =============================
		this.addCommand({
			id: 'wrap-text',
			name: 'Enter new tags',

			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selection = editor.getSelection();

				const tagAndText = (tag: string, text: string) => {
					editor.replaceSelection(`<${tag}>${text}</${tag}>`);
				};

				new TextWrapModal(this.app, selection, tagAndText).open()
			},
		});

		this.addCommand({
			id: 'quick-tag-one',
			name: 'Quick Tag One',

			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selection = editor.getSelection();
				const tag = this.settings.quickTagOne;
				editor.replaceSelection(`<${tag}>${selection}</${tag}>`)
			},
		});


		this.addCommand({
			id: 'quick-tag-two',
			name: 'Quick Tag Two',

			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selection = editor.getSelection();
				const tag = this.settings.quickTagTwo;
				editor.replaceSelection(`<${tag}>${selection}</${tag}>`)
			},
		});


		this.addCommand({
			id: 'quick-tag-three',
			name: 'Quick Tag Three',

			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selection = editor.getSelection();
				const tag = this.settings.quickTagThree;
				editor.replaceSelection(`<${tag}>${selection}</${tag}>`)
			},
		});

		this.addSettingTab(new SettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class TextWrapModal extends Modal {
	modalTag: string;
	modalText: string;

	tagAndText: (modalTag: string, modalText: string) => void;

	constructor(
		app: App,
		defaultText: string,
		tagAndText: (modalTag: string, modalText: string) => void
	) {
		super(app);
		this.modalText = defaultText;
		this.tagAndText = tagAndText;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h3", { text: "Enter tags" })

		new Setting(contentEl)
			.setName("Press submit button to send tags")
			.addText((text) =>
				text.onChange((value) => {
					this.modalTag = value;
				})
			);


		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Submit")
					.setCta()
					.onClick(() => {
						this.tagAndText(this.modalTag, this.modalText)
						this.close();
					}));
	}


	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SettingTab extends PluginSettingTab {
	plugin: TextWrap;

	constructor(app: App, plugin: TextWrap) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Customize Quick Tags' });
		containerEl.createEl('p', { text: 'Tags will be applied to selected text as: <tagName>selectedText</tagName>' });

		new Setting(containerEl)
			.setName('Quick Tag One')
			.setDesc('Customize')
			.addText(text => text
				.setValue(this.plugin.settings.quickTagOne)
				.onChange(async (value) => {
					this.plugin.settings.quickTagOne = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Quick Tag Two')
			.setDesc('Customize')
			.addText(text => text
				.setValue(this.plugin.settings.quickTagTwo)
				.onChange(async (value) => {
					this.plugin.settings.quickTagTwo = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Quick Tag Three')
			.setDesc('Customize')
			.addText(text => text
				.setValue(this.plugin.settings.quickTagThree)
				.onChange(async (value) => {
					this.plugin.settings.quickTagThree = value;
					await this.plugin.saveSettings();
				}));


	}
}
