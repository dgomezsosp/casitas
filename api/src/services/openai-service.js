const OpenAI = require('openai')

module.exports = class OpenAIService {
  constructor () {
    this.openai = new OpenAI({
      // Clave api del asistente
      apiKey: process.env.OPENAI_API_KEY
    })
    this.assistantEndpoint = null // Endpoint del asistente
    this.threadId = null // ID del hilo que se crea.
    this.messages = null
    this.answer = null
  }

  // Te devuelve los 20 primeros asistentes que has creado
  async getAssistants () {
    const myAssistants = await this.openai.beta.assistants.list({
      order: 'desc',
      limit: '20'
    })

    return myAssistants.data
  }

  // Setter. Función para dar valor a una variable
  async setAssistant (assistantEndpoint) {
    this.assistantEndpoint = assistantEndpoint
  }

  // Crear una conversación nueva. Devuelve la id de la conversación que se ha creado.
  async createThread () {
    try {
      const thread = await this.openai.beta.threads.create()
      this.threadId = thread.id
    } catch (error) {
      console.log(error)
    }
  }

  // Asignar ID del hilo.
  setThread (theadId) {
    this.threadId = theadId
  }

  async createMessage (prompt) {
    try {
      // Se crea el mensaje de la conversación.
      await this.openai.beta.threads.messages.create(
        this.threadId,
        {
          role: 'user',
          content: prompt
        }
      )
      // Se lanza la run
      // Cuando se envía un mensaje se genera un run por cada asistente e hilo. Como tarda en contestar, cada 2 segundos consulta el run, que pueden ser 4 estado (queued, completed, in_progress, se dispara una function)
      // Si está queued / in_progess consulto run cada 2 seg.
      // Si se ejecuta una función, le doy la resupuesta de esa función y openai da la respuesta que debe dar a esa función.

      // Crear conversación/asistente, crear mensaje, consultar Rrun
      this.run = await this.openai.beta.threads.runs.createAndPoll(
        this.threadId,
        {
          assistant_id: this.assistantEndpoint
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  async runStatus () {
    try {
      console.log(this.run.status)

      // Tomar el útlimo mensaje de la conversación.
      if (this.run.status === 'completed') {
        // Toma todos los mensajes de la conversación.
        const messages = await this.openai.beta.threads.messages.list(this.run.thread_id)
        this.messages = messages.data
        // Coge el último mensaje.
        this.answer = this.messages[0].content[0].text.value
        return
      }

      if (
        this.run.required_action &&
        this.run.required_action.submit_tool_outputs &&
        this.run.required_action.submit_tool_outputs.tool_calls
      ) {
        this.tools = this.run.required_action.submit_tool_outputs.tool_calls
        return
      }

      // Si aun no está completo, se llama a sí mismo.
      if (this.run.status === 'queued' || this.run.status === 'in_progress') {
        await this.sleep(2000)

        this.run = await this.openai.beta.threads.runs.retrieve(
          this.run.id,
          {
            thread_id: this.threadId
          }
        )

        await this.runStatus()
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Se le da la respuesta de la función a OpenAI, OpenAI se ponen a generar nueva respuesta y vuelve a consultar el run.
  async submitToolOutputs (toolOutputs) {
    try {
      this.run = await this.openai.beta.threads.runs.submitToolOutputs(
        this.run.id,
        {
          thread_id: this.threadId,
          tool_outputs: toolOutputs
        }
      )

      await this.runStatus()
    } catch (error) {
      console.log(error)
    }
  }

  sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
