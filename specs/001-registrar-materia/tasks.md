# Tareas — Spec 001: Registrar una materia

## [x] T1. Definir la lógica de validación y normalización
- RF-002, RF-003, RF-004, RF-005, RF-006, RF-008, RF-011, RNF-003
- Hecho cuando: las pruebas unitarias cubren nombre vacío, nota vacía, nota fuera de rango, coma como separador, redondeo y límites 0/20, y pasan con npx jest.

## [x] T2. Preparar la persistencia local y la carga inicial
- RF-010, RF-009, RNF-002
- Hecho cuando: la prueba de AsyncStorage verifica que una materia guardada puede leerse al abrir la aplicación y que una escritura fallida no marca la materia como guardada.

## [x] T3. Crear el flujo de guardado del formulario
- RF-001, RF-007, RF-009, RNF-001, RNF-004
- Hecho cuando: la prueba del flujo de guardado confirma que una materia válida se añade a la lista, un duplicado bloquea la creación y un error de persistencia conserva los datos del formulario.

## [x] T4. Construir la pantalla principal con formulario y lista
- RF-001, RF-010, RNF-001, RNF-004
- Hecho cuando: la pantalla renderiza el campo de nombre, el campo de nota, el mensaje de error junto al campo correcto y la materia guardada aparece en la lista con nombre y nota normalizados.

## [x] T5. Implementar mensajes inline y bloqueo del botón de guardar
- RF-002, RF-003, RF-004, RF-005, RF-007, RF-011
- Hecho cuando: el formulario bloquea el guardado mientras haya errores y cada campo inválido mantiene el valor escrito con su mensaje exacto junto al control.

## [x] T6. Validación manual en Expo Go y cierre de la historia
- RF-001, RF-002, RF-003, RF-004, RF-005, RF-006, RF-007, RF-009, RF-010, RF-011
- Hecho cuando: se confirma manualmente en Expo Go que los cuatro escenarios de HU-001 cumplen las reglas visibles y que la materia guardada sigue disponible tras cerrar y volver a abrir la aplicación.

## Orden de dependencia
1. T1
2. T2
3. T3
4. T4
5. T5
6. T6

Si la ejecución del plan requiere más de 10 tareas, se divide la spec y se reordena el alcance antes de implementar; con este alcance, el plan cabe en 6 tareas y cada una se ejecuta en 20-30 minutos.
