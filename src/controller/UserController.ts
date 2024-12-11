import { Request, Response } from "express";
import ResponseHelper from "./ResponseHelper/ResponseHelper";
import UserService from "../service/UserService";
import LoginRequest from "../model/request/LoginRequest";
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import BaseResponse from "../model/response/BaseResponse";
import { CustomError } from "../validator/helper/ErrorHelper";
import { User } from "@prisma/client";
import { decode } from "punycode";

export default class UserController {
    private readonly userService: UserService;
    private readonly responseHelper: ResponseHelper;

    constructor() {
        this.userService = new UserService();
        this.responseHelper = new ResponseHelper();
    }

    async getUserByEmail(req: Request, res: Response) {
        try {
            const request: LoginRequest = req.body;
            const user: User | null =
                await this.userService.getUserByEmail(request.email);
            console.log("user: ", user);
            if ( user && (await this.userService.bcryptPassword( request.password, user.password))) {
                try {
                    const token: string = this.userService.generateToken( user.email, user.role, request.isRemember);
                    request.isRemember 
                        ? res.cookie( "token", token, this.responseHelper.constructCookieRequest(1000 * 60 * 60 * 24 * 30)) // 30 days
                        : res.cookie( "token", token, this.responseHelper.constructCookieRequest(1000 * 60 * 60 * 24 * 7)) // 7 days 
                    return res.status(200).send(new BaseResponse().ok(this.responseHelper.constructLoginResponse( user, token)));
                } catch (error) {
                    return res .status(400).send(this.responseHelper.constructBadRequest(error as object));
                }
            }
			throw new CustomError().formatError("Email atau password tidak valid!", "custom");
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async checkToken (req: Request, res: Response) {
        const { token } = req.body;
        try {
            if (!token) throw new Error("Token not found");
            const decoded = jwt.verify(token, process.env["SECRET_TOKEN"] as string);
            // req.body.email = (decoded as any).email;
            return res.status(200).send({ role: (decoded as JwtPayload).role });
        } catch (error) {
            console.log("error check token: ", error);
            return res.status(401).send(this.responseHelper.constructUnAuthorizedRequest(error as object));
        }
    }

    async deleteUser(req: Request, res: Response){
        res.cookie('token', '', { expires: new Date(0), httpOnly: true });
        res.status(200).send(this.responseHelper.constructDeleteUserResponse())
    }
}
