import axios from "axios";

export const getVendorPerformance = () => {
  return axios.get("http://localhost:8080/api/vendors/performance");
};
