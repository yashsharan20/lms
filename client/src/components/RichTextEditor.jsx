import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const RichTextEditor = ({ input, setInput }) => {
  const editorRef = useRef(null);
  const quillInstanceRef = useRef(null);

  // Initialize Quill
  useEffect(() => {
    if (editorRef.current && !quillInstanceRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
      });

      // Listen to changes
      quill.on('text-change', () => {
        const content = quill.root.innerHTML;
        setInput(prev => ({ ...prev, description: content }));
      });

      quillInstanceRef.current = quill;
    }
  }, [editorRef, setInput]);

  // Set description when input.description changes (after fetch)
  useEffect(() => {
    if (quillInstanceRef.current && input.description) {
      const currentContent = quillInstanceRef.current.root.innerHTML;
      if (currentContent !== input.description) {
        quillInstanceRef.current.root.innerHTML = input.description;
      }
    }
  }, [input.description]);

  return <div ref={editorRef} />;
};

export default RichTextEditor;
