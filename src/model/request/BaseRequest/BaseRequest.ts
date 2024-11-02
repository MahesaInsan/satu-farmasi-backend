import { JwtPayload } from "jsonwebtoken";
import { Request } from 'express';

export default interface BaseRequest extends Request{
    user?: string | JwtPayload;
    role: string;
}
