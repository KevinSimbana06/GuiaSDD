# Plan 001 — Registrar una materia

## 1. Archivos y responsabilidades

- specs/001-registrar-materia/plan.md: define la solución técnica y la estrategia de comprobación.
- specs/001-registrar-materia/tasks.md: orden de ejecución de la implementación.
- src/domain/materia.ts: lógica pura para normalizar nombre, validar nota, detectar duplicados y preparar la entidad a guardar.
- src/domain/materia.test.ts: pruebas unitarias de validación, redondeo y comparación de duplicados.
- src/storage/materiasStorage.ts: persistencia local con AsyncStorage y lectura de la lista guardada.
- src/storage/materiasStorage.test.ts: pruebas de persistencia con almacenamiento mockeado.
- src/app/index.tsx: formulario del registro, mensajes inline, lista de materias y manejo del estado del formulario.
- src/types/materia.ts: contrato compartido para la materia guardada (nombre normalizado y nota numérica).

Cobertura por RF:
- RF-001, RF-006, RF-008, RF-010, RF-011 y RNF-002/RNF-003: se resuelven en la capa de dominio y almacenamiento.
- RF-002, RF-003, RF-004, RF-005, RF-007, RF-009 y RNF-001/RNF-004: se resuelven en la vista del formulario y en el flujo de guardado.

## 2. Funciones puras de lógica

Se implementará una capa pura sin React ni AsyncStorage:

- normalizeSubjectName(name: string): string
  - Elimina espacios externos y conserva mayúsculas internas (decisión 2 y decisión 6).
- normalizeNumericInput(raw: string): number | null
  - Recorta espacios externos, acepta solo formato decimal con punto y rechaza coma (decisiones 9, 11 y RF-005).
- roundToTwoDecimals(value: number): number
  - Aplica redondeo convencional a dos decimales con precisión determinista (decisión 9).
- isValidScore(value: number): boolean
  - Verifica 0 <= value <= 20 (decisión 1).
- buildSubjectDraft(name: string, scoreInput: string): { valid: boolean, normalizedName: string, normalizedScore: number, errors: { name?: string, score?: string } }
  - Centraliza validación, mensajes y preparación del dato antes de persistir.
- hasDuplicateName(existingNames: string[], normalizedName: string): boolean
  - Compara sin distinguir mayúsculas ni minúsculas y produce el mismo resultado para los mismos datos (decisión 2 y RNF-003).

Estas funciones permitirán pruebas con Jest sin depender del entorno móvil ni del almacenamiento local.

## 3. Persistencia

Se usará AsyncStorage con una clave fija, por ejemplo "materias-v1", con un arreglo serializado en JSON. La estructura tiene este formato:

- { id: string, name: string, firstBim: number }

Decisiones técnicas aplicadas:
- Se guarda la lista completa en un único registro para simplificar la carga al abrir la app y conservar la lista entre cierres (decisión 7, RNF-002 y RF-010).
- Si la lectura o escritura falla, la UI conserva el formulario y muestra el mensaje exacto «No se registro la materia.» sin marcar la materia como guardada (decisión 13 y RF-009).
- La comparación y validación de nombres y notas se hace con la misma lógica de dominio en cada acceso, evitando divergencias entre pantalla y persistencia (RNF-003).

## 4. Algoritmo en pseudocódigo

function onSubmit(form):
  nameValue = trim(form.name)
  scoreValue = trim(form.score)

  if nameValue == "":
    setError("name", "Escribe el nombre de la materia.")
    return

  if scoreValue == "":
    setError("score", "Escribe una nota entre 0 y 20 con hasta dos decimales.")
    return

  parsed = parseDecimal(scoreValue)
  if parsed is null or parsed < 0 or parsed > 20:
    setError("score", "Escribe una nota entre 0 y 20 con hasta dos decimales.")
    return

  rounded = roundToTwoDecimals(parsed)
  normalizedName = normalizeSubjectName(nameValue)

  if hasDuplicateName(existingSubjects.map(s => s.name), normalizedName):
    setError("name", "Ya tienes una materia con ese nombre.")
    return

  nextItem = { id: createId(), name: normalizedName, firstBim: rounded }

  try:
    persistList([...existingSubjects, nextItem])
    clearForm()
    appendToVisibleList(nextItem)
  catch:
    setError("form", "No se registro la materia.")
    keepFormValues()

