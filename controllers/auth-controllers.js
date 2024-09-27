import {ctrlWrapper} from "../decorators/index.js";
import {signIn, signUp} from "./auth/index.js"
export default {
    signIn: ctrlWrapper(signIn),
    signUp: ctrlWrapper(signUp),
};
