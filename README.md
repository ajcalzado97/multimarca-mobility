# Vodafone - Landing de ofertas

## Integración con Google Forms

**Arquitectura elegida:** envío directo desde el frontend al endpoint `formResponse` de Google Forms usando `fetch` con `mode: "no-cors"`, ya que este proyecto es un Vite SPA sin backend/API routes. Esto evita redirecciones visibles y permite mantener el flujo actual hacia la página de gracias.

### Flujo actual
1. El usuario completa el formulario de contacto en la landing.
2. El frontend normaliza (trim) y valida los datos.
3. Se construye un `FormData` con los `entry.*` del Google Form.
4. Se envía a `https://docs.google.com/forms/d/e/1FAIpQLSeETmoJyXmPx9OGIPyxZp-In_WOHPD66FdtpG3BpyD7mC8eeQ/formResponse` con `fetch` `no-cors`.
5. UX: botón en estado *loading* → mensaje de éxito/errores → redirección a `/gracias`.

### Entry IDs del Google Form
- Método de contacto: `entry.1347626950`
- Nombre completo: `entry.322434648`
- Email: `entry.1351031180`
- Teléfono: `entry.1561356873`
- Resumen de la oferta: `entry.1768961017`

> Estos IDs están definidos también en `src/utils/googleForm.ts` para referencia.

### Verificación manual
1. Ejecuta la landing y envía el formulario con datos de prueba.
2. Abre el Google Form y ve a **Respuestas**.
3. Verifica que aparezca una nueva respuesta con:
   - Método de contacto correcto (WhatsApp / Llamada telefónica).
   - Nombre y email con trim.
   - Teléfono (si se informó).
   - Resumen de la oferta con líneas y total.

## Scripts
- `npm run dev`
- `npm run build`
- `npm run preview`
