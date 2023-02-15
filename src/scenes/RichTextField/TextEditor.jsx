import React,{useState,useRef,useCallback } from 'react'
import {Editor, EditorState,RichUtils} from 'draft-js';

function TextEditor() {

  

     const editor = useRef(null)

    // const [editorState, setEditorState] = useState(
    //     () => EditorState.createEmpty(),
    //   );
    
      const focusEditor = () => {
        editor.current.focus()
    }

    const [editorState, setEditorState] = useState(EditorState.createEmpty())

    const handleKeyCommand = useCallback((command, editorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command)
      if (newState) {
        setEditorState(newState)
  
        return "handled"
      }
      return "not-handled"
    })
  
    const _onBoldClick = useCallback(() => {
      setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"))
    })

      return (
        <div className="App">
          <header className="App-header">
            Rich Text Editor Example
          </header>
          <div onClick={() => focusEditor()}>
          <Editor 
                editorState={editorState}
                handleKeyCommand={handleKeyCommand} 
                onChange={setEditorState}
            />

                </div>
        
        </div>
      )
}

export default TextEditor


