import React, { useState } from 'react'

const  PreviewFile =({file}) => {


    const[preview,setPreview] =useState();

    const reader =new FileReader();
    reader.readAsDataURL(file)
    reader.onload =()=>{
        setPreview(reader.result);
    }


  return (
    <div>
        <img src={preview} alt="preview" height="200px" width ="200px"  />
    </div>
  )
}

export default PreviewFile