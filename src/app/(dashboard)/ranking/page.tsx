"use client";

import { useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import Loading from "../loading";

import { useRankingPage } from "@/features/pronosticos/hooks/useRankingPage";
import { RankingHeader } from "@/features/pronosticos/components/RankingHeader";
import { MyRankingSummary } from "@/features/pronosticos/components/MyRankingSummary";
import { RankingTable } from "@/features/pronosticos/components/RankingTable";
import { PronosticosHistorial } from "@/features/pronosticos/components/PronosticosHistorial";

export default function RankingPage() {
  const { miRanking, ranking, historial, loading, loadData } = useRankingPage();

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Card className="border-white/70 bg-white shadow-sm">
      <CardContent className="space-y-6 p-4 md:p-6">
        <RankingHeader />
        <MyRankingSummary data={miRanking} />
        <RankingTable rows={ranking} />
        <PronosticosHistorial rows={historial} />
      </CardContent>
    </Card>
  );
}
