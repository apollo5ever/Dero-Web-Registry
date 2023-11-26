import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles

const RichTextEditor = ({ editorHtml, setEditorHtml }) => {
  // const [editorHtml, setEditorHtml] = useState("");

  const handleEditorChange = (value) => {
    setEditorHtml(value);
  };

  return (
    <div>
      <ReactQuill
        theme="snow" // You can change the theme if you want
        value={editorHtml}
        onChange={handleEditorChange}
      />
      {/*  <div>
        <p>HTML Output:</p>
        <pre>{editorHtml}</pre>
      </div> */}
    </div>
  );
};

export default RichTextEditor;
