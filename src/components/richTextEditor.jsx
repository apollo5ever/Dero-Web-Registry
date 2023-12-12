import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMemo, useRef } from "react";

const RichTextEditor = ({ editorHtml, setEditorHtml }) => {
  const quillRef = useRef(null);
  const imageHandler = async () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      var file = input.files[0];
      console.log("file", file);
      var formData = new FormData();

      formData.append("image", file);

      var fileName = file.name;
      const res =
        "https://imgs.search.brave.com/xvvGnk0zqBUA0YmR20NLpPn8WZfA1iqs6ozKyPO-0B4/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjI2/NDY0MTU4L3Bob3Rv/L2NhdC13aXRoLW9w/ZW4tbW91dGguanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPVFy/OURDVmt3S21fZHpm/amtlTjVmb0NCcDdj/M0VmQkZfaTJBMGV0/WWlKT0E9";
      console.log("quillObj", quillRef);
      quillRef.current.getEditor().insertEmbed(0, "image", res);
      //const res = await this.uploadFiles(file, fileName, quillObj);
    };
  };
  const modules = useMemo(
    () => ({
      toolbar: {
        handlers: { image: imageHandler },
        container: [
          ["bold", "italic", "underline", "strike"], // toggled buttons
          ["blockquote", "code-block"],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript
          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          [{ direction: "rtl" }], // text direction

          [{ size: ["small", false, "large", "huge"] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],
          ["image"],

          ["clean"],
        ],
      },
    }),
    []
  );

  const uploadImageCallBack = (file, base64) => {
    return new Promise((resolve, reject) => {
      if (base64) {
        resolve({ data: { link: base64 } });
      } else {
        reject("Failed to upload image");
      }
    });
  };

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={editorHtml}
        onChange={setEditorHtml}
        modules={modules}
        className="ql-editor"
      />
    </div>
  );
};

export default RichTextEditor;
