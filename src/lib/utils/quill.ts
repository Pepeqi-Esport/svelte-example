import Quill from "quill";

function loadElementQuill(element: any) {
  let toolbarOptions = [
    [
      {
        font: [],
      },
      {
        size: [],
      },
    ],
    ["bold", "italic", "underline", "strike"],
    [
      {
        color: [],
      },
      {
        background: [],
      },
    ],
    [
      {
        script: "super",
      },
      {
        script: "sub",
      },
    ],
    [
      {
        header: "1",
      },
      {
        header: "2",
      },
      "blockquote",
      "code-block",
    ],
    [
      {
        list: "ordered",
      },
      {
        indent: "-1",
      },
      {
        indent: "+1",
      },
    ],
    [{ direction: "rtl" }, { align: [] }],
  ];

  let quill = new Quill(element, {
    bounds: element,
    modules: {
      syntax: true,
      toolbar: {
        container: toolbarOptions,
        handlers: {
          "line-height": function (this: { quill: { format: (name: string, value: string) => void } }, value: string) {
            this.quill.format("line-height", value);
          },
        },
      },
    },
    theme: "snow",
  });

  return quill;
}

export { loadElementQuill };
