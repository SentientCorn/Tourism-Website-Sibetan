import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const TagInput = ({ value, onChange, placeholder = "Ketik teks..." }) => {
  const [inputValue, setInputValue] = useState('');

  // Convert comma-separated string to array
  const tags = typeof value === 'string' && value.trim() !== ''
    ? value.split(',').map(tag => tag.trim()).filter(Boolean)
    : [];

  const handleAddTag = () => {
    const newTag = inputValue.trim();
    // Remove comma if user accidentally typed it at the end
    const cleanTag = newTag.replace(/,+$/, '').trim();
    if (cleanTag && !tags.includes(cleanTag)) {
      const newTags = [...tags, cleanTag];
      onChange(newTags.join(', '));
    }
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Allow removing last tag with backspace
      const newTags = [...tags];
      newTags.pop();
      onChange(newTags.join(', '));
    }
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    onChange(newTags.join(', '));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 border p-2 rounded bg-white focus-within:border-brand focus-within:ring-1 focus-within:ring-brand transition-shadow">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className="flex items-center gap-1 bg-brand text-white px-2.5 py-1 rounded-md text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : "Ketik lagi..."}
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
        />
        <button
          type="button"
          onClick={handleAddTag}
          disabled={!inputValue.trim()}
          className="bg-accent text-white hover:bg-accent/90 p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 flex items-center justify-center"
          title="Tambah"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-1">Ketik teks lalu klik <b>Tambah</b> (atau tekan Enter).</p>
    </div>
  );
};

export default TagInput;
