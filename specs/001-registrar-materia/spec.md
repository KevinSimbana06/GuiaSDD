# Spec 001 — Registrar una materia

Estado: aprovado
HU de origen: docs/historias/HU-001.md

## Contexto y objetivo

Permitir que un estudiante registre una materia nueva junto con la nota de su
primer bimestre, para conservarla en su lista y completarla cuando disponga de
la nota del segundo bimestre.

## Usuarios

- Estudiante que registra y consulta sus materias.

## Historias de usuario

Como estudiante, quiero guardar una materia con la nota de mi primer bimestre,
para tenerla registrada y completarla cuando salga la del segundo.

## Definiciones

- **Nombre normalizado:** nombre sin espacios al inicio ni al final, conservando
  las mayúsculas internas escritas por el estudiante.
- **Materia repetida:** materia cuyo nombre normalizado coincide con otro nombre
  guardado sin distinguir mayúsculas de minúsculas.
- **Nota válida:** valor entre 0 y 20, inclusive, con como máximo dos cifras
  decimales después de aplicar el redondeo definido en esta spec.

## Requisitos funcionales

- **RF-001:** CUANDO el estudiante ingresa un nombre y una nota válida de
  primer bimestre y solicita guardar, EL SISTEMA guarda la materia y la
  muestra en su lista con el nombre normalizado y la nota numérica normalizada.
  Origen: escenario «Guardar una materia» de HU-001; decisiones 1, 6 y 9.

- **RF-002:** SI el nombre está vacío después de quitar los espacios externos,
  ENTONCES EL SISTEMA muestra el mensaje
  «Escribe el nombre de la materia.» junto al campo del nombre, conserva lo
  escrito y no guarda la materia. Origen: escenario «Datos incompletos o
  inválidos» de HU-001; decisiones 3, 10 y 14.

- **RF-003:** SI la nota está vacía, ENTONCES EL SISTEMA muestra un mensaje
  «Escribe una nota entre 0 y 20 con hasta dos decimales.» junto al campo de
  la nota, conserva lo escrito y no guarda la materia. Origen: escenario
  «Datos incompletos o inválidos» de HU-001; decisiones 3 y 10.

- **RF-004:** SI la nota es menor que 0, mayor que 20 o no representa un valor
  numérico válido, ENTONCES EL SISTEMA muestra el mensaje «Escribe una nota
  entre 0 y 20 con hasta dos decimales.» junto al campo de la nota, conserva
  lo escrito y no guarda la materia. Origen: escenario «Datos incompletos o
  inválidos» de HU-001; decisiones 1 y 10.

- **RF-005:** CUANDO el estudiante escribe una nota con espacios al inicio o
  al final, EL SISTEMA ignora esos espacios antes de validar y guardar el
  valor. SI el estudiante escribe una nota con coma como separador decimal,
  ENTONCES EL SISTEMA la rechaza y muestra el mensaje «Escribe una nota entre
  0 y 20 con hasta dos decimales.» junto al campo de la nota. Origen:
  decisión 11.

- **RF-006:** CUANDO la nota contiene más de dos cifras decimales, EL SISTEMA
  aplica redondeo convencional a dos cifras antes de validar y guardar el
  valor. Origen: decisión 8 y decisión 9.

- **RF-007:** SI la materia ya existe con un nombre que coincide sin distinguir
  mayúsculas de minúsculas, ENTONCES EL SISTEMA muestra el mensaje «Ya tienes
  una materia con ese nombre.» junto al campo del nombre, conserva los datos
  del formulario y no crea una segunda entrada. Origen: escenario «Materia
  repetida» de HU-001; decisiones 2, 5 y 12.

- **RF-008:** EL SISTEMA muestra y conserva el nombre normalizado de cada materia
  guardada, sin espacios externos y manteniendo las mayúsculas internas
  introducidas por el estudiante. Origen: decisión 6.

- **RF-009:** SI el sistema no puede persistir una materia válida, ENTONCES EL
  SISTEMA muestra el mensaje «No se registro la materia.», conserva los datos
  del formulario y no muestra la materia como guardada. Origen: decisión 7 y
  decisión 13.

- **RF-010:** CUANDO el estudiante cierra la aplicación y vuelve a abrirla,
  EL SISTEMA conserva y muestra en la lista cada materia previamente guardada
  junto con su nota de primer bimestre. Origen: escenario «Conservar mis datos»
  de HU-001.

- **RF-011:** MIENTRAS exista un campo inválido, EL SISTEMA bloquea el guardado
  hasta que todos los campos sean válidos y conserva lo que el estudiante haya
  escrito en el formulario. Origen: decisión 3.

## Requisitos no funcionales

- **RNF-001:** Todos los mensajes visibles para el estudiante deben estar en
  español y deben indicar qué dato requiere corrección.
- **RNF-002:** La información guardada debe conservarse entre cierres y nuevas
  aperturas de la aplicación.
- **RNF-003:** La validación y comparación de nombres y notas debe producir el
  mismo resultado para los mismos datos, incluidos los límites 0 y 20.
- **RNF-004:** La interfaz debe permitir corregir un campo inválido sin perder
  los demás datos ya introducidos.

## Casos límite

- Nombre compuesto por solo espacios: se considera vacío después de
  normalizarlo.
- Nombre que, tras quitar los espacios externos, contiene únicamente espacios
  internos o caracteres no visibles: se considera válido.
- Nombre con espacios externos: se guarda sin esos espacios.
- Nombres que solo difieren en mayúsculas: se consideran la misma materia.
- Nota `0` y nota `20`: son válidas.
- Nota negativa o superior a `20`: es inválida.
- Nota con coma como separador decimal: es inválida y muestra el mensaje de
  nota inválida.
- Nota con punto decimal: se acepta.
- Nota `7.126`: se normaliza a `7.13`.
- Nota `7.124`: se normaliza a `7.12`.
- Intento de guardar un duplicado: no modifica ni duplica la materia existente.
- Fallo de persistencia: la materia no aparece en la lista como guardada.

## Fuera de alcance

- Registrar la nota del segundo bimestre.
- Calcular el estado académico o la calificación requerida en el supletorio.
- Guardar la nota del supletorio.
- Editar o eliminar materias ya guardadas.
- Sincronizar datos entre dispositivos o cuentas.

## Criterios de finalización

- Los cuatro escenarios de HU-001 están cubiertos por requisitos funcionales
  verificables.
- Los datos incompletos, inválidos y duplicados no generan materias guardadas.
- Una materia válida aparece en la lista con su nombre y nota normalizados.
- Las materias guardadas siguen disponibles después de cerrar y abrir la
  aplicación.
- Un fallo de persistencia no presenta una materia como guardada y conserva el
  formulario.
- Los límites de nota `0`, `20`, valores fuera de rango y el redondeo indicado
  tienen un comportamiento definido.
- No existen contradicciones sin señalar entre esta spec, las decisiones y la
  constitución del proyecto.

## Dudas abiertas

No hay dudas abiertas.
