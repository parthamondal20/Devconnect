import EmojiPicker from 'emoji-picker-react';

const EmojiPickerComponent = ({ onEmojiClick }) => {
    return (
        <div className="z-50">
            <EmojiPicker
                onEmojiClick={onEmojiClick}
                autoFocusSearch={false}
                theme="auto" // Adapts to system theme, or we can pass a prop
                searchDisabled={false}
                skinTonesDisabled
                previewConfig={{
                    showPreview: false,
                }}
                width={300}
                height={400}
            />
        </div>
    );
};

export default EmojiPickerComponent;
