import {Request, Response} from "express";
import ResponseHelper from "./ResponseHelper/ResponseHelper";
import UserService from "../service/helper/UserService";
import LoginRequest from "../model/request/LoginRequest";
import { Admin, Doctor, Pharmacist } from "@prisma/client";

export default class UserController{
    private readonly userService: UserService
    private readonly responseHelper: ResponseHelper;

    constructor() {
        this.userService = new UserService();
        this.responseHelper = new ResponseHelper();
    }

    async getUserByEmail(req: Request, res: Response){
        try{
            const request: LoginRequest = req.body;
            const user: Admin | Doctor | Pharmacist | null = await this.userService.getUserByEmail(request.email)
            if (user && await this.userService.bcryptPassword(request.password, user.password)){ 
                try{
                    const token: string = this.userService.generateToken(user.email)
                    res.cookie("token", token, this.responseHelper.constructCookieRequest())
                    return res.status(200).send(this.responseHelper.constructLoginResponse(user, token));
                } catch (error) {
                    return res.status(400).send(this.responseHelper.constructBadRequest(error as object))
                }
            }
            throw new Error("Invalid username or password!")
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }
}