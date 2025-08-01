import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import routes from "./app/routes";
import { globalErrorhandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { envVars } from "./app/config/env";


const app = express()

app.use(cookieParser())
app.use(express.json())
/* app.set("trust proxy", 1)
app.use(express.urlencoded({ extended: true })) */
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))

app.use(routes)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to delivery Backend"
    })
})


app.use(globalErrorhandler)
app.use(notFound)


export default app