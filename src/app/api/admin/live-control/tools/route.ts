import { EstadoPartido, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireLiveControlAccess } from "@/features/live-control/helpers/live-control-permissions";
import {
  liveLineupPayloadSchema,
  simulatorMockPredictionsSchema,
  simulatorPhaseRankingSchema,
  simulatorPhaseResultsSchema,
  bulkSelectedMatchesMetadataSchema,
  liveStatsPayloadSchema,
  liveToolActionSchema,
  manualCardSchema,
  manualGoalSchema,
} from "@/features/live-control/schemas/live-control.schemas";
import {
  cleanupDuplicateLiveGoals,
  createManualCard,
  createManualGoal,
  recalculatePointsForMatch,
  recalculateRankingFromPredictions,
  recalculateScoreFromEvents,
  syncLiveMatches,
  syncSingleMatchNow,
  updateLiveMatchStatus,
  validateMatchLiveConsistency,
} from "@/features/live-control/services/live-control.service";
import { sendPushNotificationToUser } from "@/features/push/services/push-notification.service";
import {
  notifyMatchFinished,
  notifyPredictionClosingSoon,
  notifyTodayMatches,
} from "@/features/push/services/push-notification-examples.service";
import {
  generateMockPredictionsForPhase,
  recalculateRankingForPhase,
  simulatePhaseResults,
} from "@/features/world-cup-simulator/services/simulator-persistence.service";
import {
  createResultado,
  getResultadoByPartidoId,
  updatePartidosMetadataByIds,
  updateResultado,
} from "@/features/partidos/services/partido.service";
import { resetFixtureFromApi } from "@/features/partidos/services/fixture-reset.service";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function ok(message: string, data?: unknown, warnings?: string[]) {
  return {
    status: warnings?.length ? "warning" : "ok",
    message,
    data,
    warnings,
    timestamp: new Date().toISOString(),
  };
}

