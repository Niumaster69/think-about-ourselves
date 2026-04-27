/* =========================================================
   data.js — Contenido editable de Think About Ourselves
   ---------------------------------------------------------
   Cómo editar tus oraciones (cualquier estudiante puede):
     1. Encuentra el bloque con tu "id" (carlos, anamaria, duvan, henry).
     2. Reemplaza los textos "[Sentence X]" por tu oración real.
     3. Guarda el archivo y recarga el navegador.
   No cambies los nombres de los capítulos ni los ids.
   ========================================================= */

const STUDENTS = [
  {
    id: "carlos",
    name: "Carlos Mario del Valle",
    chapters: {
      past: [
        "I had a ball.",
        "I didn't have a favorite school.",
        "I had a dog.",
        "I went to Cartagena.",
        "I lived in Cesar."
      ],
      achieved: [
        "I have traveled.",
        "I haven't learned much English.",
        "I have won an obstacle race.",
        "I have made some friends.",
        "I have crashed the work server."
      ],
      thismonth: [
        "I've been studying.",
        "I've been exercising.",
        "I've been cooking spaghetti.",
        "I've been reading 'I Have No Mouth and I Must Scream.'",
        "I've been working as a programmer."
      ],
      future: [
        "I'll work at Rockstar Games.",
        "I'll live in Spain.",
        "I'll have children.",
        "I won't travel often.",
        "I won't be happy."
      ]
    }
  },
  {
    id: "anamaria",
    name: "Anamaría",
    chapters: {
      past: [
        "[Sentence 1]",
        "[Sentence 2]",
        "[Sentence 3]",
        "[Sentence 4]",
        "[Sentence 5]"
      ],
      achieved: [
        "[Sentence 1]",
        "[Sentence 2]",
        "[Sentence 3]",
        "[Sentence 4]",
        "[Sentence 5]"
      ],
      thismonth: [
        "[Sentence 1]",
        "[Sentence 2]",
        "[Sentence 3]",
        "[Sentence 4]",
        "[Sentence 5]"
      ],
      future: [
        "[Sentence 1]",
        "[Sentence 2]",
        "[Sentence 3]",
        "[Sentence 4]",
        "[Sentence 5]"
      ]
    }
  },
  {
    id: "duvan",
    name: "Duvan",
    chapters: {
      past: [
        "[Sentence 1]",
        "[Sentence 2]",
        "[Sentence 3]",
        "[Sentence 4]",
        "[Sentence 5]"
      ],
      achieved: [
        "[Sentence 1]",
        "[Sentence 2]",
        "[Sentence 3]",
        "[Sentence 4]",
        "[Sentence 5]"
      ],
      thismonth: [
        "[Sentence 1]",
        "[Sentence 2]",
        "[Sentence 3]",
        "[Sentence 4]",
        "[Sentence 5]"
      ],
      future: [
        "[Sentence 1]",
        "[Sentence 2]",
        "[Sentence 3]",
        "[Sentence 4]",
        "[Sentence 5]"
      ]
    }
  },
  {
    id: "henry",
    name: "Henry",
    chapters: {
      past: [
        "[Sentence 1]",
        "[Sentence 2]",
        "[Sentence 3]",
        "[Sentence 4]",
        "[Sentence 5]"
      ],
      achieved: [
        "[Sentence 1]",
        "[Sentence 2]",
        "[Sentence 3]",
        "[Sentence 4]",
        "[Sentence 5]"
      ],
      thismonth: [
        "[Sentence 1]",
        "[Sentence 2]",
        "[Sentence 3]",
        "[Sentence 4]",
        "[Sentence 5]"
      ],
      future: [
        "[Sentence 1]",
        "[Sentence 2]",
        "[Sentence 3]",
        "[Sentence 4]",
        "[Sentence 5]"
      ]
    }
  }
];

const CHAPTERS = [
  { id: "past",      number: 1, title: "Our Past",                subtitle: "Memories that built us." },
  { id: "achieved",  number: 2, title: "What We Have Achieved",   subtitle: "Things we've done. Things we haven't." },
  { id: "thismonth", number: 3, title: "This Month",              subtitle: "What our days look like now." },
  { id: "future",    number: 4, title: "In 15 Years",             subtitle: "Who we'll be." }
];
