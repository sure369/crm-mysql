import React from "react";
import {Select} from "@mui/material";
import "./FormStyles.css"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const  CustomizedRichTextField = ({ children, form, field,...props }) => {

     console.log('form',form);
     console.log('field',field);
     console.log('props',props)
    

  const { name, value } = field;
  const { setFieldValue } = form;
  const changeFunc = (e)=>{
    // console.log(props.onChange(e));
    if(props.onChange){
      props.onChange(e);
    }
    setFieldValue(name,e)
    
  }
 

  return (
  <div >
                                           <CKEditor
                            editor={ ClassicEditor }
                             data="<p></p>"
                            config={{
                                placeholder: "Enter The Email Body..." ,
                                removePlugins: ["EasyImage","ImageUpload","MediaEmbed"]
                                // removePlugins: ['Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed']
                            }} 
                            onReady ={(editor) => {
                                // You can store the "editor" and use when it is needed.
                                // console.log("Editor is ready to use!", editor);
                                console.log( 'Editor is ready to use!', editor );
                                editor.editing.view.change((writer) => {
                                writer.setStyle(
                                    "height",
                                    "100px",
                                    editor.editing.view.document.getRoot()
                                );
                                });
                            }}
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();

                                console.log('onchange data',data);
                                // setFieldValue('htmlBody',data)
                                changeFunc(data)
                                
                            } }
                            onBlur={ ( event, editor ) => {
                                console.log( 'Blur.', editor );
                            } }
                            onFocus={ ( event, editor ) => {
                                console.log( 'Focus.', editor );
                            } }
                           
                        />
  </div>
  );
};
export default CustomizedRichTextField