function toJsonInput(value: unknown) {
  return value === null || value === undefined
    ? Prisma.JsonNull
    : (value as Prisma.InputJsonValue);
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireLiveControlAccess(req);
    const body = await req.json();
    const parsed = liveToolActionSchema.parse(body);
    const payload = parsed.payload ?? {};

    switch (parsed.action) {
      case "sync_match": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }
        const result = await syncSingleMatchNow(parsed.partidoId);
        return NextResponse.json(ok("Partido sincronizado.", result));
      }
      case "sync_live": {
        const result = await syncLiveMatches();
        return NextResponse.json(ok(result.message, result.items));
      }
      case "recalculate_score": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }
        await recalculateScoreFromEvents(parsed.partidoId, user.id);
        return NextResponse.json(ok("Marcador recalculado desde eventos."));
      }
      case "recalculate_points": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }
        const result = await recalculatePointsForMatch(parsed.partidoId);
        return NextResponse.json(ok("Puntos recalculados.", result));
      }
      case "recalculate_ranking": {
        const result = await recalculateRankingFromPredictions();
        return NextResponse.json(ok("Ranking recalculado.", result));
      }
      case "cleanup_duplicate_events": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }
        const result = await cleanupDuplicateLiveGoals(parsed.partidoId, user.id);
        return NextResponse.json(ok("Eventos duplicados procesados.", result));
      }
      case "validate_match": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }
        const result = await validateMatchLiveConsistency(parsed.partidoId);
        return NextResponse.json(result);
      }
      case "set_live":
      case "set_halftime":
      case "set_finished": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }
        const estado =
          parsed.action === "set_live"
            ? EstadoPartido.EN_JUEGO
            : parsed.action === "set_halftime"
              ? EstadoPartido.ENTRETIEMPO
              : EstadoPartido.FINALIZADO;
        await updateLiveMatchStatus({
          partidoId: parsed.partidoId,
          estado,
          minuto:
            typeof payload.minute === "number"
              ? payload.minute
              : estado === EstadoPartido.FINALIZADO
                ? 90
                : null,
          observacion: typeof payload.observacion === "string" ? payload.observacion : null,
          userId: user.id,
        });
        return NextResponse.json(ok("Estado actualizado."));
      }
      case "update_minute": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }
        await updateLiveMatchStatus({
          partidoId: parsed.partidoId,
          estado: EstadoPartido.EN_JUEGO,
          minuto: typeof payload.minute === "number" ? payload.minute : null,
          observacion: "Minuto actualizado manualmente.",
          userId: user.id,
        });
        return NextResponse.json(ok("Minuto actualizado."));
      }
      case "update_partial_result":
      case "create_manual_goal": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }
        const goal = manualGoalSchema.parse(payload);
        const result = await createManualGoal({
          partidoId: parsed.partidoId,
          team: goal.team,
          minute: goal.minute,
          playerId: goal.playerId,
          description: goal.description,
          userId: user.id,
        });
        return NextResponse.json(ok("Gol manual cargado.", result));
      }
      case "upsert_lineup": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }

        const lineupPayload = liveLineupPayloadSchema.parse(payload);
        const existingResult = await getResultadoByPartidoId(parsed.partidoId);
        const lineupUpdate =
          "side" in lineupPayload
            ? lineupPayload.side === "LOCAL"
              ? { alineacionLocal: lineupPayload.lineup }
              : { alineacionVisitante: lineupPayload.lineup }
            : {
                ...(lineupPayload.alineacionLocal
                  ? { alineacionLocal: lineupPayload.alineacionLocal }
                  : {}),
                ...(lineupPayload.alineacionVisitante
                  ? { alineacionVisitante: lineupPayload.alineacionVisitante }
                  : {}),
              };

        const result = existingResult
          ? await updateResultado(parsed.partidoId, lineupUpdate)
          : await createResultado({
              partidoId: parsed.partidoId,
              ...lineupUpdate,
            });

        await prisma.partidoLiveAudit.create({
          data: {
            partidoId: parsed.partidoId,
            userId: user.id,
            accion: parsed.action,
            valorNuevo: toJsonInput(lineupUpdate),
          },
        });

        return NextResponse.json(
          ok("Formacion cargada correctamente.", {
            alineacionLocal: result.alineacionLocal ?? null,
            alineacionVisitante: result.alineacionVisitante ?? null,
          }),
        );
      }
      case "upsert_stats": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }

        const statsPayload = liveStatsPayloadSchema.parse(payload);
        const existingResult = await getResultadoByPartidoId(parsed.partidoId);
        const result = existingResult
          ? await updateResultado(parsed.partidoId, statsPayload)
          : await createResultado({
              partidoId: parsed.partidoId,
              ...statsPayload,
            });

        await prisma.partidoLiveAudit.create({
          data: {
            partidoId: parsed.partidoId,
            userId: user.id,
            accion: parsed.action,
            valorNuevo: toJsonInput(statsPayload),
          },
        });

        return NextResponse.json(
          ok("Estadísticas cargadas correctamente.", {
            estadisticasLocal: result.estadisticasLocal ?? null,
            estadisticasVisitante: result.estadisticasVisitante ?? null,
          }),
        );
      }
      case "upsert_squad_note":
      case "upsert_scorer_note":
      case "upsert_penalties_note": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }
        await prisma.partidoLiveAudit.create({
          data: {
            partidoId: parsed.partidoId,
            userId: user.id,
            accion: parsed.action,
            valorNuevo: toJsonInput(payload),
          },
        });
        return NextResponse.json(
          ok(
            "Accion tecnica registrada. La integracion completa queda lista para enganchar con el service existente correspondiente.",
            payload,
            ["Se registro la auditoria, pero esta accion todavia no actualiza un modelo especifico."],
          ),
        );
      }
      case "upsert_cards_note": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }

        const card = manualCardSchema.parse(payload);
        const result = await createManualCard({
          partidoId: parsed.partidoId,
          team: card.team,
          minute: card.minute,
          playerId: card.playerId,
          cardType: card.cardType,
          description: card.description,
          userId: user.id,
        });

        return NextResponse.json(
          ok("Tarjeta cargada correctamente.", {
            createdEvents: result,
          }),
        );
      }
      case "simulate_phase_results": {
        const result = await simulatePhaseResults(
          simulatorPhaseResultsSchema.parse(payload).phase,
        );

        return NextResponse.json(
          ok(`Resultados simulados para ${result.phaseName}.`, result),
        );
      }
      case "generate_mock_predictions": {
        const parsedPayload = simulatorMockPredictionsSchema.parse(payload);
        const result = await generateMockPredictionsForPhase(
          parsedPayload.phase,
          parsedPayload.userCount,
        );

        return NextResponse.json(
          ok(`Pronosticos mock generados para ${result.phaseName}.`, result),
        );
      }
      case "recalculate_phase_ranking": {
        const result = await recalculateRankingForPhase(
          simulatorPhaseRankingSchema.parse(payload).phase,
        );

        return NextResponse.json(
          ok(`Ranking recalculado para ${result.phaseName}.`, result),
        );
      }
      case "bulk_update_selected_matches_metadata": {
        const parsedPayload = bulkSelectedMatchesMetadataSchema.parse(payload);
        const result = await updatePartidosMetadataByIds(parsedPayload.partidoIds, {
          fecha: parsedPayload.fecha ? new Date(parsedPayload.fecha) : undefined,
          estadio: parsedPayload.estadio,
          ciudad: parsedPayload.ciudad,
        });

        return NextResponse.json(
          ok(
            `Se actualizaron ${result.updatedCount} partidos seleccionados.`,
            result,
          ),
        );
      }
      case "reset_fixture_from_api": {
        const result = await resetFixtureFromApi();

        return NextResponse.json(
          ok(
            "Foja cero completada. Se reinicio fixture, resultados, pronosticos y ranking desde la API.",
            result,
          ),
        );
      }
      case "send_test_push": {
        const partido = parsed.partidoId
          ? await prisma.partido.findUnique({
              where: { id: parsed.partidoId },
              include: {
                seleccionLocal: true,
                seleccionVisitante: true,
              },
            })
          : null;

        const title =
          typeof payload.title === "string" && payload.title.trim()
            ? payload.title.trim()
            : "Prueba de notificacion";
        const body =
          typeof payload.body === "string" && payload.body.trim()
            ? payload.body.trim()
            : partido
              ? `Live Control: ${partido.seleccionLocal.nombre} vs ${partido.seleccionVisitante.nombre}`
              : "Esta es una push de prueba enviada desde Live Control.";
        const url =
          typeof payload.url === "string" && payload.url.trim()
            ? payload.url.trim()
            : parsed.partidoId
              ? `/pronosticos/partidos/${parsed.partidoId}/detalle`
              : "/inicio";

        const result = await sendPushNotificationToUser(user.id, {
          title,
          body,
          url,
          tag: parsed.partidoId
            ? `live-control-test:${parsed.partidoId}`
            : "live-control-test",
          data: {
            source: "live-control",
            partidoId: parsed.partidoId ?? null,
            tipo: "TEST_PUSH",
          },
        });

        return NextResponse.json(
          ok("Push de prueba enviada.", result, result.total === 0
            ? ["El usuario autenticado no tiene suscripciones push activas."]
            : undefined),
        );
      }
      case "notify_today_matches": {
        const result = await notifyTodayMatches({
          body: typeof payload.body === "string" ? payload.body : undefined,
        });

        return NextResponse.json(
          ok(
            "Notificacion manual de partidos de hoy enviada.",
            result,
            result.total === 0
              ? ["No hay usuarios con suscripciones push activas."]
              : result.matches.length === 0
                ? ["Hoy no hay partidos programados. Se envio el mensaje igualmente."]
                : undefined,
          ),
        );
      }
      case "notify_prediction_closing_soon": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }

        const result = await notifyPredictionClosingSoon({
          partidoId: parsed.partidoId,
          body: typeof payload.body === "string" ? payload.body : undefined,
        });

        return NextResponse.json(
          ok(
            "Recordatorio de cierre de pronostico enviado.",
            result,
            result.total === 0
              ? ["No hay usuarios pendientes con suscripciones push activas para este partido."]
              : undefined,
          ),
        );
      }
      case "notify_match_finished": {
        if (!parsed.partidoId) {
          return NextResponse.json({ message: "partidoId es obligatorio." }, { status: 400 });
        }

        const result = await notifyMatchFinished({
          partidoId: parsed.partidoId,
          body: typeof payload.body === "string" ? payload.body : undefined,
        });

        return NextResponse.json(
          ok(
            "Notificacion de partido finalizado enviada.",
            result,
            result.total === 0
              ? ["No hay usuarios con pronosticos y suscripciones push activas para este partido."]
              : undefined,
          ),
        );
      }
      default:
        return NextResponse.json({ message: "Accion no soportada." }, { status: 400 });
    }
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (
      err instanceof Error &&
      (err.message === "FORBIDDEN" || err.message === "LIVE_CONTROL_FORBIDDEN")
    ) {
      return NextResponse.json({ message: "Acceso denegado." }, { status: 403 });
    }

    if (
      err instanceof Error &&
      err.message === "RANKING_RECALCULATION_IN_PROGRESS"
    ) {
      return NextResponse.json(
        { message: "Ya hay un recalculo de ranking en curso." },
        { status: 409 },
      );
    }

    console.error("POST /api/admin/live-control/tools error:", err);
    return NextResponse.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : "Error interno del servidor",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
