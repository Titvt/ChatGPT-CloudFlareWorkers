const API_KEY = ''

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return new Response('Only POST method is supported.')
    }

    let prompt = await request.text()

    if (prompt.length === 0 || prompt.length > 2048) {
      return new Response('The length of the payload should be in (0,2048].')
    }

    let url = 'https://api.openai.com/v1/completions'
    let options = {
      method: 'POST',
      headers: [
        [
          'Content-Type',
          'application/json',
        ],
        [
          'Authorization',
          'Bearer ' + API_KEY,
        ],
      ],
      body: JSON.stringify(
        {
          model: 'text-davinci-003',
          prompt: prompt,
          max_tokens: 2048,
        },
      ),
    }
    let response = await fetch(new Request(url, options))
    let data = JSON.parse(await response.text())

    if (!data.choices) {
      return new Response('An error is occurred during the request.')
    }

    return new Response(data.choices[0].text.trim())
  }
}
