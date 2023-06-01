import apiFile from "./apiFile";

export const RequestServerFiles = (method,endpoint, payload) => {
        return apiFile[method](endpoint, payload)
        .then((res) => {
            console.log("inside HttpReqFiles res ", res);
            if (res.status === 200) {
                console.log("status success ", res.data);
                return {
                    success: true,
                    data: res.data,
                };
            } else {
                console.log("error-status success ");
                return {
                    success: false,
                    error: {
                        status: res.status,
                        message: res.data.message,
                    },
                };
            }
        })
        .catch((error) => {
            console.log("inside HttpReq error", error);
            return {
                success: false,
                error: {
                    status: error.response ? error.response.status : "Error",
                    message: error.response
                        ? error.response.data.message
                        : "Network Error",
                },
            };
        });
    
};
