export const userDetails =() =>{

    const userDetails = sessionStorage.getItem("loggedInUser")
    return userDetails;
}