import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import routes from "./app/routes";
import { globalErrorhandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";


const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors())

app.use(routes)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to delivery Backend"
    })
})


app.use(globalErrorhandler)
app.use(notFound)


export default app