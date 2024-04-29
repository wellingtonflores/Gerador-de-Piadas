import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.post("/request", async (req, res) => {
    try {
        const { language, flags, category, categories } = req.body;

        // Verifica se 'categories' é um array, se não for, converte para um array com um único elemento
        const selectedCategories = Array.isArray(categories) ? categories : [categories];

        // Constrói a URL da API com base na categoria selecionada
        let apiUrl = `https://v2.jokeapi.dev/joke/${category === "Any" ? "Any" : selectedCategories.join()}?lang=${language}`;

        // Se 'flags' existir, adiciona à URL da API
        if (flags) {
            apiUrl += `&blacklistFlags=${flags}`;
        }

        // Faz a requisição para a API de piadas
        const result = await axios.get(apiUrl);

        // Renderiza o resultado na página
        res.render("index.ejs", { setup: result.data.setup, delivery: result.data.delivery, type: result.data.type, joke: result.data.joke, error: result.data.error, message: result.data.message, causedBy: result.data.causedBy });
        console.log(result.data);
    } catch (error) {
        // Se ocorrer um erro, registra o erro no console e envia uma resposta de erro ao cliente
        console.error("Error processing request:", error);
        res.status(500);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

