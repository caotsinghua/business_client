import * as productionConfig from './production';
import * as devConfig from './development';

const isprod = process.env.BUILD_ENV === 'production';
const config = isprod ? productionConfig : devConfig;

export const {baseurl} = config;
export const {uploadFileUrl} = config;
