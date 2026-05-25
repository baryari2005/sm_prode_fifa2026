# Live Control Test Checklist

## Panel principal
- [ ] Entra solo usuario admin autorizado
- [ ] Usuario sin permiso no puede entrar
- [ ] Se muestran partidos live/actuales
- [ ] Se muestran proximos partidos
- [ ] Se muestran partidos no cerrados de fechas anteriores
- [ ] El marcador se calcula desde eventos

## Goles
- [ ] Puedo cargar gol local
- [ ] Puedo cargar gol visitante
- [ ] Puedo elegir jugador desde listado
- [ ] Puedo marcar metadata de gol si aplica
- [ ] El marcador se actualiza
- [ ] El evento queda `source = MANUAL`
- [ ] El evento queda `protected = true`
- [ ] El cron no duplica ese gol
- [ ] `sync-now` agrega goles nuevos sin pisar el manual

## Formaciones
- [ ] Puedo elegir formacion
- [ ] Se generan slots automaticamente
- [ ] Puedo elegir jugadores en cada posicion
- [ ] No permite duplicados
- [ ] Calcula suplentes automaticamente
- [ ] Puedo reutilizar formacion previa
- [ ] Puedo guardar formacion por partido

## Tarjetas
- [ ] Puedo cargar amarilla
- [ ] Puedo cargar segunda amarilla
- [ ] Puedo cargar roja directa
- [ ] Puedo elegir jugador
- [ ] Puedo cargar minuto
- [ ] La estadistica de tarjetas se actualiza

## Penales
- [ ] Puedo cargar penal durante partido
- [ ] Puedo cargar tanda de penales
- [ ] Puedo definir orden
- [ ] No permite orden duplicado
- [ ] Penal de tanda no altera marcador regular
- [ ] Penal durante partido convertido puede alterar marcador

## Estadisticas
- [ ] Puedo cargar remates
- [ ] Puedo cargar remates al arco
- [ ] Puedo cargar posesion
- [ ] Puedo cargar pases
- [ ] Puedo cargar corners
- [ ] Puedo cargar faltas
- [ ] Tarjetas se derivan desde eventos
- [ ] Goles se derivan desde eventos

## Cron / Sync
- [ ] Boton sincronizar partido funciona
- [ ] Boton sincronizar todos funciona
- [ ] Cron usa la misma logica que `sync-now`
- [ ] Cron no pisa eventos manuales protegidos
- [ ] Cron agrega eventos nuevos de API
- [ ] Se registra auditoria

## Cierre de partido
- [ ] Puedo finalizar partido
- [ ] Se recalcula marcador
- [ ] Se recalculan puntos
- [ ] Se recalcula ranking
- [ ] Partido desaparece de no cerrados
- [ ] Partido queda visible como finalizado donde corresponda
