console.log(process.env);
export const baseurl =
  process.env.BUILD_ENV === 'production'
    ? 'http://business.api.tssword.xin'
    : 'http://localhost:4000';
// export const baseurl = 'http://business.api.tssword.xin';
export const uploadFileUrl = `${baseurl}/upload/uploadActivityFile`;
export const uploadCustomersUrl = `${baseurl}/upload/uploadCustomers`;
