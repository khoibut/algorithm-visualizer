import {EditorView, basicSetup} from "codemirror"
import {keymap} from "@codemirror/view"
import {pythonLanguage} from "@codemirror/lang-python"
import { oneDark } from "@codemirror/theme-one-dark"
import {indentWithTab} from "@codemirror/commands"
let editor = new EditorView({
  doc:sessionStorage.getItem('codepy'),
  extensions: [basicSetup, pythonLanguage,oneDark,EditorView.lineWrapping,keymap.of([indentWithTab])],
  parent: document.querySelector('.codeArea'),
})
let flowchartButton=document.querySelector('[data-runflow]')
flowchartButton.addEventListener("click",function(){
  let codeForm=document.querySelector('[data-flow]')
  let code=codeForm.querySelector('textarea[name="code"]')
  code.innerHTML=getCurrentCode()
  codeForm.submit()
})
let pseudoButton=document.querySelector('[data-runpseudo]')
pseudoButton.addEventListener('click',function(){
  let codeForm=document.querySelector('[data-pseudo]')
  let code=codeForm.querySelector('textarea[name="code"]')
  code.innerHTML=getCurrentCode()
  codeForm.submit()
})
function getCurrentCode(){
  return editor.state.doc.toString();
}
window.addEventListener('beforeunload',function(){
  sessionStorage.setItem('codepy',getCurrentCode())
})