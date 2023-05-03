export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Invalid Method', { status: 404 })
    }

    switch (new URL(request.url).pathname) {
      case '/chat':
        return this.chat(request, env)
      case '/images':
        return this.images(request, env)
      default:
        return new Response('Invalid Router', { status: 404 })
    }
  },

  async chat(request, env) {
    let text = await request.text()
    let messages

    try {
      messages = JSON.parse(text)
    } catch {
      messages = [{ role: 'user', content: text }]
    }

    let temperature = parseFloat(request.headers.get('temperature'))

    if (isNaN(temperature)) {
      temperature = 1
    }

    let url = 'https://api.openai.com/v1/chat/completions'
    let options = {
      method: 'POST',
      headers: [
        ['Content-Type', 'application/json'],
        ['Authorization', `Bearer ${env.API_KEY}`],
      ],
      body: JSON.stringify(
        {
          model: 'gpt-3.5-turbo',
          messages: messages,
          temperature: temperature,
        },
      ),
    }
    let response = await fetch(new Request(url, options))
    let data = JSON.parse(await response.text())

    if (!data.choices) {
      return new Response(data.error.message, { status: 400 })
    }

    return new Response(data.choices[0].message.content.trim())
  },

  async images(request, env) {
    let prompt = await request.text()
    let n = parseInt(request.headers.get('n'))

    if (isNaN(n)) {
      n = 1
    }

    let size = request.headers.get('size') ?? '1024x1024'
    let response_format = request.headers.get('response_format') ?? 'url'
    let url = 'https://api.openai.com/v1/images/generations'
    let options = {
      method: 'POST',
      headers: [
        ['Content-Type', 'application/json'],
        ['Authorization', `Bearer ${env.API_KEY}`],
      ],
      body: JSON.stringify(
        {
          prompt: prompt,
          n: n,
          size: size,
          response_format: response_format,
        },
      ),
    }
    let response = await fetch(new Request(url, options))
    let data = JSON.parse(await response.text())

    if (!data.data) {
      return new Response(data.error.message, { status: 400 })
    }

    return new Response(JSON.stringify(data.data))
  },
}
