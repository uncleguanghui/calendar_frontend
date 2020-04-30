/* jshint esversion: 6 */
import axios from "axios";
import { Notification } from "ant-design-vue";

function request(options, callback = function() {}) {
  return axios(options)
    .then(res => {
      callback();
      return res;
    })
    .catch(error => {
      Notification.error({
        message: error.response.status,
        description: error.response.statusText
      });
      return Promise.reject(error);
    });
}

export default request;
