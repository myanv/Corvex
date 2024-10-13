import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { prompt, localAPIKey } = req.body;
    const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localAPIKey}`,
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 200,
        }),
    });

    const data = await response.json();
    res.status(200).json(data);
}