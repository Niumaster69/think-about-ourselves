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
        "I played video games a lot when I was a child.",
        "I played soccer when I was younger.",
        "I traveled with my school soccer team.",
        "I studied English in high school.",
        "I spent time with my family and friends."
      ],
      achieved: [
        "I have built my own home.",
        "I have started working on my second apartment project.",
        "I have achieved working from home as I always wanted.",
        "I have traveled to four countries, but I want to explore Colombia more.",
        "I haven't worked for a big company that pays in dollars yet."
      ],
      thismonth: [
        "I have been studying programming.",
        "I have been working on my projects.",
        "I have been practicing English.",
        "I have been learning new things about technology.",
        "I have been preparing my assignments."
      ],
      future: [
        "I will be a professional programmer.",
        "I will have financial independence and I won't need to work.",
        "I will own at least five apartments.",
        "I will start my project of living in front of the sea.",
        "I will help my family financially."
      ]
    }
  },
  {
    id: "anamaria",
    name: "Ana Maria Caceres",
    chapters: {
      past: [
        "I lived in Zipaquirá.",
        "I played with my friends.",
        "I loved computers and tech.",
        "I traveled with my parents.",
        "I studied in my school."
      ],
      achieved: [
        "I have traveled to Europe.",
        "I have studied five semesters.",
        "I have bought a motorcycle.",
        "I have worked very hard.",
        "I have learned to drive."
      ],
      thismonth: [
        "I have been studying engineering.",
        "I have been feeding Orion.",
        "I have been visiting family.",
        "I have been walking more.",
        "I have been speaking English."
      ],
      future: [
        "I will be an engineer.",
        "I will travel the world.",
        "I will buy a house.",
        "I will have more CARS.",
        "I will be very happy."
      ]
    }
  },
  {
    id: "duvan",
    name: "Duvan Lozano",
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
    id: "henry",
    name: "Henry Alejandro Ortega",
    chapters: {
      past: [
        "I played basketball with my friends.",
        "I studied in a public school.",
        "I enjoyed technology and computers.",
        "I traveled with my family on vacations.",
        "I spent time learning new skills."
      ],
      achieved: [
        "I have completed several small projects.",
        "I have developed new skills in programming.",
        "I have taken online courses about technology.",
        "I have improved my problem-solving abilities.",
        "I haven't achieved all my goals yet."
      ],
      thismonth: [
        "I have been working on different coding exercises.",
        "I have been improving my English every day.",
        "I have been exploring new technologies.",
        "I have been focusing on my personal growth.",
        "I have been practicing my programming skills constantly."
      ],
      future: [
        "I will be a successful programmer.",
        "I will have my own business.",
        "I will travel to different countries.",
        "I will buy a house.",
        "I will help my family."
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
