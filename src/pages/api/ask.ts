
import { type APIRoute } from "astro";
import { readFile } from 'node:fs/promises';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config({path: './src/.env'});

let genAI: GoogleGenerativeAI;

const api_key = process.env.API_GEMINI;
if (!api_key) {
    console.error('La clave de API no está definida en el archivo .env');
  } else {
    const genAI = new GoogleGenerativeAI(api_key);
  }

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const question = url.searchParams.get('question');

    if (!id) {
        return new Response("No se encontro la ID", { status: 400 });
    }

    if (!question) {
        return new Response("No se encontro la pregunta", { status: 400 });
    }

    try {
        const txt = await readFile(`public/text/${id}.txt`, 'utf-8');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: txt + "(Esto ya no es parte del documento, quiero que respondas en base al texto enviado, no respondas fuera de eso. No uses ** para resaltar texto." }],
                },
                {
                    role: "model",
                    parts: [{ text: "Bien. ¿Que pregunta quieres hacer?" }],
                },
            ],
            generationConfig: {
                maxOutputTokens: 800,
            },
        });

        const result = await chat.sendMessage(question);
        const response = await result.response;
        const respuesta = await response.text();

        console.log("Respuesta de la IA:", respuesta);

        return new Response(respuesta, { status: 200 });
    } catch (error) {
        return new Response("Error al procesar la solicitud.", { status: 500 });
    }
};
