# Decisiones de HU-001: Registrar una materia

## 1. Rango de la nota

- **Pregunta:** ¿Qué escala y rango debe tener la nota del primer bimestre?
- **Respuesta:** La nota usa una escala de 0 a 20. Se rechazan los valores menores que 0 o mayores que 20, y se permiten valores decimales.
- **Motivo:** La historia exige validar el rango, pero no lo define. Esta regla establece los límites visibles y evita guardar notas académicamente inválidas.

## 2. Normalización del nombre y comparación de duplicados

- **Pregunta:** ¿Cómo se deben tratar los espacios externos y las mayúsculas al comprobar si una materia ya existe?
- **Respuesta:** Se quitan los espacios al inicio y al final del nombre. La comparación de duplicados no distingue mayúsculas de minúsculas; por ejemplo, “Cálculo” y “cálculo” representan la misma materia.
- **Motivo:** Evita duplicados causados únicamente por diferencias de escritura y define qué significa que dos nombres sean iguales.

## 3. Validación de datos incompletos o inválidos

- **Pregunta:** ¿Cómo debe avisar la aplicación cuando un campo necesita corrección?
- **Respuesta:** Debe mostrar un mensaje específico junto a cada campo inválido, conservar lo que el estudiante escribió y bloquear el guardado hasta que todos los campos sean válidos.
- **Motivo:** Permite corregir el dato concreto sin perder entradas ya realizadas y cumple el criterio de avisar qué se debe corregir.

## 4. Separador decimal

- **Pregunta:** ¿Qué separadores decimales se deben aceptar al escribir la nota?
- **Respuesta:** Se aceptan tanto el punto como la coma, por ejemplo, “7.5” y “7,5”. La nota se guarda como un único valor numérico normalizado.
- **Motivo:** Permite la escritura habitual en distintos formatos regionales sin guardar representaciones textuales inconsistentes.

## 5. Intento de registrar una materia repetida

- **Pregunta:** ¿Qué debe ocurrir cuando el estudiante intenta registrar una materia que ya existe?
- **Respuesta:** La aplicación debe avisar claramente que la materia ya existe, no crear una segunda entrada y conservar los datos del formulario.
- **Motivo:** Protege la lista contra duplicados y permite al estudiante corregir el nombre si fue un intento accidental.

## 6. Nombre mostrado y persistido

- **Pregunta:** ¿Qué nombre debe mostrar y conservar la aplicación después de guardar?
- **Respuesta:** Debe guardar y mostrar el nombre normalizado, sin espacios externos y manteniendo las mayúsculas internas que escribió el estudiante.
- **Motivo:** Hace consistente la información visible y la usada para detectar duplicados, sin alterar innecesariamente la forma del nombre.

## 7. Fallo al guardar de forma persistente

- **Pregunta:** ¿Cómo debe comportarse la aplicación si no puede persistir la materia?
- **Respuesta:** Debe informar que no se pudo guardar, conservar los datos en el formulario y no mostrar la materia como guardada.
- **Motivo:** Evita presentar un estado falso y permite que el estudiante vuelva a intentarlo sin perder la información introducida.

## 8. Cantidad máxima de decimales

- **Pregunta:** ¿Cuántas cifras decimales puede tener la nota?
- **Respuesta:** La nota puede tener como máximo dos cifras decimales.
- **Motivo:** Define la precisión permitida para el dato guardado y evita una precisión mayor a la necesaria para la calificación.

## 9. Redondeo

- **Pregunta:** ¿Qué debe hacer la aplicación cuando la nota tiene más de dos cifras decimales?
- **Respuesta:** Debe aplicar redondeo convencional a dos decimales antes de validar y guardar; por ejemplo, 7.126 se convierte en 7.13 y 7.124 en 7.12.
- **Motivo:** Completa la regla de precisión y establece un resultado determinista para los valores con más de dos cifras decimales.

## 10. Textos de validación

- **Pregunta:** ¿Qué textos exactos deben mostrarse para nombre vacío, nota vacía o inválida y materia duplicada?
- **Respuesta:** Para nombre vacío se muestra «Escribe el nombre de la materia.». Para nota vacía o inválida se muestra «Escribe una nota entre 0 y 20 con hasta dos decimales.». Para materia duplicada se muestra «Ya tienes una materia con ese nombre.».
- **Motivo:** Define los mensajes visibles para que indiquen concretamente la corrección requerida.

## 11. Normalización y separador de la nota

- **Pregunta:** ¿Cómo se tratan los espacios externos y la coma en la nota?
- **Respuesta:** Se ignoran los espacios al inicio y al final de la nota. La coma se rechaza con el mismo mensaje de nota inválida. Esta decisión reemplaza la aceptación de la coma definida en la decisión 4.
- **Motivo:** Define el formato aceptado de entrada y evita aceptar un separador decimal no previsto.

## 12. Ubicación del aviso de duplicado

- **Pregunta:** ¿Dónde debe aparecer el aviso de materia duplicada?
- **Respuesta:** El aviso de duplicado aparece junto al campo del nombre, igual que el aviso de nombre vacío.
- **Motivo:** Mantiene el aviso junto al dato que debe corregirse.

## 13. Texto del fallo de persistencia

- **Pregunta:** ¿Qué texto exacto debe mostrarse cuando falla la persistencia al guardar la materia?
- **Respuesta:** Se muestra «No se registro la materia.».
- **Motivo:** Define el mensaje visible cuando la materia no puede guardarse.

## 14. Nombres con espacios internos o caracteres no visibles

- **Pregunta:** ¿Qué comportamiento debe tener la aplicación cuando, tras quitar los espacios externos, el nombre contiene solo espacios internos o caracteres no visibles?
- **Respuesta:** El nombre se considera válido.
- **Motivo:** Define que esos nombres no se rechazan por su contenido interno después de normalizar los espacios externos.
