require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.0/min/vs' }});
require(["vs/editor/editor.main"], function () {
  window.editor = monaco.editor.create(document.getElementById("editor"), {
    value: "<html><body><h1>Hello Cloud!</h1></body></html>",
    language: "html"
  });
});

async function runCode() {
  const code = editor.getValue();
  const res = await fetch("https://your-render-app.onrender.com/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  });
  const { url } = await res.json();
  document.getElementById("resultFrame").src = url;
}
