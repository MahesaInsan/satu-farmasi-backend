import {NextFunction, Request, Response} from "express";
import jwt from 'jsonwebtoken';
import ResponseHelper from "../controller/ResponseHelper/ResponseHelper";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";
import BaseMiddleware from "./BaseMiddleware/BaseMiddleware";

export default class AuthMiddleware extends BaseMiddleware{
    constructor() {
        super();
    }

    public authenticateToken(req: BaseRequest, res: Response, next: NextFunction) {
        const authHeader: string | undefined | null = req.headers.get('authorization')
        const token: string | undefined | null = authHeader && authHeader.split(' ')[1]
        if (!token) return this.responseHelper.constructUnAuthorizedRequest(new Error("You have no access to this page!"))

        const secretToken = process.env["SECREET_TOKEN"];
        if (!secretToken) return this.responseHelper.constructInternalServerError(new Error("Secret token not found!"))

        jwt.verify(token, secretToken as string, (err, user) => {
            if (err) return res.sendStatus(403)
            req.user = user
            next()
        })
    }
}