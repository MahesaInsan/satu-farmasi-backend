import { NextFunction, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";
import BaseMiddleware from "./BaseMiddleware/BaseMiddleware";
import { JwtPayload } from "jsonwebtoken";

export default class AuthMiddleware extends BaseMiddleware {
    constructor() {
        super();
    }

    public authenticateToken( req: BaseRequest, res: Response, next: NextFunction) {
        let authHeader = req.headers["authorization"] as string | undefined;
        let token: string | undefined = undefined;

        if (authHeader === undefined) {
            authHeader = req.cookies ? req.cookies["token"] : undefined;
            token = authHeader; 
        } else {
            token = authHeader && authHeader.split(" ")[1]; 
        }

        if (!token) {
            console.log("Token is not found!");
            return res .status(403) .send( this.responseHelper.constructUnAuthorizedRequest(
                    new Error("Token is not found!")
                ));
            }

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
            if (err instanceof TokenExpiredError) {
                console.log("expired token time: ", err.expiredAt);
                return res.status(401).send({
                    message: "Token has expired",
                    expiredAt: err.expiredAt, 
                });
            }
            console.error("error when authenticate token", err);
        }
    }

    public hasPermission(req: BaseRequest, res: Response, next: NextFunction, role: string) {
        console.log("req.user", req.user);
        console.log("role", role);
        console.log((req.user as JwtPayload)?.role !== role);
        if ((req.user as JwtPayload)?.role !== role) 
            return res .status(403) .send(this.responseHelper.constructUnAuthorizedRequest(
                new Error("Access Denied. Insufficient Permissions."
            )));
        next();
    }
}
