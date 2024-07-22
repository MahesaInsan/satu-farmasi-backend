import { JwtPayload } from "jsonwebtoken";

export default interface BaseRequest extends Request{
    user?: string | JwtPayload;
}