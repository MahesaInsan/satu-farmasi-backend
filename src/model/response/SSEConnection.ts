import {Response} from "express";

export default interface SSEConnection {
    id: string,
    res: Response
}