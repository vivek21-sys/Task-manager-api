const dotenv = require("dotenv")
dotenv.config()
const exp = require("express")
const app = exp()

app.use(exp.json())
const cors = require("cors")
app.use(cors())


const userRouter = require("./routes/user.routes");
app.use("/user", userRouter);

app.listen(process.env.APP_PORT);