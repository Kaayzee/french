import GrammarSettingsSection from "./GrammarSettingsSection";

import {
    levelOptions,
    modeOptions,
    tenseOptions,
    verbGroupOptions,
} from "./grammarOptions";

function GrammarSettingsPanel({ settings, onUpdateSetting }) {
    return (
        <div className="grammar-settings">
            <GrammarSettingsSection
                step="1"
                title="Choose your level"
                selectedValue={settings.level}
                options={levelOptions}
                onSelect={(value) => onUpdateSetting("level", value)}
            />

            <GrammarSettingsSection
                step="2"
                title="Choose verb group"
                selectedValue={settings.verbGroup}
                options={verbGroupOptions}
                onSelect={(value) => onUpdateSetting("verbGroup", value)}
            />

            <GrammarSettingsSection
                step="3"
                title="Choose tense"
                selectedValue={settings.tense}
                options={tenseOptions}
                onSelect={(value) => onUpdateSetting("tense", value)}
            />

            <GrammarSettingsSection
                step="4"
                title="Choose practice mode"
                selectedValue={settings.mode}
                options={modeOptions}
                onSelect={(value) => onUpdateSetting("mode", value)}
            />
        </div>
    );
}

export default GrammarSettingsPanel;