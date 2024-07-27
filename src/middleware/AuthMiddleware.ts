import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";
import BaseMiddleware from "./BaseMiddleware/BaseMiddleware";
import { JwtPayload } from "jsonwebtoken";

export default class AuthMiddleware extends BaseMiddleware {
    constructor() {
        super();
    }

    public authenticateToken( req: BaseRequest, res: Response, next: NextFunction) {
        const authHeader = req.headers["authorization"] as string | undefined;
        const token: string | undefined = authHeader && authHeader.split(" ")[1]; if (!token)
            return res .status(403) .send( this.responseHelper.constructUnAuthorizedRequest(
                    new Error("Token is not found!")
                ));

        const secretToken = process.env["SECRET_TOKEN"];
        if (!secretToken)
            return this.responseHelper.constructInternalServerError(
                new Error("Secret token not found!")
            );

        try{
            const decoded = jwt.verify(token, secretToken as string);
            req.user = decoded;
            next();
        } catch (err) {
            res.status(400).send('Invalid Token.');
        }
    }

    public hasPermission(req: BaseRequest, res: Response, next: NextFunction, role: string) {
        console.log("req.user", req.user);
        if ((req.user as JwtPayload)?.role !== role) 
            return res .status(403) .send(this.responseHelper.constructUnAuthorizedRequest(
                new Error("Access Denied. Insufficient Permissions."
            )));
        next();
    }
}
