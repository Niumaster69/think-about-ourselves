# Think About Ourselves

Una antología visual de cuatro voces — proyecto del curso de inglés (English Class 2026).

> Cuatro estudiantes. Cuatro capítulos. Una historia compartida sobre quiénes fuimos, qué hemos logrado, cómo vivimos hoy y quiénes seremos en quince años.

**Autores:** Carlos Mario del Valle · Anamaría · Duvan Lozano · Henry

---

## 1. Qué es esto

Una página web estática y cinematográfica que acompaña una presentación oral en clase.

Cada capítulo presenta a los cuatro estudiantes en el mismo orden, con dos zonas claramente separadas:

- **Zona A — Oraciones escritas:** las cinco oraciones del estudiante para ese capítulo, numeradas y en tipografía editorial.
- **Zona B — Galería visual:** cinco imágenes con efecto parallax que ilustran las oraciones.

Los cuatro capítulos:

1. **Our Past** — *Memories that built us.*
2. **What We Have Achieved** — *Things we've done. Things we haven't.*
3. **This Month** — *What our days look like now.*
4. **In 15 Years** — *Who we'll be.*

---

## 2. Cómo abrir el proyecto en local

No requiere instalación, ni compilación, ni servidor. Solo navegador.

1. Descarga o clona el repositorio.
2. Abre el archivo `index.html` con doble clic.

Listo. Funciona en Chrome, Edge, Firefox y Safari móvil.

> **Tip:** si prefieres servirlo con un servidor local (recomendado para que las rutas relativas a `images/` se comporten exactamente igual que en GitHub Pages), puedes correr:
> ```bash
> # con Python instalado
> python -m http.server 8000
> ```
> y luego abrir `http://localhost:8000`.

---

## 3. Cómo cada estudiante agrega sus imágenes

Cada estudiante tiene una carpeta dedicada en `images/`:

- `images/carlos/`
- `images/anamaria/`
- `images/duvan/`
- `images/henry/`

Dentro de tu carpeta:

1. Sube **20 imágenes** con estos nombres exactos (5 por capítulo × 4 capítulos):

   ```
   past-1.jpg     past-2.jpg     past-3.jpg     past-4.jpg     past-5.jpg
   achieved-1.jpg achieved-2.jpg achieved-3.jpg achieved-4.jpg achieved-5.jpg
   thismonth-1.jpg thismonth-2.jpg thismonth-3.jpg thismonth-4.jpg thismonth-5.jpg
   future-1.jpg   future-2.jpg   future-3.jpg   future-4.jpg   future-5.jpg
   ```

2. La imagen `past-1.jpg` corresponde a tu oración 1 del capítulo *Our Past*. La imagen `achieved-3.jpg` corresponde a tu oración 3 del capítulo *What We Have Achieved*. Y así sucesivamente.

3. Formato recomendado: `.jpg` horizontal o vertical, mínimo 1200px en su lado más largo. Buen tamaño máximo: ~500 KB por imagen para que cargue rápido.

4. Si una imagen falta, la web mostrará un placeholder elegante con el texto *"Photo coming soon"* — no se rompe nada.

5. Haz commit y push.

> **Importante:** los nombres deben ser exactos y en minúsculas. La web busca `images/<tu_id>/<capitulo>-<numero>.jpg`. Si tu archivo se llama `Past-1.JPG` o `past_1.jpg`, no aparecerá.

Cada carpeta tiene su propio `README.md` con la tabla detallada.

---

## 4. Cómo cada estudiante edita sus oraciones

1. Abre `data.js` con cualquier editor de texto.
2. Busca el bloque que comienza con tu `id` (ejemplo: `id: "duvan"`).
3. Reemplaza los textos `[Sentence 1]`, `[Sentence 2]`, ... por tus oraciones reales en cada capítulo (`past`, `achieved`, `thismonth`, `future`).
4. Guarda y recarga el navegador.

Las oraciones de **Duvan Lozano** ya están escritas — sirven de referencia del formato.

> **No cambies** los nombres de los capítulos (`past`, `achieved`, `thismonth`, `future`), ni los `id` de los estudiantes, ni los nombres mostrados — el JavaScript depende de ellos para emparejar oraciones e imágenes.

---

## 5. Cómo deployar a GitHub Pages

1. Sube el proyecto a un repositorio de GitHub (puede ser público o privado con cuenta Pro).
2. En el repo, ve a **Settings → Pages**.
3. En **Source**, selecciona la rama `main` y la carpeta `/ (root)`.
4. Guarda. GitHub te dará una URL del estilo `https://<usuario>.github.io/<repo>/`.
5. Espera 1–2 minutos y abre la URL.

Cualquier `git push` futuro a `main` actualiza el sitio automáticamente.

---

## 6. Cómo ver los cambios

- **En local:** guarda el archivo y recarga el navegador (`Ctrl + R` / `Cmd + R`).
- **En GitHub Pages:** haz `git push` a la rama `main`. Espera 1–2 minutos y refresca con caché limpia (`Ctrl + Shift + R`).

---

## 7. Estructura del proyecto

```
.
├── index.html              ← Estructura de la página
├── styles.css              ← Estilos cinematográficos
├── script.js               ← Render, animaciones, parallax
├── data.js                 ← Oraciones de cada estudiante (editable)
├── images/
│   ├── carlos/  ├── anamaria/  ├── duvan/  ├── henry/
│   └── (cada carpeta con su README.md y 20 imágenes)
└── README.md               ← Este archivo
```

---

## 8. Stack técnico

- HTML + CSS + JavaScript vanilla
- Tipografía vía Google Fonts CDN (Playfair Display + Inter)
- Animaciones con `IntersectionObserver` y `requestAnimationFrame`
- Sin build step, sin dependencias, sin npm

Compatible con navegadores modernos. Móvil simplifica el parallax para mantener 60 fps.

---

*Think About Ourselves — English Class 2026.*