function onAppLoad():
  try:
    list = readPersistedList()
    renderList(list)
  catch:
    renderList([])

## 5. Cómo se pinta en la interfaz

- La pantalla principal deberá mostrar un formulario con dos campos: nombre de la materia y nota del primer bimestre.
- Los mensajes de error se muestran junto al campo que requiere corrección, exactamente como lo exige la spec y la decisión 12.
- Mientras existan errores de validación, el botón de guardar debe permanecer deshabilitado para evitar guardar datos incompletos o inválidos (RF-011).
- Al guardar correctamente, la materia nueva se renderiza en la lista con el nombre normalizado y la nota numérica normalizada.
- El formulario conserva los valores introducidos si existe un error o si falla la persistencia, sin perder la información ya escrita (RF-009, RNF-004).
- Al reabrir la app, el estado persistido se carga desde AsyncStorage y se renderiza la lista completa (RF-010).

## 6. Decisiones técnicas justificadas

- Decisión 2 y 6: normalización del nombre y comparación insensible a mayúsculas. Alternativa descartada: guardar la cadena original tal cual y comparar sin normalizar; esto duplicaría materias con diferencias mínimas de escritura.
- Decisión 9 y 11: redondeo a dos decimales y rechazo de la coma como separador decimal. Alternativa descartada: aceptar coma y almacenarla en texto; eso habría introducido dos formatos paralelos y consumo de reglas adicionales para cada representación.
- Decisión 7 y 13: fallo de persistencia con mensaje explícito y conservación del formulario. Alternativa descartada: ocultar el fallo o limpiar el formulario; esto genera pérdida de datos y un estado falso en la UI.
- Decisión 12: aviso de duplicado junto al nombre. Alternativa descartada: mostrar el mensaje globalmente; reduce la claridad del dato que requiere corrección.
- RNF-002 y RF-010: persistencia local con AsyncStorage. Alternativa descartada: almacenamiento en memoria únicamente; rompe la obligación de conservar los datos entre cierres.

## 7. Estrategia de pruebas con Jest

Se escribirá primero la prueba unitaria de la lógica pura y luego la prueba de persistencia:

- Prueba de normalización del nombre: espacios externos, nombres que difieren solo en mayúsculas, nombres válidos con espacios internos.
- Prueba de validación de nota: campo vacío, nota fuera de rango, valor no numérico, coma como separador decimal, notas con más de dos decimales y límites 0 y 20.
- Prueba de duplicado: misma materia con distinta capitalización y nombres diferentes.
- Prueba de guardado: lista completa persistida con JSON y carga de datos al abrir la app.
- Prueba de error de persistencia: almacenamiento fallido conserva el formulario y no muestra la materia como guardada.

Criterio: todas las pruebas de dominio deben ejecutarse con npx jest y deben cubrir los escenarios de HU-001 sin depender del runtime móvil.

## 8. Cobertura RF

- RF-001: guardar una materia válida y mostrarla con nombre y nota normalizados.
- RF-002 y RF-003: mensajes de nombre y nota vacía; bloqueo del guardado.
- RF-004 y RF-005: validación de rango, formato y espacios.
- RF-006: redondeo a dos decimales.
- RF-007: duplicado previo y mensaje junto al campo.
- RF-008: persistencia y render del nombre normalizado.
- RF-009: fallo de persistencia.
- RF-010: conservación entre cierres.
- RF-011: bloqueo del guardado mientras haya errores.
- RNF-001, RNF-002, RNF-003 y RNF-004: mensajes, persistencia, determinismo y corrección sin pérdida de datos.
