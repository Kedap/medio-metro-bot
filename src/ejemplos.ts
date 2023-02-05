const GRAMATICA = `Corrija esto al español:

Ella no comer papas.`;

const RESUMEN = `Resuma esto para un estudiante de segundo grado:

Júpiter es el quinto planeta desde el Sol y el más grande del Sistema Solar. Es
un gigante gaseoso con una masa de una milésima parte de la del Sol, pero dos
veces y media la de todos los demás planetas del Sistema Solar juntos. Júpiter
es uno de los objetos más brillantes visibles a simple vista en el cielo
nocturno, y las civilizaciones antiguas lo conocen desde antes de la historia
registrada. Lleva el nombre del dios romano Júpiter.[19] Cuando se ve desde la
Tierra, Júpiter puede ser lo suficientemente brillante como para que su luz
reflejada proyecte sombras visibles, [20] y es, en promedio, el tercer objeto
natural más brillante en el cielo nocturno después de la Luna y Venus.`;

const PREGUNTA = `Soy un bot de respuesta a preguntas muy inteligente.
Si me haces una pregunta que tiene sus raíces en la verdad, te daré la
respuesta. Si me hace una pregunta que es una tontería, un engaño o que no
tiene una respuesta clara, le responderé con "Desconocido".

P: ¿Cuál es la esperanza de vida humana en los Estados Unidos?
R: La expectativa de vida humana en los Estados Unidos es de 78 años.

P: ¿Quién fue presidente de los Estados Unidos en 1955?
R: Dwight D. Eisenhower fue presidente de los Estados Unidos en 1955.

P: ¿A qué partido pertenecía?
R: Pertenecía al Partido Republicano.

P: ¿Cuál es la raíz cuadrada del plátano?
R: Desconocido

P: ¿Cómo funciona un telescopio?
R: Los telescopios usan lentes o espejos para enfocar la luz y hacer que los objetos parezcan más cercanos.

P: ¿Dónde se celebraron los Juegos Olímpicos de 1992?
R: Los Juegos Olímpicos de 1992 se celebraron en Barcelona, España.

P: ¿Cuántos garrapatos hay en un bonk?
R: Desconocido

P:`;

const TRADUCCION = `Traduce esto a 1. Francés, 2. Español y 3. Japonés:

¿Qué habitaciones tienes disponibles?

1.`;

const PYTHON = `
"""
1. Crea una lista de nombres
2. Crea una lista de apellidos
3. Combínalos al azar en una lista de 100 nombres completos
"""
`;

const EXPLICAR = `class Log:
    def __init__(self, path):
        dirname = os.path.dirname(path)
        os.makedirs(dirname, exist_ok=True)
        f = open(path, "a+")

        # Check that the file is newline-terminated
        size = os.path.getsize(path)
        if size > 0:
            f.seek(size - 1)
            end = f.read(1)
            if end != "\n":
                f.write("\n")
        self.f = f
        self.path = path

    def log(self, event):
        event["_event_id"] = str(uuid.uuid4())
        json.dump(event, self.f)
        self.f.write("\n")

    def state(self):
        state = {"complete": set(), "last": None}
        for line in open(self.path):
            event = json.loads(line)
            if event["type"] == "submit" and event["success"]:
                state["complete"].add(event["id"])
                state["last"] = event
        return state

"""
Explica que esta haciendo la anterior clase:
1.`;

const ASISTENTE =
  `La siguiente es una conversación con un asistente de IA. El asistente es útil, creativo, inteligente y muy amable.

Humano: hola, quien eres?
AI: Soy una IA creada por alguien. ¿Cómo puedo ayudarte hoy?
Humano:`;

const AYUDA =
  `Tu opcion no es correcta, aqui esta la lista de las opciones correctas:

- gramatica
- resumen
- pregunta
- traduccion
- explicar
- python
- asistente`;

export const EJEMPLOS: Record<string, string> = {
  gramatica: GRAMATICA,
  resumen: RESUMEN,
  pregunta: PREGUNTA,
  traduccion: TRADUCCION,
  python: PYTHON,
  asistente: ASISTENTE,
  ayuda: AYUDA,
  explicar: EXPLICAR,
};
