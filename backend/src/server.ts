import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import bookRoutes from "./routes/bookRoutes";
import genreRoutes from "./routes/genreRoutes";

const app = express();
app.use(cors()); // libera o frontend (outra porta) a chamar a API
app.use(express.json()); // lê JSON no corpo das requisições

app.get("/", (req, res) => {
  res.json({ status: "API da Biblioteca no ar" });
});

app.use("/books", bookRoutes);
app.use("/genres", genreRoutes);

app.use(errorHandler);

// porta 3001 para não conflitar com o backend de tasks (3000)
app.listen(3001, () => console.log("API da Biblioteca em http://localhost:3001"));
