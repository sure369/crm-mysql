import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios';


function Preview() {

    const[fileData,setFileData]=useState(null);
    const urlimage =`${process.env.REACT_APP_SERVER_URL}/images`
    const[img,setImg]=useState()
useEffect(()=>{
  fetchRecords()
    console.log('inside prview component')
   

    // axios(`${process.env.REACT_APP_SERVER_URL}/preview-file?searchId=63bcfcae2ed8f352d497fe31 `, {
    //     method: "POST",
    //     responseType: "blob"
    //     //Force to receive data in a Blob Format
    //   })
    //     .then(response => {
    //       //Create a Blob from the PDF Stream
    //       console.log('response',response);
    //       const file = new Blob([response.data], {
    //         type: "application/pdf"
    //       });
    //       //Build a URL from the file
    //       const fileURL = URL.createObjectURL(file);
    //       //Open the URL on new Window
    //       window.open(fileURL);
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });

    // fetch(`${process.env.REACT_APP_SERVER_URL}/preview-file?searchId=63bcfcae2ed8f352d497fe31`,{
    //     method: 'POST'
    //   })
    // .then(response => response.arrayBuffer())
    // .then(buffer => {
    //   // Convert the file buffer to a data URL
    //   const fileReader = new FileReader();
    //   fileReader.onloadend = () => {
    //     setFileData( fileReader.result);
    //   };
    //   fileReader.readAsDataURL(new Blob([buffer]));
    // });
})

const fetchRecords = () => {
  axios.post(urlimage)
    .then(
      (res) => {
        console.log("fetch res data", res);
        setImg(res.data)
        
      }
    )
    .catch((error) => {
      console.log('res error', error);
    })
}

  return (
    <div>
      {/* <iframe src='https://view.officeapps.live.com/op/embed.aspx?src=http://writing.engr.psu.edu/workbooks/formal_report_template.doc' width='80%' height='800px' frameborder='0'></iframe> */}
      <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${img}&embedded=true`} width='100%' height='800px' frameborder='0'></iframe>
 <iframe src='https://view.officeapps.live.com/op/embed.aspx?src=http%3A%2F%2Fieee802%2Eorg%3A80%2Fsecmail%2FdocIZSEwEqHFr%2Edoc' width='80%' height='800px' frameborder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.</iframe>
{/* uploads\\2022-12-30T09-11-59.094Z-datcrmcsv.csv */}
        {/* <iframe src='https://view.officeapps.live.com/op/embed.aspx?src=http://remote.url.tld/path/to/document.doc' width='1366px' height='623px' frameborder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.</iframe> */}

     
    </div>
  )
}

export default Preview


