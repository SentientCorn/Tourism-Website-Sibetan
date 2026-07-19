import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';

const ImageUploader = ({ onFilesSelected, label, editMode = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFiles = (files) => {
    setError('');
    const validFiles = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    for (let i = 0; i < files.length; i++) {
      if (allowedTypes.includes(files[i].type)) {
        validFiles.push(files[i]);
      } else {
        setError(`File "${files[i].name}" ditolak. Hanya format JPG, JPEG, PNG, dan WEBP yang diperbolehkan.`);
      }
    }
    return validFiles;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(filesArray);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  }, [onFilesSelected]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const validFiles = validateFiles(filesArray);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
    // Reset the input value so the same file can be selected again if needed
    e.target.value = '';
  };

  return (
    <div className="w-full">
      <label className="block font-bold mb-2 text-slate-700">
        {label || (editMode ? 'Tambah Foto Baru' : 'Upload Foto')}
      </label>
      
      <div
        className={`relative w-full border-2 border-dashed rounded-xl p-8 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group ${
          isDragging 
            ? 'border-blue-500 bg-blue-50/80' 
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 bg-white'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload-input').click()}
      >
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>
        
        <p className="font-semibold text-slate-700 mb-1">
          Klik untuk memilih, atau Drag & Drop file ke sini
        </p>
        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 justify-center">
          <ImageIcon className="w-3.5 h-3.5" />
          Format didukung: .JPG, .JPEG, .PNG, .WEBP
        </p>

        <input
          id="file-upload-input"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {error && (
        <div className="mt-2 text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-200 flex items-start gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
