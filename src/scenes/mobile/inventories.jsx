import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";

const urlInventory = `${process.env.REACT_APP_SERVER_URL}/inventories`;


export const InventoryMobile = (props) => {

  const [property, setProperty] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);

  const [filteredProperty, setFilteredProperty] = useState([{}]);
  const [propertyNameSrc, setPropertyNameSrc] = useState('');
  const [propertyStatusSrc,setPropertyStatusSrc]=useState('');
  const [propertyTypeSrc,setPropertyTypeSrc] = useState();

  const navigate = useNavigate();

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = () => {
        axios.post(urlInventory)
          .then(
            (res) => {
                console.log("res Inventory records", res);
                setProperty(res.data);
                setFilteredProperty(res.data);
                setNoOfPages(Math.ceil(res.data.length / itemsPerPage));
                setLoading(false);
            }
          )
          .catch((error) => {
            console.log('res Inventory error', error);
          })
      }

    //nav to rec detail page 

  const handleGoToDetails = (item) => {
    console.log("cardId", item);
    // localStorage.setItem("selectedCard", cardId);
    // navigate("/detailpage",{state:{name:item}});
    
    navigate("/inventoryDetailPage", {state:{record: {item}}})
   
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  function handleSearch() {

    // if(property!== undefined){
      const newData = 
                    property
                    .filter(i => i.propertyName.includes(propertyNameSrc))
                    .filter(j => j.status  == (propertyStatusSrc == "" ? j.Status__c  : propertyStatusSrc))
                    .filter(k => k.type.includes(propertyTypeSrc))
                    setFilteredProperty(newData);
                    setNoOfPages(Math.ceil(newData.length / itemsPerPage));
    // }  
  
  }

  function handleReset() {
    console.log("res", property);
    setFilteredProperty(property);
    setPropertyNameSrc('');
    setPropertyStatusSrc('');
    setPropertyTypeSrc('')
    setNoOfPages(Math.ceil(property.length / itemsPerPage));
    // window.location.reload(false)
  }

  if (loading) {
    return (
      <>
        <div>Loading.....</div>
      </>
    );
  }

  if (property !== undefined) {
    return (
      <>
          <div>
            <div>
              <input placeholder="Search Property" value={propertyNameSrc} 
                     onChange={(e) => setPropertyNameSrc(e.target.value)}
              />
              <select className="form-control" value={propertyStatusSrc}
                      onChange={(e) => setPropertyStatusSrc(e.target.value)}
              >
                <option value="">-Search by Status-</option>
                <option value="ON HOLD">ON HOLD</option>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Booked">Booked</option>
                <option value="Processed">Processed</option>
                <option value="Registered at DLD">Registered at DLD</option>
                <option value="Commission Paid to Sotheby's">Commission Paid to Sotheby's</option>
                <option value="Commission Paid to third party brokerage">Commission Paid to third party brokerage</option>
              </select>
              <select className="form-control" value={propertyTypeSrc}
                      onChange={(e) => setPropertyTypeSrc(e.target.value)}
              >
                <option value="">-Search by Type-</option>
                <option value="Apartment">Apartment</option>
                <option value="Commercial Space">Commercial Space</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Duplex">Duplex</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            <div>
              <Button type="submit" onClick={handleSearch}>Search</Button>
              <Button type="reset" onClick={handleReset}>Clear</Button>
            </div>
        </div>

        <div>
          <Card dense compoent="span" sx={{ bgcolor: "white" }}>
            {
            filteredProperty && filteredProperty.length>0?
            filteredProperty
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((item) => {
                return (
                  <div>
                    <CardContent sx={{ bgcolor: "aliceblue", m: "20px" }}>
                      <div
                        key={item.Id}
                        button
                        onClick={() => handleGoToDetails(item)}
                      >
                        {/* //()=>setRecordDetailId(item.Id) */}
                        <h1>{item.propertyName} </h1>
                        <div>Project Name : {item.projectName} </div>
                        <div>City :{item.city} </div>
                        <div>Type : {item.type} </div>
                        <div>Status : {item.status} </div>
                        
                      </div>
                    </CardContent>
                  </div>
                );
              })
            :"No Data"
            }
          </Card>

          <Box component="span">
            <Pagination
              count={noOfPages}
              page={page}
              onChange={handleChangePage}
              defaultPage={1}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        </div>
      </>
    );
  }
};
