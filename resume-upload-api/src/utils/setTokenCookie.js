import { cookieOptions } from "./cookieOptions.js";

const setTokenCookie = (res, token) => {
    res.cookie("token", token, cookieOptions);
};

export default setTokenCookie;