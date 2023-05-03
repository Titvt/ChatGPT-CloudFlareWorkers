# ChatGPT-CloudFlareWorkers

**Enjoy ChatGPT on CloudFlare Workers!**

## Deploy

Before deploying your workers, you should add environment variable `API_KEY` and fill it as your OpenAI API KEY.

## Usage

### Chat

The request router is `/chat`, and the request method is `POST`.

You can specify some request parameters through headers:
- temperature

You can either specify a plain text or a JSON text in the request body.

If you specify a plain text, it will be automatically converted to a simple chat message.

If you specify a JSON text, it will be parsed as a chat message.

[View the description of the chat message](https://platform.openai.com/docs/api-reference/chat)

### Images

The request router is `/images`, and the request method is `POST`.

You can specify some request parameters through headers:
- n
- size
- response_format

Specify the prompt in the request body.
