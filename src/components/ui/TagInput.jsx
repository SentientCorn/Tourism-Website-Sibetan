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
      <div className="flex items-center gap-2">
        <div className="flex-1 flex flex-wrap items-center gap-1.5 border p-1.5 px-2.5 rounded bg-white focus-within:border-[#1B3461] focus-within:ring-2 focus-within:ring-[#1B3461] transition-all min-h-[34px]">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-[#1B3461] text-white px-2 py-0.5 rounded text-xs font-semibold"
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
            className="flex-1 min-w-[90px] outline-none bg-transparent border-0 p-0 text-slate-800 text-xs placeholder:text-slate-400 placeholder:text-xs"
          />
        </div>
        <button
          type="button"
          onClick={handleAddTag}
          disabled={!inputValue.trim()}
          className="border border-[#1B3461] bg-[#1B3461] text-white hover:bg-[#1B3461]/90 px-2.5 py-1 rounded font-bold text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 inline-flex items-center gap-1 h-[36px]"
          title="Tambah Tag"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </button>
      </div>
      <p className="text-[11px] text-slate-500 mt-1">Ketik tag lalu tekan <b>Enter</b> atau tombol <b>Tambah</b> di samping.</p>
    </div>
  );
};

export default TagInput;
